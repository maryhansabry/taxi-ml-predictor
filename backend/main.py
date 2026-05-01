"""
TaxiML FastAPI Backend - FRONTEND MATCHED VERSION (FIXED)
Ensures compatibility with React UI (Upload + Preprocess + Models + Predict)
"""
 
from __future__ import annotations
import os
import uuid
import logging
import time
import tempfile
import zipfile
import math
from collections import defaultdict, deque
from typing import Dict, List, Optional, Tuple, Deque, Literal
from datetime import datetime
 
from pyspark.ml.regression import RandomForestRegressor, GBTRegressor
from pyspark.ml.evaluation import RegressionEvaluator
from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Request, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
 
from pyspark.sql import SparkSession, DataFrame
import pyspark.sql.functions as F
from pyspark.ml import Pipeline, PipelineModel
from pyspark.ml.feature import StringIndexer, VectorAssembler
from pyspark.ml.linalg import Vectors
 
# Optional XGBoost on Spark
try:
    from xgboost.spark import SparkXGBRegressor
    HAS_XGB = True
except Exception:
    HAS_XGB = False

IS_WINDOWS = os.name == "nt"
ALLOW_XGB_TRAIN = HAS_XGB and (not IS_WINDOWS or os.getenv("TAXIML_ENABLE_XGBOOST_WINDOWS") == "1")

# ---------------- APP ----------------
logger = logging.getLogger("taximl")
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="TaxiML API (Frontend Matched)", version="4.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.environ["SPARK_LOCAL_DIRS"] = r"D:\spark_tmp"
os.environ["TMPDIR"] = r"D:\spark_tmp"
os.environ["HADOOP_HOME"] = r"C:\hadoop"
os.environ["PATH"] += os.pathsep + r"C:\hadoop\bin"
os.environ["SPARK_LOCAL_IP"] = "127.0.0.1"

# ---------------- SPARK ----------------
spark = (
    SparkSession.builder
    .master("local[*]")
    .appName("TaxiML")
    .config("spark.driver.bindAddress", "127.0.0.1")
    .config("spark.driver.host", "127.0.0.1")
    .config("spark.driver.memory", "8g")
    .config("spark.network.timeout", "800s")
    .config("spark.executor.heartbeatInterval", "60s")
    .config("spark.sql.shuffle.partitions", "50")
    .config("spark.sql.execution.arrow.pyspark.enabled", "false")
    .config("spark.sql.debug.maxToStringFields", "100")
    .config("spark.python.worker.reuse", "true")
    .config("spark.ui.showConsoleProgress", "false")
    .config("spark.local.dir", r"D:\spark_tmp")
    .getOrCreate()
)

CANONICAL = {
    "randomforest": "RandomForest",
    "randomforestregressor": "RandomForest",
    "randomforestmodel": "RandomForest",
    "rf": "RandomForest",
    "gbt": "GBT",
    "gbtregressor": "GBT",
    "gradientboostedtrees": "GBT",
    "gradientboosting": "GBT",
    "xgboost": "XGBoost",
    "sparkxgbregressor": "XGBoost",
    "xgb": "XGBoost",
}

DATASETS: Dict[str, DataFrame] = {}
MODELS: Dict[str, PipelineModel] = {}
UPLOAD_DIR = "taximl_uploads"
MODEL_DIR = "models"
MODEL_METRICS: Dict[str, dict] = {}
METRICS_DATASET_ID: str = None
MAX_UPLOAD_BYTES = int(os.getenv("TAXIML_MAX_UPLOAD_MB", "200")) * 1024 * 1024
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(MODEL_DIR, exist_ok=True)

