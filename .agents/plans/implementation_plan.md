# 🛠️ Kế hoạch Khắc phục & Làm lại Dữ liệu Giao tiếp (High-Quality Content)

Thành thật xin lỗi bạn vì sai sót vừa qua. Việc dùng script tự động chèn dữ liệu mẫu (như "Apple" vào bài "Chào hỏi" hoặc nhân bản 2 bài thành 10 bài) đã làm hỏng tính logic, không đúng ngữ cảnh và vi phạm nguyên tắc chất lượng của một ứng dụng giáo dục.

Tôi sẽ dọn dẹp sạch sẽ toàn bộ các dữ liệu rác này và tái cấu trúc lại nội dung cho **toàn bộ 10 Chủ đề Giao tiếp** một cách nghiêm túc, chuẩn chỉ và hoàn toàn khác biệt nhau.

## ⚠️ User Review Required

Vì khối lượng dữ liệu chuẩn chỉ rất lớn (10 Topics x 10 Lessons x 10 Từ vựng x 10 Mẫu câu = **1000 Từ vựng & 1000 Mẫu câu** khác nhau hoàn toàn), tôi đề xuất phương án xử lý như sau:

1. Tôi sẽ viết một engine sinh JSON siêu nhỏ gọn.
2. Tôi sẽ tự tay soạn thảo ra 10 file văn bản thô (Mỗi file đại diện cho 1 Topic). Trong đó chứa chính xác 10 bài học với nội dung được tôi (AI) chọn lọc kỹ lưỡng, liên quan mật thiết đến ngữ cảnh, **không lặp lại**, chuẩn ngữ pháp và sát thực tế nhất.
3. Chạy engine để convert 10 file văn bản này thành 10 file JSON chuẩn của dự án.

Bạn có đồng ý với phương án dọn rác và tái tạo nội dung này không?

## 📝 Proposed Changes

### 1. Dọn dẹp dữ liệu cũ (Clean up)
- Xóa bỏ các từ vựng "Apple (extra)", "Banana (extra)" lạc quẻ.
- Xóa bỏ các bài học bị duplicate (nhân bản trùng lặp) trong 5 topic mới.

### 2. Soạn thảo Nội dung Chất lượng (Curated Content)
Tự tay thiết kế cấu trúc 10 bài học khác biệt cho TỪNG chủ đề trong 10 chủ đề.
Ví dụ đối với **Business & Work**:
- L1: Phỏng vấn việc làm (Job Interview)
- L2: Ngày đầu đi làm (First Day at Work)
- L3: Viết Email (Writing Emails)
- L4: Gọi điện thoại (Making Phone Calls)
- L5: Họp hành (Meetings & Discussions)
- L6: Báo cáo tiến độ (Progress Reports)
- L7: Đàm phán (Negotiations)
- L8: Phàn nàn & Giải quyết (Complaints & Resolutions)
- L9: Đi công tác (Business Trips)
- L10: Nghỉ việc/Chuyển việc (Resignation & Handover)

Mỗi bài học sẽ được cấp phát đúng 10 từ vựng chuyên ngành và 10 mẫu câu thực tế tương ứng với hoàn cảnh đó. Các chủ đề khác (Health, Shopping, Hobbies, Weather, Greetings, Introductions, Daily Life, Food & Drink, Travel) cũng sẽ được thiết kế 10 bài học riêng biệt cực kỳ sát thực tế như vậy.

## ✅ Verification Plan
- Chạy thử nghiệm và kiểm tra ngẫu nhiên (random check) 3 bài học ở 3 chủ đề khác nhau để đảm bảo:
  - 100% không có từ "extra".
  - Nội dung hoàn toàn ăn khớp với Title của bài học.
  - Số lượng bài học giữ nguyên 158 trang hợp lệ.
