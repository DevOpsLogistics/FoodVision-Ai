import os
import sys

# Khắc phục lỗi in tiếng Việt trên console của Windows
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import json
import tensorflow as tf
from tensorflow.keras.preprocessing import image_dataset_from_directory
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras import layers, models, callbacks

# Ngăn chặn TensorFlow báo lỗi warning do thiếu thư viện liên quan CUDA (CPU mode)
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# Đường dẫn bộ dữ liệu (dataset)
DATASET_PATH = r"c:\Users\MR ASUS\Downloads\drive-download-20260531T232339Z-3-001"

# Cấu hình tham số huấn luyện
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 15

print("==================================================")
print("[1] ĐANG LOAD DATASET TỪ Ổ ĐĨA...")
print("==================================================")

# Khởi tạo tập huấn luyện (Training Data) - lấy 80% ảnh
train_dataset = image_dataset_from_directory(
    DATASET_PATH,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

# Khởi tạo tập kiểm thử (Validation Data) - lấy 20% ảnh
val_dataset = image_dataset_from_directory(
    DATASET_PATH,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

class_names = train_dataset.class_names
num_classes = len(class_names)
print(f"\n=> Đã tìm thấy {num_classes} món ăn: {class_names}")

# Lưu tên các class ra file JSON để sau này thuật toán nhận diện gọi lên dùng
with open('class_names.json', 'w', encoding='utf-8') as f:
    json.dump(class_names, f, ensure_ascii=False, indent=4)
print("=> Đã lưu file 'class_names.json' thành công.")

print("\n==================================================")
print("[2] ĐANG KHỞI TẠO MÔ HÌNH CNN (TRANSFER LEARNING)...")
print("==================================================")

# Kiểm tra nếu đã có model đang train dở thì load lên để train tiếp
MODEL_FILE = 'food_model_best.keras'
if os.path.exists(MODEL_FILE):
    print("\n=> TÌM THẤY CHECKPOINT! Đang load model cũ để tiếp tục huấn luyện...")
    model = tf.keras.models.load_model(MODEL_FILE)
    # Biên dịch lại model với learning rate nhỏ hơn một chút để fine-tune tốt hơn
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
                  loss='sparse_categorical_crossentropy',
                  metrics=['accuracy'])
else:
    print("\n=> KHÔNG TÌM THẤY CHECKPOINT. Tạo model mới từ đầu...")
    # Lớp tăng cường dữ liệu: Lật ảnh, xoay ảnh, phóng to ngẫu nhiên để model thông minh hơn
    data_augmentation = tf.keras.Sequential([
        layers.RandomFlip("horizontal"),
        layers.RandomRotation(0.2),
        layers.RandomZoom(0.2),
    ])

    # Sử dụng mô hình MobileNetV2 đã được học trước hàng triệu bức ảnh (Transfer Learning)
    base_model = MobileNetV2(input_shape=IMG_SIZE + (3,), include_top=False, weights='imagenet')
    base_model.trainable = False 

    # Gắn các thành phần lại thành một mô hình hoàn chỉnh
    inputs = tf.keras.Input(shape=IMG_SIZE + (3,))
    x = data_augmentation(inputs)
    x = tf.keras.applications.mobilenet_v2.preprocess_input(x)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.2)(x) # Tránh over-fitting

    # Lớp cuối cùng: Phân loại ra 11 món ăn
    outputs = layers.Dense(num_classes, activation='softmax')(x)

    model = models.Model(inputs, outputs)

    # Biên dịch mô hình
    model.compile(optimizer='adam',
                  loss='sparse_categorical_crossentropy',
                  metrics=['accuracy'])

print("\n==================================================")
print("[3] BẮT ĐẦU HUẤN LUYỆN MÔ HÌNH (TRAINING)...")
print("==================================================")

# Cấu hình tự động lưu model TỐT NHẤT và dừng sớm nếu không có tiến triển
checkpoint = callbacks.ModelCheckpoint('food_model_best.keras', save_best_only=True, monitor='val_accuracy', mode='max', verbose=1)
early_stopping = callbacks.EarlyStopping(monitor='val_accuracy', patience=3, restore_best_weights=True, verbose=1)

# Bắt đầu vòng lặp học tập
history = model.fit(
    train_dataset,
    validation_data=val_dataset,
    epochs=EPOCHS,
    callbacks=[checkpoint, early_stopping]
)

print("\n==================================================")
print("[4] HOÀN TẤT HUẤN LUYỆN!")
print("==================================================")
print("=> Đã lưu mô hình tốt nhất vào file 'food_model_best.keras'. Bạn có thể sử dụng mô hình này để test cắt ảnh khay cơm.")