# ---------------- FEATURES ----------------
def add_features(df: DataFrame) -> DataFrame:
    df = df.withColumn("pickup_hour", F.hour("pickup_datetime")) \
           .withColumn("pickup_day", F.dayofweek("pickup_datetime")) \
           .withColumn("pickup_month", F.month("pickup_datetime")) \
           .withColumn("is_weekend", F.when(F.col("pickup_day").isin([1, 7]), 1).otherwise(0))

    R = 6371.0
    lat1 = F.radians(F.col("pickup_latitude"))
    lon1 = F.radians(F.col("pickup_longitude"))
    lat2 = F.radians(F.col("dropoff_latitude"))
    lon2 = F.radians(F.col("dropoff_longitude"))
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = F.pow(F.sin(dlat / 2), 2) + F.cos(lat1) * F.cos(lat2) * F.pow(F.sin(dlon / 2), 2)
    c = 2 * F.asin(F.sqrt(a))
    df = df.withColumn("distance_km", F.lit(R) * c)

    df = df.withColumn(
        "manhattan_dist",
        F.abs(F.col("pickup_latitude") - F.col("dropoff_latitude")) +
        F.abs(F.col("pickup_longitude") - F.col("dropoff_longitude"))
    )
    df = df.withColumn(
        "direction",
        F.atan2(
            F.col("dropoff_latitude") - F.col("pickup_latitude"),
            F.col("dropoff_longitude") - F.col("pickup_longitude")
        )
    )
    return df

# ---------------- PIPELINE ----------------
def build_pipeline(model):
    indexer = StringIndexer(
        inputCols=["store_and_fwd_flag"],
        outputCols=["store_and_fwd_flag_index"],
        handleInvalid="keep"
    )
    assembler = VectorAssembler(
        inputCols=[
            "vendor_id", "passenger_count",
            "pickup_hour", "pickup_day", "pickup_month", "is_weekend",
            "distance_km", "manhattan_dist", "direction",
            "store_and_fwd_flag_index"
        ],
        outputCol="features",
        handleInvalid="keep"
    )
    return Pipeline(stages=[indexer, assembler, model])

# ---------------- PURE-PYTHON FEATURE COMPUTATION ----------------
# Used by /predict/manual to avoid Spark createDataFrame on Windows
FLAG_INDEX = {"N": 0.0, "Y": 1.0}   # matches StringIndexer(handleInvalid="keep") order

