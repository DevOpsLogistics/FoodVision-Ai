"""
Huấn luyện MobileNetV2 cho nhận diện món ăn Việt Nam.
Phase 1: transfer learning (base đóng băng)
Phase 2: fine-tune vài lớp cuối MobileNetV2
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import sys
from datetime import datetime
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")
os.environ.setdefault("TF_ENABLE_ONEDNN_OPTS", "0")  # tránh lỗi MKL hết RAM trên Windows

import tensorflow as tf
from tensorflow.keras import callbacks, layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing import image_dataset_from_directory

ML_DIR = Path(__file__).resolve().parent
DEFAULT_DATASET = Path(r"c:\Users\MR ASUS\Downloads\drive-download-20260531T232339Z-3-001")
MODEL_FILE = ML_DIR / "food_model_best.keras"
CLASSES_FILE = ML_DIR / "class_names.json"

IMG_SIZE = (224, 224)
BATCH_SIZE = 8
PHASE1_EPOCHS = 20
PHASE2_EPOCHS = 12
AUTOTUNE = tf.data.AUTOTUNE


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Train FoodVision CNN")
    p.add_argument(
        "--dataset",
        type=Path,
        default=Path(os.environ.get("FOODVISION_DATASET", DEFAULT_DATASET)),
        help="Thư mục dataset (mỗi class một folder)",
    )
    p.add_argument(
        "--fresh",
        action="store_true",
        help="Train mới từ ImageNet, không load checkpoint cũ",
    )
    p.add_argument(
        "--continue",
        dest="continue_train",
        action="store_true",
        help="Load food_model_best.keras và train tiếp (lr thấp)",
    )
    return p.parse_args()


def backup_model() -> None:
    if not MODEL_FILE.exists():
        return
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup = ML_DIR / f"food_model_best.keras.bak.{stamp}"
    shutil.copy2(MODEL_FILE, backup)
    print(f"=> Đã backup model cũ: {backup.name}")


def build_datasets(dataset_path: Path):
    if not dataset_path.is_dir():
        raise FileNotFoundError(f"Không tìm thấy dataset tại {dataset_path}")

    common = dict(
        validation_split=0.2,
        seed=42,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="int",
    )
    train_ds = image_dataset_from_directory(
        str(dataset_path), subset="training", **common
    )
    val_ds = image_dataset_from_directory(
        str(dataset_path), subset="validation", **common
    )

    def prep(ds, shuffle: bool):
        if shuffle:
            ds = ds.shuffle(512, seed=42)
        return ds.prefetch(AUTOTUNE)  # bỏ .cache() — tránh ngốn RAM

    return prep(train_ds, True), prep(val_ds, False), train_ds.class_names


def build_model(num_classes: int) -> tuple[models.Model, MobileNetV2]:
    augment = tf.keras.Sequential(
        [
            layers.RandomFlip("horizontal"),
            layers.RandomRotation(0.15),
            layers.RandomZoom(0.15),
            layers.RandomContrast(0.1),
        ],
        name="augment",
    )

    base = MobileNetV2(
        input_shape=IMG_SIZE + (3,),
        include_top=False,
        weights="imagenet",
    )
    base.trainable = False

    inputs = tf.keras.Input(shape=IMG_SIZE + (3,))
    x = augment(inputs)
    x = tf.keras.applications.mobilenet_v2.preprocess_input(x)
    x = base(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)
    model = models.Model(inputs, outputs, name="foodvision_mobilenetv2")
    return model, base


def _find_base_model(model: models.Model):
    for layer in model.layers:
        name = layer.name.lower()
        if "mobilenetv2" in name and hasattr(layer, "layers"):
            return layer
        if isinstance(layer, models.Model) and layer is not model:
            found = _find_base_model(layer)
            if found is not None:
                return found
    return None


def compile_model(model: models.Model, lr: float) -> None:
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=lr),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )


def fit_phase(
    model: models.Model,
    train_ds,
    val_ds,
    epochs: int,
    monitor: str = "val_accuracy",
) -> None:
    ckpt = callbacks.ModelCheckpoint(
        str(MODEL_FILE),
        save_best_only=True,
        monitor=monitor,
        mode="max",
        verbose=1,
    )
    early = callbacks.EarlyStopping(
        monitor=monitor,
        patience=4,
        restore_best_weights=True,
        verbose=1,
    )
    reduce = callbacks.ReduceLROnPlateau(
        monitor=monitor,
        factor=0.5,
        patience=2,
        min_lr=1e-6,
        verbose=1,
    )
    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=epochs,
        callbacks=[ckpt, early, reduce],
    )


def main() -> None:
    args = parse_args()
    dataset_path = args.dataset.resolve()

    print("=" * 50)
    print("[1] LOAD DATASET")
    print("=" * 50)
    print(f"=> Dataset: {dataset_path}")

    train_ds, val_ds, class_names = build_datasets(dataset_path)
    num_classes = len(class_names)
    print(f"=> {num_classes} lớp: {class_names}")

    with open(CLASSES_FILE, "w", encoding="utf-8") as f:
        json.dump(class_names, f, ensure_ascii=False, indent=4)
    print(f"=> Đã lưu {CLASSES_FILE.name}")

    print("\n" + "=" * 50)
    print("[2] KHỞI TẠO MODEL")
    print("=" * 50)

    if args.continue_train and MODEL_FILE.exists() and not args.fresh:
        print("=> Load checkpoint để train tiếp (phase 2 fine-tune)...")
        model = tf.keras.models.load_model(str(MODEL_FILE))
        base = _find_base_model(model)
        compile_model(model, lr=1e-5)
        print("\n" + "=" * 50)
        print("[4] PHASE 2 — FINE-TUNE (mở 40 lớp cuối MobileNetV2)")
        print("=" * 50)
        if base is not None:
            base.trainable = True
            for layer in base.layers[:-40]:
                layer.trainable = False
            fit_phase(model, train_ds, val_ds, PHASE2_EPOCHS)
        else:
            print("=> Không tìm thấy MobileNetV2 layer, train thêm head...")
            fit_phase(model, train_ds, val_ds, 8)
    elif args.fresh or not MODEL_FILE.exists():
        if args.fresh and MODEL_FILE.exists():
            backup_model()
        print("=> Tạo model mới (MobileNetV2 + transfer learning)...")
        model, base = build_model(num_classes)
        compile_model(model, lr=1e-3)
    else:
        print("=> Load checkpoint (dùng --fresh để train lại từ đầu)...")
        model = tf.keras.models.load_model(str(MODEL_FILE))
        base = model.get_layer("mobilenetv2_1.00_224") if any(
            "mobilenet" in l.name for l in model.layers
        ) else None
        compile_model(model, lr=1e-4)

    if not args.continue_train:
        print("\n" + "=" * 50)
        print("[3] PHASE 1 — HEAD TRAINING (base đóng băng)")
        print("=" * 50)
        fit_phase(model, train_ds, val_ds, PHASE1_EPOCHS)

        if base is not None:
            print("\n" + "=" * 50)
            print("[4] PHASE 2 — FINE-TUNE (mở 40 lớp cuối MobileNetV2)")
            print("=" * 50)
            base.trainable = True
            for layer in base.layers[:-40]:
                layer.trainable = False
            compile_model(model, lr=1e-5)
            fit_phase(model, train_ds, val_ds, PHASE2_EPOCHS)

    print("\n" + "=" * 50)
    print("[5] HOÀN TẤT")
    print("=" * 50)
    print(f"=> Model tốt nhất: {MODEL_FILE}")
    print("=> Restart backend FastAPI để load model mới.")


if __name__ == "__main__":
    main()
