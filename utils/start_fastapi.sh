#!/bin/bash

cd /home/rmintz/github/prsm-web/api/fastapi
source ./venv/bin/activate
echo "Activating virtual environment for FastAPI..."
echo "Starting FastAPI server on port 8002..."
uvicorn main:app --host 0.0.0.0 --port 8002 --reload
