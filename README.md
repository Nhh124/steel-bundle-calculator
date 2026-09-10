# Ứng Dụng Tính Số Bó & Cây Lẻ Thép Xây Dựng (Steel Bundle Calculator)

Ứng dụng web trực quan, chuyên nghiệp phục vụ công tác cân xe, bốc dỡ và quản lý kho thép xây dựng. Hỗ trợ tự động quy đổi giữa **Tổng số cây** sang **Số bó chẵn + Số cây lẻ**, đồng thời tính khối lượng lý thuyết (kg / tấn) theo chuẩn barem của 6 nhà sản xuất thép lớn tại Việt Nam.

---

## 🌟 Tính Năng Nổi Bật

1. **Chọn Nhà Cung Cấp Trực Quan (Radio Buttons)**:
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

4. **Khối Lượng Barem Nhà Máy (Lý Thuyết)**:
   - Tự động tính trọng lượng theo mác thép **CB4/CB5** hoặc **CB3/GR40/SD295**.

5. **Phiếu Cân Xe / Chuyến Xe Nhiều Chủng Loại**:
   - Cho phép thêm nhiều loại thép trên 1 chuyến xe (ví dụ: D10 + D14 + D20...).
   - Tự động cộng dồn tổng số cây, tổng số bó, tổng cây lẻ và tổng tải trọng hàng trên xe.

6. **Sao Chép Nhanh (Zalo / Báo Cáo)**:
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
