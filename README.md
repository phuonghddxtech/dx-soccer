# ⚽ DX Soccer - Team Dividing App

Ứng dụng web React để chia tuyển thủ thành 2 đội bóng một cách cân bằng dựa trên trình độ (tier).

## 🚀 Tính năng

- ➕ **Thêm tuyển thủ**: Nhập tên và chọn tier cho từng tuyển thủ
- 🏆 **Hệ thống Tier**: 5 cấp độ từ Bronze đến Master với điểm số khác nhau
- ⚖️ **Chia đội cân bằng**: Thuật toán thông minh chia đội dựa trên tổng điểm tier
- 📊 **Hiển thị điểm đội**: Xem tổng điểm tier của mỗi đội
- 🔄 **Chia lại đội**: Tạo tổ hợp mới với thuật toán cân bằng
- 📋 **Sắp xếp theo tier**: Xem danh sách tuyển thủ theo thứ tự tier
- 🎭 **Animation card**: Hiệu ứng lật card ẩn/hiện thông tin tuyển thủ
- 🎬 **Auto-flip dramatic**: Nút "Bắt đầu lật" để tự động lật card theo nhóm tier cứ 3 giây
- 🎯 **Lật card riêng lẻ**: Click vào từng card để xem thông tin
- 🎪 **Lật tất cả card**: Nút điều khiển để hiện/ẩn tất cả card
- 🎆 **Animation pháo hoa**: Hiệu ứng pháo hoa đầy màu sắc mỗi khi lật card
- 📊 **Progress bar**: Hiển thị tiến trình auto-flip
- 🎵 **Hệ thống âm thanh**: Nhạc UEFA Champions League và âm thanh hiệu ứng
- 🔊 **Điều khiển âm thanh**: Bật/tắt nhạc và điều chỉnh âm lượng
- 🎨 **Giao diện đẹp**: Thiết kế hiện đại với màu sắc tier riêng biệt
- 📱 **Responsive**: Hoạt động tốt trên mọi thiết bị

## 🏆 Hệ Thống Tier

| Tier | Icon | Điểm | Mô tả |
|------|------|------|-------|
| 🥉 Bronze | 1 | Cấp độ cơ bản |
| 🥈 Silver | 2 | Cấp độ trung bình |
| 🥇 Gold | 3 | Cấp độ khá |
| 💎 Diamond | 4 | Cấp độ tốt |
| 👑 Master | 5 | Cấp độ xuất sắc |

## 🛠️ Cài đặt và Chạy