def _compute_features_python(
    vendor_id: int,
    passenger_count: int,
    pickup_dt: datetime,
    pickup_lat: float,
    pickup_lng: float,
    dropoff_lat: float,
    dropoff_lng: float,
    store_flag: str = "N",
) ->Vectors:
    """Compute the same feature vector the pipeline assembler would produce."""
    hour = float(pickup_dt.hour)
    # dayofweek: Python isoweekday Mon=1..Sun=7 → Spark Sun=1..Sat=7
    iso = pickup_dt.isoweekday()          # Mon=1,Sun=7
    day = float(7 if iso == 7 else iso)   # Sun stays 7, others shift
    # Spark dayofweek: Sun=1, so let's be accurate:
    day = float(iso % 7 + 1)             # Mon→2,Tue→3...Sun→1
    month = float(pickup_dt.month)
    is_weekend = 1.0 if day in (1.0, 7.0) else 0.0

    R = 6371.0
    la1 = math.radians(pickup_lat)
    lo1 = math.radians(pickup_lng)
    la2 = math.radians(dropoff_lat)
    lo2 = math.radians(dropoff_lng)
    dlat = la2 - la1
    dlon = lo2 - lo1
    a = math.sin(dlat / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin(dlon / 2) ** 2
    distance_km = R * 2 * math.asin(math.sqrt(max(0.0, min(1.0, a))))

    manhattan = abs(pickup_lat - dropoff_lat) + abs(pickup_lng - dropoff_lng)
    direction = math.atan2(dropoff_lat - pickup_lat, dropoff_lng - pickup_lng)

    flag_idx = FLAG_INDEX.get(store_flag.upper(), 0.0)

    return Vectors.dense([
        float(vendor_id),
        float(passenger_count),
        hour, day, month, is_weekend,
        distance_km, manhattan, direction,
        flag_idx,
    ])

# ---------------- HELPERS ----------------
def _normalize_name(value: str) -> str:
    return "".join(ch.lower() for ch in value if ch.isalnum())

def _canonical_model_name(value: str) -> str:
    cleaned = _normalize_name(value)
    if cleaned in CANONICAL:
        return CANONICAL[cleaned]
    fallback = value.replace("_", " ").replace("-", " ").strip()
    return fallback or "UploadedModel"

def _ordered_metric_names() -> List[str]:
    preferred = ["RandomForest", "GBT", "XGBoost"]
    ordered = [name for name in preferred if name in MODEL_METRICS]
    ordered.extend(sorted(name for name in MODEL_METRICS if name not in preferred))
    return ordered

def _metrics_payload(mode: str, fallback_best: Optional[str] = None) -> dict:
    metrics = [MODEL_METRICS[name] for name in _ordered_metric_names()]
    best = min(metrics, key=lambda item: item["rmse"])["model"] if metrics else (fallback_best or "")
    return {"best_model": best, "metrics": metrics, "mode": mode}

def _ensure_metrics_dataset(dataset_id: Optional[str]) -> None:
    global METRICS_DATASET_ID
    if not dataset_id:
        return
    if METRICS_DATASET_ID != dataset_id:
        MODEL_METRICS.clear()
        METRICS_DATASET_ID = dataset_id

def _candidate_model_dirs(root_dir: str) -> List[str]:
    candidates: List[str] = []
    for current_root, dirnames, _ in os.walk(root_dir):
        names = set(dirnames)
        if "metadata" in names and ("stages" in names or "data" in names):
            candidates.append(current_root)
    candidates.sort(key=lambda path: (path.count(os.sep), len(path)))
    return candidates

def _load_pipeline_model_from_zip(data: bytes, filename: str) -> Tuple[str, PipelineModel]:
    hinted_name = os.path.splitext(os.path.basename(filename or "uploaded_model.zip"))[0]
    with tempfile.TemporaryDirectory(prefix="taximl_model_") as tmpdir:
        archive_path = os.path.join(tmpdir, "model.zip")
        extracted_dir = os.path.join(tmpdir, "unzipped")
        os.makedirs(extracted_dir, exist_ok=True)
        with open(archive_path, "wb") as f:
            f.write(data)
        try:
            with zipfile.ZipFile(archive_path) as zf:
                zf.extractall(extracted_dir)
        except zipfile.BadZipFile as exc:
            raise HTTPException(status_code=400, detail="A valid ZIP file is required") from exc

        for root, dirs, files in os.walk(extracted_dir):
            rel = os.path.relpath(root, extracted_dir)
            logger.info("ZIP contents: %s/ dirs=%s", rel, dirs)

        candidates = _candidate_model_dirs(extracted_dir)
        logger.info("Candidate model dirs: %s", candidates)
        if not candidates:
            raise HTTPException(status_code=400, detail="ZIP must contain a Spark PipelineModel folder (needs metadata/ and stages/ or data/)")

        last_error: Optional[Exception] = None
        for candidate in candidates:
            try:
                model = PipelineModel.load(candidate)
                candidate_name = os.path.basename(candidate)
                resolved_name = _canonical_model_name(hinted_name)
                if resolved_name == hinted_name.replace("_", " ").replace("-", " ").strip():
                    resolved_name = _canonical_model_name(candidate_name)
                logger.info("Loaded model '%s' from %s", resolved_name, candidate)
                return resolved_name, model
            except Exception as exc:
                logger.warning("Failed to load candidate %s: %s", candidate, exc)
                last_error = exc

        raise HTTPException(status_code=400, detail=f"Could not load PipelineModel: {last_error}")

def _evaluate(pred: DataFrame) -> dict:
    rmse = RegressionEvaluator(labelCol="trip_duration", predictionCol="prediction", metricName="rmse").evaluate(pred)
    mae  = RegressionEvaluator(labelCol="trip_duration", predictionCol="prediction", metricName="mae").evaluate(pred)
    r2   = RegressionEvaluator(labelCol="trip_duration", predictionCol="prediction", metricName="r2").evaluate(pred)
    return {"rmse": rmse, "mae": mae, "r2": r2}

def _evaluate_and_store(model_name: str, model: PipelineModel, test_df: DataFrame, train_seconds: Optional[float] = None) -> dict:
    metrics = _evaluate(model.transform(test_df))
    metrics["model"] = model_name
    if train_seconds is not None:
        metrics["train_seconds"] = train_seconds
    MODELS[model_name] = model
    MODEL_METRICS[model_name] = metrics
    return metrics

# ---------------- HEALTH ----------------
@app.get("/health")
def health():
    return {"status": "ok", "spark": spark.version}

# ---------------- UPLOAD ----------------
@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    try:
        path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}.csv")
        with open(path, "wb") as f:
            f.write(await file.read())
        df = spark.read.csv(path, header=True, inferSchema=True)
        dataset_id = str(uuid.uuid4())
        DATASETS[dataset_id] = df
        schema = [{"name": f.name, "type": str(f.dataType)} for f in df.schema]
        preview = [row.asDict() for row in df.limit(5).collect()]
        return {"dataset_id": dataset_id, "rows": df.count(), "columns": df.columns, "schema": schema, "preview": preview}
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=500, detail=str(e))

