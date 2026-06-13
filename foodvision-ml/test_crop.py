import cv2
import numpy as np

def test_crop(image_path):
    img = cv2.imread(image_path)
    if img is None:
        return
        
    original = img.copy()
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Simple thresholding or adaptive
    blurred = cv2.GaussianBlur(gray, (7, 7), 0)
    thresh = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 4)
    edges = cv2.Canny(blurred, 30, 100)
    
    combined = cv2.bitwise_or(thresh, edges)
    
    # Huge closing to fill gaps
    kernel = np.ones((7,7), np.uint8)
    closed = cv2.morphologyEx(combined, cv2.MORPH_CLOSE, kernel, iterations=3)
    
    contours, _ = cv2.findContours(closed, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    
    total_area = img.shape[0] * img.shape[1]
    print(f"Total Area: {total_area}")
    
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area > 10000:
            x, y, w, h = cv2.boundingRect(cnt)
            print(f"Area: {area}, WxH: {w}x{h}, Ratio: {w/h:.2f}")

test_crop(r"C:\Users\MR ASUS\.gemini\antigravity-ide\brain\aa29d1dd-6cf8-45d2-90f2-232c40579729\media__1781375329285.jpg")
