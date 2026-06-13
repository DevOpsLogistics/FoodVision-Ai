import cv2
import numpy as np

def crop_tray_compartments(image_path, min_area=5000):
    """
    Sử dụng phương pháp Hybrid Grid Slicing (Cắt theo tỷ lệ % kích thước ảnh).
    Phương pháp này loại bỏ hoàn toàn nhược điểm lóa sáng của khay inox và 
    không bị chết tọa độ (hardcode pixel) như trong slide.
    """
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Không thể đọc ảnh từ {image_path}")
        
    original = img.copy()
    img_h, img_w = img.shape[:2]
    
    # Định nghĩa 5 ngăn dựa trên tỷ lệ % (phù hợp với khay inox 5 ngăn tiêu chuẩn của trường)
    # Tọa độ: (x, y, w, h)
    boxes = [
        # Ngăn 1: Trên Trái (Thường là Cơm) -> Chiếm ~50% rộng, ~42% cao
        (int(img_w * 0.03), int(img_h * 0.03), int(img_w * 0.52), int(img_h * 0.42)),
        
        # Ngăn 2: Dưới Trái (Thường là Canh) -> Chiếm ~50% rộng, ~48% cao
        (int(img_w * 0.03), int(img_h * 0.48), int(img_w * 0.52), int(img_h * 0.48)),
        
        # Ngăn 3: Trên Phải (Đồ xào) -> Chiếm ~35% rộng, ~32% cao
        (int(img_w * 0.58), int(img_h * 0.05), int(img_w * 0.38), int(img_h * 0.32)),
        
        # Ngăn 4: Dưới Phải (Thịt kho/Món mặn) -> Chiếm ~35% rộng, ~33% cao
        (int(img_w * 0.58), int(img_h * 0.63), int(img_w * 0.38), int(img_h * 0.33)),
        
        # Ngăn 5: Giữa Phải (Nước chấm/Trống) -> Chiếm ~35% rộng, ~20% cao
        (int(img_w * 0.58), int(img_h * 0.39), int(img_w * 0.38), int(img_h * 0.22))
    ]
    
    compartments = []
    bounding_boxes = []
    
    for box in boxes:
        x, y, w, h = box
        # Đảm bảo không vượt quá biên ảnh
        x = max(0, x)
        y = max(0, y)
        w = min(w, img_w - x)
        h = min(h, img_h - y)
        
        crop_img = original[y:y+h, x:x+w]
        compartments.append(crop_img)
        bounding_boxes.append((x, y, w, h))
                
    return original, compartments, bounding_boxes
