# Ứng Dụng Tính Số Bó & Quy Đổi Barem Thép (Steel Calculator)

Ứng dụng web trực quan, chuyên nghiệp phục vụ công tác cân xe, bốc dỡ và quản lý kho thép xây dựng POVINA. Ứng dụng tích hợp 2 phân hệ chuyên biệt:
1. **Phân hệ 1**: Tính số bó & cây lẻ theo barem thực tế của 6 nhà máy thép (Hòa Phát, VAS, Pomina, Miền Nam, Tung Ho, Vina Kyoei).
2. **Phân hệ 2**: Quy đổi 2 chiều theo **Barem Quốc Tế (`klm_qte` - kg/m)** giữa Khối lượng cân (Kg/Tấn) $\leftrightarrow$ **Số cây** (Thép cây DB) và **Số cuộn** (Thép cuộn WR).

---

## 🌟 Tính Năng Nổi Bật

### 📦 TAB 1: Tính Bó & Cây Lẻ (Barem Nhà Máy)
1. **Chọn Nhà Cung Cấp Trực Quan (Radio Cards)**:
   - **Hòa Phát** (Bình Dương, Ninh Thuận)
   - **VAS - Việt Mỹ** (Thương Mại, An Hưng Tường)
   - **Pomina** (Bình Dương, Phú Mỹ)
   - **Thép Miền Nam** (Phú Mỹ, Thủ Đức, Biên Hòa, Nhà Bè)
   - **Tung Ho** (Phú Mỹ)
   - **Vina Kyoei** (Phú Mỹ)

2. **Chọn Đường Kính Thép Thanh Vằn (Chiều dài chuẩn 11.7m)**:
   - D10, D12, D14, D16, D18, D20, D22, D25, D28, D32, D36.
   - Tự động khóa các kích cỡ mà nhà máy không đóng bó.

3. **Tính Toán 2 Chiều Linh Hoạt**:
   - **Chiều 1**: Nhập Tổng số cây $\rightarrow$ Tự động tính ra **Số bó chẵn + Số cây lẻ** (kèm số cây đóng đai nguyên bó).
   - **Chiều 2**: Nhập Số bó chẵn + Số cây lẻ $\rightarrow$ Tự động tính ra **Tổng số cây**.

4. **Phiếu Cân Xe / Chuyến Xe Nhiều Chủng Loại**:
   - Cho phép thêm nhiều loại thép trên 1 chuyến xe (D10 + D14 + D20...).
   - Tự động cộng dồn tổng số cây, tổng số bó, tổng cây lẻ và tổng tải trọng hàng trên xe.

---

### 🌐 TAB 2: Quy Đổi Barem Quốc Tế (`klm_qte` ➔ Cây / Cuộn)
1. **Thép Cây / Thanh Vằn (`DB`)**:
   - Dải đường kính: **D10 đến D40** với các giá trị `klm_qte` chuẩn TCVN ($0.617 - 9.860\,\text{kg/m}$).
   - **Quy đổi 2 chiều**:
     - Nhập Khối Lượng (Kg/Tấn) $\rightarrow$ Tính ra **Số cây chẵn** + **Khối lượng dư lẻ** (kg) và Tổng mét dài.
     - Nhập Số Cây $\rightarrow$ Tính ra **Tổng khối lượng** (Kg và Tấn) theo chuẩn barem quốc tế.
   - Hỗ trợ tùy chỉnh chiều dài cây (mặc định $11.7\,\text{m}$, linh hoạt cho hàng $6\,\text{m}$, $12\,\text{m}$).

2. **Thép Cuộn (`WR` - Wire Rod)**:
   - Dải quy cách: **D6, D6.5, D8, D8.5, D10, D12** với `klm_qte` chuẩn ($0.222 - 0.888\,\text{kg/m}$).
   - **Quy đổi 2 chiều**:
     - Nhập Khối Lượng (Kg/Tấn) $\rightarrow$ Tính ra **Số cuộn chẵn** + **Khối lượng lẻ** (kg) và Tổng chiều dài cuộn thép (mét).
     - Nhập Số Cuộn $\rightarrow$ Tính ra Khối lượng tương ứng theo định mức cuộn ($780\,\text{kg}$, $1,000\,\text{kg}$, $1,500\,\text{kg}$, $2,000\,\text{kg}$, $2,100\,\text{kg}$...).

3. **Sao Chép Nhanh Kết Quả**:
   - 1 nút bấm sao chép kết quả định dạng rõ ràng để dán ngay vào Zalo gửi cho khách hàng, tài xế hoặc thủ kho.

---

## 🚀 Cách Sử Dụng Ngay (Offline)

Ứng dụng được viết hoàn toàn bằng công nghệ Web thuần túy (HTML5, CSS3, Vanilla JS), không cần cài đặt Node.js hay bất kỳ phần mềm nào:

1. Vào thư mục dự án `steel-bundle-calculator`.
2. Nhấp đúp chuột vào file `index.html` để mở ngay trên trình duyệt (Chrome, Edge, Cốc Cốc, Firefox, Safari trên cả máy tính và điện thoại).

---

## 🌐 Hướng Dẫn Đưa Lên GitHub & Bật GitHub Pages (Miễn Phí)

Để đưa dự án lên GitHub và có một đường link web (URL) chạy online trên điện thoại mọi lúc mọi nơi:

### Bước 1: Tạo Repository trên GitHub
1. Đăng nhập vào tài khoản [GitHub](https://github.com).
2. Bấm nút **New Repository** (Tạo repo mới).
3. Đặt tên repository: `steel-bundle-calculator` (hoặc tên tùy thích).
4. Chọn chế độ **Public** rồi bấm **Create repository**.

### Bước 2: Tải Code Lên GitHub
* **Cách A: Dùng giao diện web GitHub (Đơn giản nhất, không cần cài Git)**:
  1. Trong trang repository vừa tạo trên GitHub, bấm vào dòng **uploading an existing file**.
  2. Kéo toàn bộ các file và thư mục (`index.html`, `README.md`, `.gitignore`, thư mục `css`, thư mục `js`) thả vào trình duyệt.
  3. Bấm **Commit changes**.

* **Cách B: Dùng Git command line**:
  ```bash
  cd "steel-bundle-calculator"
  git init
  git add .
  git commit -m "Initial commit: Steel Bundle Calculator"
  git branch -M main
  git remote add origin https://github.com/<USERNAME>/steel-bundle-calculator.git
  git push -u origin main
  ```

### Bước 3: Bật GitHub Pages để có link web chạy trực tuyến
1. Trong repository trên GitHub, vào menu **Settings** (Cài đặt).
2. Ở cột bên trái, chọn **Pages**.
3. Tại mục **Build and deployment** $\rightarrow$ **Branch**:
   - Chọn nhánh **main** (hoặc `master`).
   - Chọn thư mục **/ (root)**.
4. Bấm **Save**.
5. Đợi 1-2 phút, GitHub sẽ cung cấp cho bạn một đường link web công khai dạng:
   `https://<username>.github.io/steel-bundle-calculator/`
   *(Bạn có thể mở link này trên điện thoại hoặc chia sẻ cho các đồng nghiệp, nhân viên trạm cân dùng chung!)*

---

## 📊 Bảng Tra Quy Cách Cây/Bó Của 6 Nhà Máy (11.7m)

| Chủng loại | Hòa Phát | VAS (Việt Mỹ) | Pomina | Miền Nam | Tung Ho | Vina Kyoei |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **D10** | 440 | 440 | 230 | 350 | 300 | 300 |
| **D12** | 320 | 320 | 200 | 250 | 260 | 260 |
| **D14** | 222 | 222 | 140 | 180 | 190 | 190 |
| **D16** | 180 | 180 | 120 | 140 | 150 | 150 |
| **D18** | 138 | 138 | 100 | 110 | 115 | 115 |
| **D20** | 114 | 114 | 80 | 90 | 95 | 95 |
| **D22** | 90 | 90 | 60 | 70 | 76 | 76 |
| **D25** | 72 | 72 | 50 | 58 | 60 | 60 |
| **D28** | 57 | 57 | 40 | 45 | 48 | 48 |
| **D32** | 45 | 45 | 30 | 35 | 36 | 36 |
| **D36** | 35 | - | - | 27 | - | - |

---

## 🌐 Bảng Tra Barem Quốc Tế (klm_qte - Chuẩn TCVN)

### 1. Thép Cây / Thanh Vằn (`DB` - Chiều dài chuẩn 11.7m):
| Chủng loại | klm_qte (kg/m) | Trọng lượng 1 cây 11.7m (kg) |
|:---:|:---:|:---:|
| **D10** | 0.617 | 7.219 |
| **D12** | 0.888 | 10.390 |
| **D14** | 1.210 | 14.157 |
| **D16** | 1.580 | 18.486 |
| **D18** | 2.000 | 23.400 |
| **D20** | 2.470 | 28.899 |
| **D22** | 2.980 | 34.866 |
| **D25** | 3.850 | 45.045 |
| **D28** | 4.830 | 56.511 |
| **D32** | 6.310 | 73.827 |
| **D36** | 7.990 | 93.483 |
| **D40** | 9.860 | 115.362 |

### 2. Thép Cuộn (`WR` - Wire Rod):
| Chủng loại | klm_qte (kg/m) | Định mức cuộn tiêu chuẩn |
|:---:|:---:|:---:|
| **D6** | 0.222 | ~2,000 kg/cuộn (9,009 mét) |
| **D6.5** | 0.260 | ~2,000 kg/cuộn (7,692 mét) |
| **D8** | 0.395 | ~2,000 kg/cuộn (5,063 mét) |
| **D8.5** | 0.445 | ~2,000 kg/cuộn (4,494 mét) |
| **D10 cuộn** | 0.617 | ~2,000 kg/cuộn (3,241 mét) |
| **D12 cuộn** | 0.888 | ~2,000 kg/cuộn (2,252 mét) |

---

## 📁 Cấu Trúc Dự Án

```
steel-bundle-calculator/
├── index.html          # Giao diện chính của ứng dụng
├── README.md           # Tài liệu hướng dẫn & công bố GitHub
├── .gitignore          # Cấu hình bỏ qua file rác khi git
├── css/
│   └── style.css       # Toàn bộ CSS phong cách công nghiệp hiện đại
└── js/
    ├── data.js         # Dữ liệu barem & quy cách bó của 6 nhà máy
    └── app.js          # Logic tính toán, quy đổi, sao chép và quản lý chuyến xe
```

&copy; 2026 POVINA Steel. Phát triển chuyên biệt cho công tác kiểm đếm & cân xe.