# ---------------- PREPROCESS ----------------
@app.post("/preprocess")
def preprocess(dataset_id: str):
    if dataset_id not in DATASETS:
        raise HTTPException(status_code=404, detail="Dataset not found")
    df = DATASETS[dataset_id]
    before = df.count()
    df = df.filter((F.col("trip_duration") > 60) & (F.col("trip_duration") < 9000)).dropDuplicates()
    df = add_features(df)
    DATASETS[dataset_id] = df
    after = df.count()
    preview = [row.asDict() for row in df.limit(5).collect()]
    return {
        "dataset_id": dataset_id,
        "rows_before": before,
        "rows_after": after,
        "features_added": ["pickup_hour", "pickup_day", "pickup_month", "is_weekend", "distance_km", "manhattan_dist", "direction"],
        "preview": preview
    }

# ---------------- TRAIN ----------------
@app.post("/models/train")
def train(dataset_id: str):
    if dataset_id not in DATASETS:
        raise HTTPException(status_code=404, detail="Dataset not found")
    _ensure_metrics_dataset(dataset_id)
    df = DATASETS[dataset_id]
    sampled_df = df.sample(False, float(os.getenv("TAXIML_TRAIN_SAMPLE", "0.25")), seed=42)
    if sampled_df.count() == 0:
        sampled_df = df
    train_df, test_df = sampled_df.randomSplit([0.8, 0.2], seed=42)
    train_df.cache()
    test_df.cache()
    metrics: List[dict] = []

    t0 = time.time()
    rf_model = build_pipeline(RandomForestRegressor(featuresCol="features", labelCol="trip_duration", numTrees=15, maxDepth=7)).fit(train_df)
    metrics.append(_evaluate_and_store("RandomForest", rf_model, test_df, time.time() - t0))

    t0 = time.time()
    gbt_model = build_pipeline(GBTRegressor(featuresCol="features", labelCol="trip_duration", maxIter=15, maxDepth=4, stepSize=0.1)).fit(train_df)
    metrics.append(_evaluate_and_store("GBT", gbt_model, test_df, time.time() - t0))

    if ALLOW_XGB_TRAIN:
        t0 = time.time()
        try:
            xgb = SparkXGBRegressor(features_col="features", label_col="trip_duration", max_depth=4, eta=0.1, num_workers=1, n_estimators=30, spark_task_cpus=1)
            xgb_model = build_pipeline(xgb).fit(train_df)
            metrics.append(_evaluate_and_store("XGBoost", xgb_model, test_df, time.time() - t0))
        except Exception:
            logger.exception("XGBoost training failed; skipping")
    elif HAS_XGB:
        logger.warning("Skipping XGBoost on Windows")

    if not metrics:
        raise HTTPException(status_code=500, detail="No models were trained")
    return _metrics_payload("train")

# ---------------- PRETRAINED ----------------
@app.get("/models/pretrained")
def pretrained():
    return _metrics_payload("pretrained")

@app.post("/models/pretrained")
async def upload_pretrained(file: UploadFile = File(...), dataset_id: Optional[str] = Form(default=None)):
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="ZIP required")
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File too large")
    if data[:2] != b"PK":
        raise HTTPException(status_code=400, detail="A valid ZIP file is required")

    filename = file.filename or "uploaded_model.zip"
    if not filename.lower().endswith(".zip"):
        filename += ".zip"

    model_name, model = _load_pipeline_model_from_zip(data, filename)
    MODELS[model_name] = model

    if dataset_id and dataset_id in DATASETS:
        _ensure_metrics_dataset(dataset_id)
        _, test_df = DATASETS[dataset_id].randomSplit([0.8, 0.2], seed=42)
        if test_df.count() == 0:
            test_df = DATASETS[dataset_id]
        _evaluate_and_store(model_name, model, test_df)
    else:
        MODEL_METRICS[model_name] = {"model": model_name, "rmse": 0.0, "mae": 0.0, "r2": 0.0}

    return _metrics_payload("pretrained", fallback_best=model_name)

