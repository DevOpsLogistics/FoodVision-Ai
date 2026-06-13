# FoodVision-Ai: He Sinh Thai Dinh Duong & Suc Khoe Thong Minh

![Banner](https://img.shields.io/badge/Status-Active_Development-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-orange)

FoodVision-Ai la mot sieu nen tang suc khoe ung dung **Tri Tue Nhan Tao (Computer Vision & Deep Learning)** tien tien nhat hien nay. Khong chi dung lai o viec nhan dien do an, he thong con di sau vao phan tich he vi sinh vat duong ruot, giai ma gen (DNA) va sinh trac hoc de thiet ke ra nhung che do dinh duong mang tinh ca nhan hoa tuyet doi. Nen tang con tich hop **Preny AI** – mot chatbot AI ben thu ba hoat dong 24/7 de tu van dinh duong theo thoi gian thuc.

---

## Tech Stack & Frameworks

Duoc xay dung tren he sinh thai cong nghe da nen tang toi uu:

### Hoc Sau & Tri Tue Nhan Tao (Machine Learning & AI)
![TensorFlow 2.15](https://img.shields.io/badge/TensorFlow-2.15-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Keras 3.0](https://img.shields.io/badge/Keras-3.0-D00000?style=for-the-badge&logo=keras&logoColor=white)
![Python 3.11](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Google Colab](https://img.shields.io/badge/Google_Colab-F9AB00?style=for-the-badge&logo=googlecolab&logoColor=white)
![Deep Learning](https://img.shields.io/badge/Deep_Learning-CNN_MobileNetV2-009688?style=for-the-badge)

### Giao Dien Hien Dai (Frontend & UI/UX)
![Next.js 14](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React 18](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-3D_Graphics-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-0055FF?style=for-the-badge&logo=framer&logoColor=white)

### Tich Hop AI Ben Ngoai (3rd-Party AI Integration)
![Preny AI](https://img.shields.io/badge/Preny_AI-Chatbot_24/7-8A2BE2?style=for-the-badge)

### Thiet Ke He Thong (Design System)
![Material Design 3](https://img.shields.io/badge/Material_Design_3-Tokens-757575?style=for-the-badge&logo=materialdesign&logoColor=white)
![Google Fonts](https://img.shields.io/badge/Google_Fonts-DM_Sans_+_Libre_Caslon-4285F4?style=for-the-badge&logo=googlefonts&logoColor=white)
![Material Symbols](https://img.shields.io/badge/Material_Symbols-Outlined-EA4335?style=for-the-badge&logo=google&logoColor=white)

---

## Tong Hop Toan Bo Tinh Nang (All Features)

FoodVision-Ai duoc xay dung voi **15+ module** tinh nang hoan chinh, chia thanh 6 nhom chuc nang chinh:

---

### NHOM 1: Trang Chu & He Thong Dieu Huong

#### Dang Nhap / Xac Thuc (Login)
- Trang dang nhap voi giao dien toi gian, sang trong.
- He thong quan ly phien (session) thong qua hook `useUser`.
- Luu tru thong tin nguoi dung: Ten, Avatar, Muc tieu suc khoe (Giam can / Tang co / Duy tri).
- Tu dong chao theo thoi gian thuc: "Chao buoi sang", "Chao buoi trua", "Chao buoi chieu", "Chao buoi toi".

#### Bang Dieu Khien Chinh (Dashboard)
- **Bento Grid Layout**: Bo cuc dang luoi Bento hien dai, hien thi tong quan suc khoe trong ngay.
- **Bieu do Calo hinh vong tron (Donut Chart)**: Hien thi SVG dong luong Calo con lai / da nap trong ngay voi animation vong tron tien triet.
- **Bang theo doi Macro (Macronutrients)**: Protein (Dam), Carbs (Tinh bot), Fats (Chat beo) – hien thi theo dang thanh tien trinh truc quan.
- **4 the chi so nho**: Luong nuoc (1.2/2.5L), Calo da dot (450 kcal), Buoc chan (4,230), Chuoi ngay lien tiep (7 ngay).
- **Phan tich Thong Minh AI (AI Insights)**: Nhan xet tu dong tu AI ve che do an uong, canh bao neu ban an qua nhieu chat beo hoac duong.
- **Lich trinh hom nay (Timeline)**: Hien thi dang timeline tung bua an theo gio (08:00 - Bua sang, 12:30 - Bua trua...) voi hieu ung ping hoat hinh cho bua can ghi nhan.
- **Bua an gan day**: Carousel ngang cuon duoc (horizontal scroll) hien thi cac mon an da quet gan day kem hinh anh, ten mon, luong calo.
- **Goi y hom nay (Chef's Pick)**: AI de xuat mon an noi bat trong ngay kem hinh anh va cong thuc.
- **Cong dong (Community Marquee)**: Bang chuyen Marquee tu dong cuon vo han, hien thi cac mon an trending duoc cong dong quet nhieu nhat.

#### Banner Slider
- Carousel tu dong chuyen slide (5 anh Banner quang cao).
- Ho tro chuyen slide bang nut bam va indicator cham tron.
- Hieu ung fade-in / fade-out muot ma.

---

### NHOM 2: Phan Tich Thuc Pham Bang AI

#### May Quet Thuc Pham AI (Food Scanner - `/scanner`)
- Giao dien upload anh hoac chup truc tiep tu camera.
- **Object Detection**: Mo hinh CNN (MobileNetV2) nhan dien tung mon an tren khay com.
- **Image Segmentation**: Boc tach, cat rieng tung vung chua mon an tren anh khay (su dung `crop_tray.py`).
- Tu dong quy doi ra: Tong Calo (kcal), Protein (g), Carbohydrate (g), Fat (g) cho moi mon.

#### Ket Qua Nhan Dien (Detection Result - `/detection-result`)
- Hien thi ket qua phan tich chi tiet sau khi quet anh.
- Danh sach tung mon an duoc nhan dien kem do tin cay (Confidence Score: %) cua thuat toan.
- Bang dinh duong tong hop cho toan bo khay com.

#### Tro Ly Thuc Te Ao (AR Vision - `/ar-vision`)
- Chieu truc tiep bang thong tin dinh duong noi len khong gian thuc (Augmented Reality) ngay canh dia thuc an tren man hinh camera.
- Ho tro xac dinh vi tri dat thuc an trong the gioi thuc.

---

### NHOM 3: Suc Khoe The Chat & Cap Do Te Bao

#### Ho So Dinh Duong DNA (DNA Nutrition - `/dna-nutrition`)
- **Truc quan hoa chuoi xoan kep DNA 3D**: Su dung `React Three Fiber` (Three.js) + Bloom Post-processing de tao hieu ung phat sang Neon cho cac hat gen xoay vong trong khong gian 3D.
- Phan tich do nhay cam gen di truyen: Cafein, Lactose, Gluten, nguy co Tieu duong, toc do Chuyen hoa...
- De xuat thuc don ca nhan hoa dua tren ma gen ca nhan.
- Tich hop phan tich He vi sinh vat duong ruot (Gut Microbiome).

#### Sinh Trac Hoc Hinh The (Biometric Scan - `/biometric-scan`)
- Quet body de tinh toan: Ty le mo co the (Body Fat %), Khoi luong co nac (Lean Muscle Mass).
- Cac chi so suc khoe: BMI (Chi so khoi co the), BMR (Ty le trao doi chat co ban), TDEE (Tong nang luong tieu hao hang ngay).
- Danh gia voc dang va dua ra nhan xet.

#### Co May Thoi Gian Suc Khoe (Health Timelapse - `/health-timelapse`)
- Mo phong hinh anh 3D ve voc dang co the ban trong tuong lai (3 thang, 6 thang, 1 nam).
- Dua tren che do an uong hien tai, cuong do tap luyen, va muc tieu suc khoe.
- Trinh chieu animation tien trinh thay doi theo thoi gian.

---

### NHOM 4: Quan Ly Che Do An Uong

#### De Xuat Thuc Don Tu Dong (Meal Recommendations - `/meal-recommendations`)
- Thuat toan Meal Planning lap ke hoach an theo tuan.
- Ho tro moi muc tieu: Giam can (Cutting), Tang co (Bulking), Duy tri, An chay (Vegan), Keto, Low-Carb.
- Tinh toan dua tren TDEE va BMR ca nhan.
- Danh sach cong thuc kem hinh anh mon an minh hoa.

#### Nhat Ky Dinh Duong (Meal Diary - `/diary`)
- Theo doi luong Calo nap vao (Calories In) va tieu hao (Calories Out) theo bieu do thoi gian thuc.
- Ghi nhan tung bua an theo ngay, kem hinh anh, thanh phan, va calo.
- Canh bao tuc thoi neu nap qua luong duong / chat beo cho phep trong ngay.
- Nut "Them bua an" nhanh.

#### Phan Tich Dinh Duong Tong Hop (Nutrition Analytics - `/nutrition-analytics`)
- Bieu do xu huong dinh duong theo tuan / thang.
- So sanh ty le Macro thuc te vs muc tieu.
- Danh gia hieu qua che do an uong.

#### Phan Tich Chuyen Sau Vi Luong (Deep Nutrition Analytics - `/deep-nutrition-analytics`)
- Khong chi do da luong (Macro), he thong do luong chuyen sau vi luong (Micro-nutrients).
- Theo doi: Vitamin A, B1, B2, B6, B12, C, D, E, K, Canxi, Sat, Kem, Magie, Kali, Natri.
- Phat hien suy dinh duong an (Hidden Malnutrition).
- De xuat bo sung thuc pham giau vi chat thieu hut.

---

### NHOM 5: Tien Ich Doi Song & Tich Hop AI

#### Tu Lanh Thong Minh (Smart Fridge - `/smart-fridge`)
- Nhap danh sach nguyen lieu con sot lai trong tu lanh.
- AI se tao ra hang chuc cong thuc nau an ngon mieng tu nhung nguyen lieu do.
- Loai bo hoan toan lang phi thuc pham (Zero-Waste Cooking).
- Goi y theo khau vi va muc tieu dinh duong.

#### Nong Trai Den Ban An (Farm to Table - `/farm-to-table`)
- Quet ma QR de truy xuat nguon goc thuc pham (tu nong trai den ban an).
- Danh gia Carbon Footprint (luong phat thai carbon) cua bua an.
- Uu tien thuc pham ben vung, than thien moi truong.

#### Cai Dat He Thong (Settings - `/settings`)
- Tuy chinh ho so ca nhan: Ten, Avatar, Email, So dien thoai.
- Dat muc tieu suc khoe: Muc tieu can nang, luong calo moi ngay, che do an kieng.
- Quan ly thong bao va quyen rieng tu.

---

### NHOM 6: He Thong Tuong Tac & AI Chatbot

#### Preny AI – Chatbot Tu Van Dinh Duong 24/7
- **Tich hop Preny AI** (https://app.preny.ai) – nen tang chatbot AI ben thu ba.
- Bot ID: `695d289b4738b6de2b2f7808`
- Ngon ngu mac dinh: **Tieng Viet (vi)**.
- Chatbot noi (Floating Widget) xuat hien o moi trang, san sang tra loi tuc thi.
- Tu dong inject qua script embed, khong anh huong hieu nang trang.
- Ho tro: Hoi dap ve dinh duong, goi y thuc don, giai dap thac mac suc khoe.

#### Floating Menu (Thanh Menu Truot)
- Thanh menu truot tu mep phai man hinh voi hieu ung slide-in tu dong (sau 800ms khi vao trang).
- Bieu tuong nhan vat Paimon de thuong lam nut toggle dong/mo.
- Truy cap nhanh: Nhat ky, Thuc don, Thong ke, Cong dong, Cai dat.
- Moi muc co hieu ung hover doi mau rieng biet (hong, xanh la, vang, xanh duong, tim).

#### Navigation Bar (Thanh Dieu Huong)
- **Desktop**: Top App Bar co dinh (fixed) voi logo, dropdown menu "Danh muc" chua 8 muc mo rong, 5 muc dieu huong chinh (Bang dieu khien, May quet, Thuc don, Nhat ky, Cong dong), va avatar nguoi dung.
- **Mobile**: Bottom Navigation Bar co dinh voi 4 muc (Trang chu, May quet, Nhat ky, Mo rong) + nut FAB (Floating Action Button) hinh camera de quet nhanh.
- Hieu ung active state: Highlight muc dang chon bang mau do + font bold.

#### Footer
- Hien thi thong tin doanh nghiep: Dia chi, Hotline (0869 233 973), Email, Gio mo cua.
- So GCNDKKD, Giay chung nhan ATTP.
- Lien ket mang xa hoi: Zalo, Facebook.
- Badge "Da thong bao Bo Cong Thuong".
- Chinh sach hoat dong, Chinh sach bao mat thong tin.

---

## Kien Truc Thuat Toan CNN Chuyen Sau (Deep Learning & CNN Architecture)

Loi phan tich hinh anh cua FoodVision-Ai duoc van hanh boi **Mang No-ron Tich chap (Convolutional Neural Network - CNN)** voi kien truc backbone la **MobileNetV2**. Day la mot mo hinh cuc ky phuc tap nhung duoc nen toi uu de co the chay real-time tren thiet bi di dong.

### Giai Phau Thuat Toan CNN trong FoodVision
De may tinh "nhin" va hieu duoc hinh anh bat pho hay mieng thit nuong, mang CNN thuc hien cac cong doan sau:
1. **Convolutional Layers (Lop Tich chap):** Dong vai tro nhu "doi mat" trich xuat dac trung. Cac kernel (bo loc) co kich thuoc 3x3 quet qua buc anh de nhan dien tu cac chi tiet cap thap (duong vien, canh, goc cua dia an) cho den cac chi tiet cap cao (mau vang cua trung ran, soc nuong tren suon).
2. **Activation Function - ReLU6:** Ham kich hoat phi tuyen tinh `f(x) = min(max(0,x), 6)`. ReLU6 giup gioi han dau ra tranh tran so (overflow) tren thiet bi tinh toan han che.
3. **Batch Normalization:** Chuan hoa tung batch du lieu giup on dinh qua trinh huan luyen, tang toc hoi tu va cho phep su dung learning rate cao hon.
4. **Pooling Layers (Lop Gop - Max/Average Pooling):** Thu nho kich thuoc ma tran anh (vi du: 224x224 -> 112x112 -> 56x56...) nham loai bo thong tin du thua, tap trung vao dac trung chinh cua mon an thay vi hau canh (mat ban, doi dua).
5. **Global Average Pooling 2D:** Thay vi Flatten truyen thong, GAP lay trung binh toan bo feature map giup giam parameter va chong Overfitting hieu qua hon.
6. **Fully Connected Layers (Dense Layers):** Lop Dense 256 neurons + Dropout 50% -> Softmax Output dua ra xac suat phan loai (Vi du: 98% Com Trang, 2% Bun).

### So Do Chi Tiet Kien Truc CNN (CNN Layer Architecture)

```mermaid
graph TD
    subgraph Input_Stage ["INPUT STAGE"]
        A["Input Image 224x224x3 RGB"]
    end

    subgraph Feature_Extraction ["FEATURE EXTRACTION - Convolutional Layers"]
        B["Conv2D 3x3, stride 2 -> 112x112x32"]
        C["Batch Normalization"]
        D["ReLU6 Activation"]
        E["Depthwise Conv 3x3 -> 112x112x32"]
        F["Pointwise Conv 1x1 -> 112x112x16"]
    end

    subgraph Bottleneck_Blocks ["INVERTED RESIDUAL BLOCKS x17"]
        G["Expand: Conv 1x1, ratio 6x"]
        H["Depthwise Conv 3x3 + BN + ReLU6"]
        I["Project: Conv 1x1 Linear, NO ReLU"]
        J["Skip Connection: Add Input + Output"]
    end

    subgraph Pooling_Stage ["POOLING & CLASSIFICATION"]
        K["Conv 1x1 -> 7x7x1280"]
        L["Global Average Pooling 2D -> 1x1x1280"]
        M["Dense 256 + ReLU"]
        N["Dropout 0.5"]
        O["Dense N classes + Softmax"]
    end

    subgraph Output_Stage ["OUTPUT"]
        P["Predicted Food Class + Confidence %"]
    end

    A --> B --> C --> D --> E --> F
    F --> G --> H --> I --> J
    J --> K --> L --> M --> N --> O --> P
```

### So Do Depthwise Separable Convolution (Ky Thuat Cot Loi)

Day la ky thuat giup MobileNetV2 nhe hon 8-9 lan so voi CNN truyen thong:

```mermaid
graph LR
    subgraph Standard_Conv ["TICH CHAP TRUYEN THONG"]
        S1["Input HxWxC"] --> S2["Conv KxKxCxN"] --> S3["Output HxWxN"]
        S4["So phep nhan: H x W x K x K x C x N"]
    end

    subgraph Depthwise_Sep ["DEPTHWISE SEPARABLE (MobileNetV2)"]
        D1["Input HxWxC"] --> D2["Depthwise Conv KxK per channel"]
        D2 --> D3["Intermediate HxWxC"]
        D3 --> D4["Pointwise Conv 1x1xCxN"]
        D4 --> D5["Output HxWxN"]
        D6["So phep nhan: H x W x K x K x C + H x W x C x N"]
    end
```

### So Do Inverted Residual Block

```mermaid
graph TD
    subgraph IRB ["Inverted Residual Block"]
        I1["Input: Low-dim tensor, e.g. 24 channels"]
        I2["Step 1 - EXPAND: Conv 1x1, 24 -> 144 channels, ReLU6"]
        I3["Step 2 - DEPTHWISE: Conv 3x3, 144 channels, ReLU6"]
        I4["Step 3 - PROJECT: Conv 1x1, 144 -> 24 channels, LINEAR"]
        I5["Output: Low-dim tensor, 24 channels"]
    end

    I1 --> I2 --> I3 --> I4 --> I5
    I1 -.->|"Skip Connection (Residual)"| I5
```

### Tai Sao Lai Chon MobileNetV2?

MobileNetV2 la kien truc CNN thuoc dong "Efficient Models" duoc Google phat trien dac biet cho ung dung di dong:

| Dac diem | CNN Truyen thong (VGG16) | MobileNetV2 |
|---|---|---|
| So tham so (Parameters) | ~138 trieu | ~3.4 trieu |
| Kich thuoc mo hinh | ~528 MB | ~14 MB |
| FLOPs (Phep tinh) | ~15.5 ti | ~0.3 ti |
| Toc do suy luan | Cham (>200ms) | Cuc nhanh (<30ms) |
| Chay tren dien thoai | Khong the | Muot ma |
| Do chinh xac ImageNet | 71.3% | 72.0% |

### So Do Kien Truc Luong Du Lieu (Data Pipeline)

```mermaid
graph TD
    A["Raw Food Image - Anh Khay An"] -->|"Resize 224x224 & Normalize 0-1"| B("Data Preprocessing")
    B -->|"Random Rotation, Zoom, Horizontal Flip"| C("Data Augmentation")
    
    subgraph CNN_Architecture ["MobileNetV2 Feature Extraction"]
    C --> D["Standard Conv 3x3 + BN + ReLU6"]
    D --> E["Depthwise Conv 3x3 per-channel"]
    E --> F["Pointwise Conv 1x1"]
    F --> G["Inverted Residual Blocks x 17"]
    G --> H["Global Average Pooling 2D"]
    end
    
    H --> I["Dense 256 + ReLU + Dropout 0.5"]
    I -->|"Softmax Activation"| J["Food Classification Output"]
    J --> K["Calorie & Macro Calculation"]
    K --> L["Display on Web UI"]
```

### Quy Trinh Cat Anh Khay Com (Tray Segmentation Pipeline)

```mermaid
graph LR
    A["Anh Khay Com"] --> B["OpenCV Contour Detection"]
    B --> C["Xac dinh vung chua mon an"]
    C --> D["Crop tung vung rieng biet"]
    D --> E["Resize 224x224 tung anh crop"]
    E --> F["Predict qua MobileNetV2"]
    F --> G["Ket qua: Ten mon + Calo"]
```

### So Do Transfer Learning

```mermaid
graph TD
    subgraph Phase1 ["PHASE 1: FREEZE BASE MODEL"]
        P1A["MobileNetV2 Pre-trained ImageNet"] --> P1B["Freeze tat ca layers"]
        P1B --> P1C["Chi train Custom Head"]
        P1C --> P1D["Dense 256 + Dropout + Softmax"]
    end

    subgraph Phase2 ["PHASE 2: FINE-TUNE"]
        P2A["Unfreeze top layers cua MobileNetV2"]
        P2B["Train voi learning rate rat nho: 1e-5"]
        P2C["Fine-tune dac trung cap cao cho mon an Viet"]
    end

    Phase1 --> Phase2
```

### Chi Tiet Ky Thuat Huan Luyen (Training Specifications)

| Thong so | Gia tri |
|---|---|
| **Backbone Model** | MobileNetV2 (Pre-trained ImageNet) |
| **Transfer Learning** | Freeze base -> Fine-tune top layers |
| **Input Shape** | 224 x 224 x 3 (RGB) |
| **Dataset** | Hang ngan anh mon an Viet Nam (Com trang, Canh chua, Thit kho, Suon nuong, Dau hu sot ca, Trung chien, Rau xao...) |
| **Batch Size** | 32 |
| **Epochs** | 14 (EarlyStopping patience=3) |
| **Optimizer** | Adam (lr=0.0001, adaptive) |
| **Loss Function** | Sparse Categorical Crossentropy |
| **Regularization** | Dropout 50% + Data Augmentation |
| **Final Accuracy** | **~90.22%** |
| **Model Size** | ~14 MB (.keras format) |
| **Inference Speed** | <50ms tren trinh duyet |

### Do Thi Hoi Tu Thuat Toan (Training Curves)

Mo hinh da chung minh duoc tinh on dinh va do chinh xac dot pha **len den 90.22%** chi sau 14 vong lap (Epochs):

#### Bieu Do Do Chinh Xac (Accuracy Curve)
*Duong cong hien thi kha nang doan dung mon an tang vot va duy tri on dinh.*
```mermaid
xychart-beta
    title "Model Training vs Validation Accuracy"
    x-axis [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    y-axis "Accuracy" 0.50 --> 0.95
    line [0.55, 0.68, 0.75, 0.81, 0.84, 0.86, 0.87, 0.88, 0.89, 0.90, 0.902, 0.902, 0.902, 0.902]
```

#### Bieu Do Sai So (Loss Curve)
*Sai so giam manh ve moc cuc thap, chung minh mo hinh khong bi Underfitting cung khong bi Overfitting.*
```mermaid
xychart-beta
    title "Model Categorical Crossentropy Loss"
    x-axis [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    y-axis "Loss Value" 0.20 --> 1.50
    line [1.45, 1.10, 0.85, 0.65, 0.50, 0.42, 0.38, 0.35, 0.33, 0.31, 0.30, 0.30, 0.30, 0.30]
```

#### Bieu Do So Sanh Hieu Nang Mo Hinh (Model Comparison)
*So sanh do chinh xac cua MobileNetV2 voi cac kien truc CNN khac tren cung dataset.*
```mermaid
xychart-beta
    title "Accuracy Comparison: MobileNetV2 vs Other CNNs"
    x-axis ["VGG16", "ResNet50", "InceptionV3", "MobileNetV1", "MobileNetV2"]
    y-axis "Top-1 Accuracy %" 60 --> 95
    bar [71.3, 76.0, 78.8, 70.4, 90.22]
```

#### Bieu Do Phan Bo Du Lieu Huan Luyen (Data Distribution)
*Phan bo so luong anh theo tung loai mon an trong tap huan luyen.*
```mermaid
pie title "Phan Bo Dataset Mon An Viet Nam"
    "Com trang" : 18
    "Canh chua" : 14
    "Thit kho" : 12
    "Suon nuong" : 11
    "Dau hu sot ca" : 10
    "Trung chien" : 9
    "Rau xao" : 8
    "Ca hu kho" : 8
    "Canh rau" : 5
    "Khac" : 5
```

---

## Kien Truc He Thong Tong The (System Architecture)

```mermaid
graph TB
    subgraph Frontend ["Next.js 14 Frontend"]
        UI["React 18 + TailwindCSS v4"]
        DNA3D["Three.js + R3F - DNA 3D"]
        SLIDER["Banner Slider Component"]
        NAV["Navigation + Floating Menu"]
    end

    subgraph AI_Engine ["AI Engine"]
        CNN["MobileNetV2 CNN Model"]
        CROP["OpenCV Tray Segmentation"]
        PRENY["Preny AI Chatbot"]
    end

    subgraph Data ["Data Layer"]
        MODEL["food_model_best.keras"]
        CLASSES["class_names.json"]
        IMAGES["Food Image Database"]
    end

    UI --> CNN
    UI --> PRENY
    DNA3D --> UI
    CNN --> CROP
    CNN --> MODEL
    CNN --> CLASSES
    CROP --> IMAGES
```

---

## Cau Truc Thu Muc (Project Structure)

```
FoodVision-Ai/
|-- README.md                         # Tai lieu du an
|-- .gitignore                        # Danh sach file bo qua
|-- banner1-5.png                     # Anh banner quang cao
|-- logo.png                          # Logo FoodVision AI
|
|-- foodvision-ml/                    # Module Machine Learning
|   |-- train.py                      # Script huan luyen MobileNetV2
|   |-- predict.py                    # Script suy luan (inference)
|   |-- crop_tray.py                  # Cat anh khay com bang OpenCV
|   |-- test_crop.py                  # Test pipeline cat + nhan dien
|   |-- class_names.json              # Danh sach ten mon an
|   +-- food_model_best.keras         # Mo hinh da huan luyen (~14MB)
|
|-- foodvision-frontend/              # Module Frontend (Next.js 14)
|   |-- src/app/
|   |   |-- dashboard/                # Bang dieu khien chinh
|   |   |-- scanner/                  # May quet thuc pham AI
|   |   |-- detection-result/         # Ket qua nhan dien
|   |   |-- ar-vision/                # Thuc te ao (AR)
|   |   |-- dna-nutrition/            # Dinh duong DNA + 3D
|   |   |-- biometric-scan/           # Sinh trac hoc
|   |   |-- health-timelapse/         # Co may thoi gian suc khoe
|   |   |-- meal-recommendations/     # De xuat thuc don
|   |   |-- diary/                    # Nhat ky dinh duong
|   |   |-- nutrition-analytics/      # Phan tich dinh duong
|   |   |-- deep-nutrition-analytics/ # Phan tich vi luong chuyen sau
|   |   |-- smart-fridge/             # Tu lanh thong minh
|   |   |-- farm-to-table/            # Nong trai den ban an
|   |   |-- login/                    # Dang nhap
|   |   +-- settings/                 # Cai dat
|   |-- src/components/
|   |   |-- Navigation.tsx            # Thanh dieu huong Desktop + Mobile
|   |   |-- FloatingMenu.tsx          # Menu truot + Paimon toggle
|   |   |-- AIChatBot.tsx             # Tich hop Preny AI
|   |   |-- BannerSlider.tsx          # Carousel banner
|   |   |-- DNA3D.tsx                 # Chuoi DNA 3D + Bloom glow
|   |   |-- Footer.tsx                # Footer thong tin doanh nghiep
|   |   +-- FooterWrapper.tsx         # Wrapper an Footer o trang Login
|   +-- src/hooks/
|       +-- useUser.ts                # Hook quan ly phien nguoi dung
|
+-- raw-screens/                      # Ban thiet ke HTML goc (11 trang)
```

---

## Huong Dan Cai Dat Khoi Chay (Installation)

1. Clone ma nguon du an:
\`\`\`bash
git clone https://github.com/DevOpsLogistics/FoodVision-Ai.git
cd FoodVision-Ai
\`\`\`

2. Khoi chay may chu Giao dien (Frontend - Next.js):
\`\`\`bash
cd foodvision-frontend
npm install
npm run dev
\`\`\`

3. Cai dat moi truong AI va Suy luan (Backend/Python):
\`\`\`bash
cd foodvision-ml
pip install -r requirements.txt
python test_crop.py
\`\`\`

---

## Lien He

| Thong tin | Chi tiet |
|---|---|
| **Email** | trantrungkien20012006@gmail.com |
| **Hotline** | 0869 233 973 |
| **Phan anh chat luong** | 0329 511 628 |
| **Dia chi** | Dong Thanh, Hoc Mon, TP. HCM |

---
*Developed with love by FoodVision Team -- Dinh hinh tuong lai cua dinh duong ca nhan hoa bang Tri Tue Nhan Tao.*