1. **Clone repository:**
   ```bash
   git clone https://github.com/phuonghddxtech/dx-soccer.git
   cd dx-soccer
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

3. **Thêm file âm thanh (tùy chọn):**
   - Tải file nhạc UEFA Champions League (MP3)
   - Đặt tên `champions-league.mp3` và copy vào `public/audio/`

4. **Chạy ứng dụng:**
   ```bash
   npm start
   ```

5. **Mở trình duyệt:**
   Truy cập [http://localhost:3000](http://localhost:3000)

## 📖 Cách sử dụng

1. **Điều khiển âm thanh:**
   - Sử dụng nút "Bật Nhạc" để phát nhạc UEFA Champions League
   - Điều chỉnh âm lượng bằng slider
   - Nhạc sẽ tự động lặp lại

2. **Thêm tuyển thủ:**
   - Nhập tên tuyển thủ vào ô input
   - Chọn tier từ dropdown (Bronze → Master)
   - Nhấn nút "Thêm" hoặc phím Enter
   - Lặp lại cho tất cả tuyển thủ

3. **Quản lý danh sách:**
   - **Sắp xếp theo tier**: Bật checkbox để xem danh sách theo thứ tự tier
   - **Xóa tuyển thủ**: Nhấn nút ✕ bên cạnh tên tuyển thủ

4. **Chia đội cân bằng:**
   - Khi có ít nhất 2 tuyển thủ, nút "Chia Đội" sẽ xuất hiện
   - Nhấn "Chia Đội" để chia thành 2 đội cân bằng dựa trên tổng điểm tier
   - Các card sẽ hiển thị với dấu "?" và animation slide-in

5. **Xem kết quả với animation:**
   - **🎬 Bắt đầu lật**: Nút để tự động lật card theo nhóm tier cứ 3 giây
   - **👑 Lật theo tier**: Các tuyển thủ cùng tier sẽ lật cùng lúc (2 người/nhóm)
   - **📊 Progress bar**: Hiển thị tiến trình theo số nhóm tier
   - **⏹️ Dừng**: Có thể dừng auto-flip bất cứ lúc nào
   - **Lật card riêng lẻ**: Click vào từng card để xem thông tin tuyển thủ
   - **Lật tất cả card**: Sử dụng nút "Lật Tất Cả Card" để hiện/ẩn tất cả
   - **Animation mượt mà**: Hiệu ứng lật 3D với transition 0.6s
   - **🎆 Pháo hoa**: Hiệu ứng pháo hoa đầy màu sắc mỗi khi lật card
   - **Âm thanh hiệu ứng**: Tự động phát âm thanh khi lật card và chia đội

6. **Quản lý đội:**
   - **Chia Lại Đội**: Tạo tổ hợp mới với thuật toán cân bằng (reset animation)
   - **Reset Tất Cả**: Xóa toàn bộ danh sách và kết quả

## 🎨 Thiết kế

- **Đội 1**: Màu xanh dương (#007bff)
- **Đội 2**: Màu đỏ (#dc3545)
- **Giao diện**: Gradient background với card design hiện đại
- **Responsive**: Tối ưu cho mobile và desktop

## 📱 Responsive Design

Ứng dụng được thiết kế responsive và hoạt động tốt trên:
- 📱 Mobile phones
- 📱 Tablets  
- 💻 Desktop computers

## 🎯 Tính năng nâng cao

- **Thuật toán chia đội thông minh**: 
  - Sắp xếp tuyển thủ theo tier (cao nhất trước)
  - Phân bổ xen kẽ để cân bằng tổng điểm
  - Tự động điều chỉnh nếu chênh lệch quá lớn
- **Hệ thống điểm tier**: Mỗi tier có giá trị điểm riêng để tính toán cân bằng
- **Animation và hiệu ứng**: 
  - Card flip 3D với perspective và transform
  - Slide-in animation khi chia đội
  - Pulse animation cho dấu "?" trên card
  - Smooth transition 0.6s cho tất cả animation
  - Auto-flip với interval 3 giây theo nhóm tier
  - Progress bar real-time theo số nhóm
  - Lật cùng lúc 2 tuyển thủ cùng tier
  - Animation pháo hoa với 30 particles đầy màu sắc
  - Hiệu ứng sparkle và glow cho từng particle
- **Hệ thống âm thanh**: 
  - Nhạc nền UEFA Champions League với loop
  - Âm thanh hiệu ứng khi lật card
  - Âm thanh chiến thắng khi chia đội
  - Điều khiển âm lượng với slider
- **Giao diện trực quan**: 
  - Màu sắc tier riêng biệt với icon đặc trưng
  - Hiển thị điểm số đội rõ ràng
  - Responsive design cho mọi thiết bị
- **UX thân thiện**: Thao tác đơn giản, phản hồi tức thì
- **Tính năng sắp xếp**: Xem danh sách theo thứ tự tier hoặc thứ tự thêm vào
- **Interactive cards**: Click để lật từng card hoặc lật tất cả cùng lúc

## 🔧 Công nghệ sử dụng

- **React 18**: Framework chính
- **CSS3**: Styling với Flexbox và Grid
- **JavaScript ES6+**: Logic xử lý
- **HTML5 Audio**: Hệ thống âm thanh
- **CSS Animations**: Hiệu ứng và transitions

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🤝 Contributing

Mọi đóng góp đều được chào đón! Hãy tạo Pull Request hoặc Issue để đóng góp vào dự án.

## 👨‍💻 Author

**Phuong Ha** - [@phuonghddxtech](https://github.com/phuonghddxtech)

## 🌟 Stars

Nếu dự án này hữu ích, hãy cho một ⭐ để ủng hộ!

---

Made with ❤️ by [phuonghddxtech](https://github.com/phuonghddxtech)