import os
import sys

# Khắc phục lỗi in tiếng Việt trên console của Windows
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import cv2
import json
import numpy as np
import tensorflow as tf
from crop_tray import crop_tray_compartments

# Tắt cảnh báo TF (do chạy CPU)
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

MODEL_PATH = "food_model_best.keras"
CLASSES_PATH = "class_names.json"

def load_model_and_classes():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Không tìm thấy model tại {MODEL_PATH}. Hãy chắc chắn bạn đã chạy train.py trước.")
    if not os.path.exists(CLASSES_PATH):
        raise FileNotFoundError(f"Không tìm thấy file class names tại {CLASSES_PATH}")
        
    print("[1] Đang load model CNN...")
    model = tf.keras.models.load_model(MODEL_PATH)
    
    with open(CLASSES_PATH, 'r', encoding='utf-8') as f:
        class_names = json.load(f)
        
    return model, class_names

def predict_image(model, class_names, img_array):
    """
    Dự đoán một ảnh đã được crop.
    """
    # Đưa ảnh về chuẩn 224x224 RGB mà MobileNetV2 cần
    img_resized = cv2.resize(img_array, (224, 224))
    # Convert BGR (OpenCV) to RGB (TensorFlow)
    img_rgb = cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB)
    
    # Thêm chiều batch (1, 224, 224, 3)
    img_batch = np.expand_dims(img_rgb, axis=0)
    
    # Dự đoán
    predictions = model.predict(img_batch, verbose=0)
    scores = predictions[0] # Vì mô hình output Dense() với softmax
    
    class_idx = np.argmax(scores)
    confidence = scores[class_idx]
    
    return class_names[class_idx], confidence

def main(image_path):
    print("==================================================")
    print(" FOODVISION LAB - DỰ ĐOÁN KHAY CƠM (NO YOLO)")
    print("==================================================")
    
    model, class_names = load_model_and_classes()
    
    print(f"\n[2] Đang cắt khay cơm từ ảnh '{image_path}'...")
    try:
        original, compartments, bboxes = crop_tray_compartments(image_path)
    except Exception as e:
        print(f"Lỗi: {e}")
        return
        
    print(f"=> Phát hiện được {len(compartments)} ngăn đồ ăn hợp lệ.")
    
    if len(compartments) == 0:
        print("=> Không tìm thấy ngăn nào, có thể thông số diện tích min_area chưa phù hợp.")
        return

    output_img = original.copy()
    
    print("\n[3] Đang tiến hành nhận diện từng món ăn...")
    for idx, (comp, bbox) in enumerate(zip(compartments, bboxes)):
        x, y, w, h = bbox
        
        # Dự đoán món ăn
        predicted_class, confidence = predict_image(model, class_names, comp)
        
        print(f" - Ngăn {idx+1}: {predicted_class} ({confidence*100:.2f}%)")
        
        # Vẽ bounding box (màu xanh lá) và label lên ảnh gốc
        cv2.rectangle(output_img, (x, y), (x+w, y+h), (0, 255, 0), 2)
        
        label = f"{predicted_class}: {confidence*100:.1f}%"
        # Thêm viền chữ màu đen để dễ đọc trên mọi nền
        cv2.putText(output_img, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 4)
        cv2.putText(output_img, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
        
    # Lưu kết quả
    output_path = f"result_{os.path.basename(image_path)}"
    cv2.imwrite(output_path, output_img)
    print(f"\n[4] Đã lưu ảnh kết quả nhận diện tại: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Sử dụng: python predict.py <đường_dẫn_ảnh_khay_cơm>")
        sys.exit(1)
        
    img_path = sys.argv[1]
    main(img_path)
