FROM python:3.11-slim

WORKDIR /app

# Install system dependencies needed for pdfplumber and lightgbm
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend python code, models, and serving data
COPY api_service.py llm_service.py monthly_ingest_pipeline.py parse_reports.py build_features.py ./
COPY model_and_calibrator_FINAL.joblib ./
COPY stage10_priority_queue.csv dashboard_master.json stage6_shap_final.csv crosswalk_projectcode_to_legacyocms.csv ./

ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "uvicorn api_service:app --host 0.0.0.0 --port ${PORT:-8000}"]
