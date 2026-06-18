Set-Location $PSScriptRoot
$env:TF_ENABLE_ONEDNN_OPTS = "0"
Write-Host "FoodVision API - khong dung --reload (TensorFlow se loi tren Windows)"
py -m uvicorn app.main:app --host 127.0.0.1 --port 8000