# ---------------- PREDICT MANUAL (no Spark createDataFrame) ----------------
class PredictManualRequest(BaseModel):
    vendor_id: int = 1
    passenger_count: int = 1
    pickup_datetime: datetime
    pickup_latitude: float
    pickup_longitude: float
    dropoff_latitude: float
    dropoff_longitude: float
    store_and_fwd_flag: Literal["N", "Y"] = "N"
    model: str = "GBT"


@app.post("/predict/manual")
async def predict_manual(req: PredictManualRequest):
    resolved = req.model if req.model in MODELS else _canonical_model_name(req.model)
    if resolved not in MODELS:
        raise HTTPException(status_code=400, detail=f"Model '{req.model}' not found. Load or train a model first.")

    pipeline: PipelineModel = MODELS[resolved]

    try:
        # ✅ Build feature vector entirely in Python — zero Spark workers involved
        vec = _compute_features_python(
            vendor_id=req.vendor_id,
            passenger_count=req.passenger_count,
            pickup_dt=req.pickup_datetime,
            pickup_lat=req.pickup_latitude,
            pickup_lng=req.pickup_longitude,
            dropoff_lat=req.dropoff_latitude,
            dropoff_lng=req.dropoff_longitude,
            store_flag=req.store_and_fwd_flag,
        )

        # ✅ Use spark.range(1) to avoid createDataFrame Python worker issues
        from pyspark.sql.types import StructType, StructField, StringType
        from pyspark.ml.linalg import VectorUDT

        # Build a 1-row DataFrame with the pre-computed feature vector
        # by going through a tiny SQL-level approach (no Python UDF workers)
        row_data = [(
            float(req.vendor_id),
            float(req.passenger_count),
            float(req.pickup_datetime.hour),
            float(req.pickup_datetime.isoweekday() % 7 + 1),
            float(req.pickup_datetime.month),
            1.0 if req.pickup_datetime.isoweekday() in (6, 7) else 0.0,
            vec[6],   # distance_km
            vec[7],   # manhattan_dist
            vec[8],   # direction
            req.store_and_fwd_flag,
        )]

        from pyspark.sql.types import (
            StructType, StructField, DoubleType, StringType
        )
        schema = StructType([
            StructField("vendor_id",          DoubleType(), True),
            StructField("passenger_count",    DoubleType(), True),
            StructField("pickup_hour",        DoubleType(), True),
            StructField("pickup_day",         DoubleType(), True),
            StructField("pickup_month",       DoubleType(), True),
            StructField("is_weekend",         DoubleType(), True),
            StructField("distance_km",        DoubleType(), True),
            StructField("manhattan_dist",     DoubleType(), True),
            StructField("direction",          DoubleType(), True),
            StructField("store_and_fwd_flag", StringType(), True),
        ])

        # ✅ ZERO Python workers: use spark.range(1) + withColumn literals
        # This never spawns a Python worker — all JVM side
        df = spark.range(1).select(
            F.lit(row_data[0][0]).cast("double").alias("vendor_id"),
            F.lit(row_data[0][1]).cast("double").alias("passenger_count"),
            F.lit(row_data[0][2]).cast("double").alias("pickup_hour"),
            F.lit(row_data[0][3]).cast("double").alias("pickup_day"),
            F.lit(row_data[0][4]).cast("double").alias("pickup_month"),
            F.lit(row_data[0][5]).cast("double").alias("is_weekend"),
            F.lit(row_data[0][6]).cast("double").alias("distance_km"),
            F.lit(row_data[0][7]).cast("double").alias("manhattan_dist"),
            F.lit(row_data[0][8]).cast("double").alias("direction"),
            F.lit(row_data[0][9]).alias("store_and_fwd_flag"),
        )

        result = pipeline.transform(df).select("prediction").first()["prediction"]
        return {"predictions": [{"id": 0, "prediction": float(result)}]}

    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("predict_manual failed")
        raise HTTPException(status_code=500, detail=str(exc))
    
    