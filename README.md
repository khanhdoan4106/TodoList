# TodoList

TodoList là ứng dụng quản lý công việc cá nhân với giao diện tối giản, giúp người dùng theo dõi tiến độ hằng ngày, sắp xếp mức độ ưu tiên và duy trì sự tập trung.

## Features

* Thêm, chỉnh sửa và xoá công việc
* Đánh dấu hoàn thành công việc
* Thiết lập mức độ ưu tiên bằng hệ thống đánh giá sao
* Ghi chú cho từng công việc
* Bộ lọc công việc: Tất cả, Chưa xong, Đã xong
* Theo dõi tiến độ hoàn thành theo phần trăm
* Gợi ý chia nhỏ công việc bằng AI (Claude API), có chế độ Demo khi chưa nhập API Key
* Hiệu ứng pháo hoa khi hoàn thành tất cả công việc
* Hỗ trợ chế độ sáng và tối
* Lưu dữ liệu cục bộ bằng Local Storage

## Technologies

* React 18 (UMD) + Babel Standalone — không cần bước build
* JavaScript (ES2020+)
* HTML5, CSS3
* Anthropic Messages API

## Chạy ứng dụng

Các file `.js` được Babel tải bằng XHR, nên **mở trực tiếp `index.html` (file://) sẽ không chạy**. Hãy dùng một local server:

```bash
# Python
python -m http.server 8000
# hoặc Node
npx serve .
```

Rồi mở `http://localhost:8000`. Bản deploy trên GitHub Pages chạy được ngay.

## Gợi ý bằng AI

Bấm **API Key** ở góc trên, dán key từ [console.anthropic.com](https://console.anthropic.com) rồi bấm Lưu. Key chỉ được lưu trong `localStorage` của trình duyệt và gửi thẳng tới `api.anthropic.com`. Không có key, nút **AI** trả về gợi ý mẫu (chế độ Demo). Model dùng được khai báo ở hằng `AI_MODEL` trong `utils.js`.
