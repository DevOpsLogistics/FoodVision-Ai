@echo off
cd /d %~dp0
set TF_ENABLE_ONEDNN_OPTS=0
echo FoodVision API — KHONG dung --reload (TensorFlow se loi tren Windows)
py -m uvicorn app.main:app --host 127.0.0.1 --port 8000
