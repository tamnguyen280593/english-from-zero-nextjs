# 🎮 Kế hoạch triển khai: Game Arena (Đấu Trường Tiếng Anh)

Tính năng Game Mode là một bước tiến lớn, chuyển dự án từ một ứng dụng học tập tĩnh thành một nền tảng tương tác cao. Dưới đây là kế hoạch kiến trúc và phát triển chi tiết cho tính năng này.

## ⚠️ User Review Required

> [!IMPORTANT]
> **Vị trí hiển thị trên Homepage**: Tôi đề xuất tạo một Card đặc biệt (hoặc một Category mới tên là "Game Arena / Đấu trường") trên trang chủ để người dùng bấm vào. Bạn có muốn nó nằm cùng hàng với các Categories hiện tại, hay tạo một section riêng biệt biệt nổi bật hơn ở Homepage?
>
> **Số lượng người chơi Multiplayer**: Tôi dự định giới hạn từ 2 đến 4 người chơi để UI không bị quá tải. Bạn thấy hợp lý không?

## 📝 Proposed Changes

### 1. Route và Cấu trúc thư mục mới
Tạo một phân hệ hoàn toàn mới dành riêng cho Game.
#### [NEW] `src/app/games/arena/page.tsx`
- Đóng vai trò là Game Hub.
- Sẽ chứa toàn bộ Client logic để quản lý vòng đời của một ván game (Setup -> Playing -> Results).

### 2. Màn hình Thiết lập (Setup Screen)
- **Chế độ chơi (Mode)**: Single Player (Chơi 1 mình) hoặc Multiplayer (Chơi nhiều người).
- **Nhập tên người chơi**: 
  - Nếu Single: 1 input. 
  - Nếu Multi: Cho phép Add/Remove người chơi (nhập tên từng người).
- **Chọn chủ đề (Topics)**: Hiển thị danh sách checkbox các chủ đề hiện có (Từ file `topics.json`). Tích hợp nút "Chọn tất cả".
- **Cấu hình câu hỏi**: Nhập số lượng câu hỏi mỗi ván (Ví dụ: 10, 20, 50).

### 3. Core Engine: Quản lý Câu hỏi và LocalStorage
#### [NEW] `src/hooks/useGameEngine.ts`
- **Khởi tạo ngân hàng câu hỏi**: Dựa vào danh sách topics được chọn, lặp qua tất cả `lessons`, trích xuất `vocabulary` và `phrases` và gom nhóm chúng theo từng `Topic`.
- **Thuật toán Công bằng (Round-based Topic Selection)**:
  - Nếu có $N$ người chơi, mỗi người chọn $M$ câu, tổng cộng game sẽ có $M$ vòng (rounds).
  - Ở mỗi vòng (vd: Vòng 1), hệ thống sẽ chọn ngẫu nhiên **1 Chủ đề chung** (vd: Thời tiết).
  - Sau đó, hệ thống rút ra $N$ câu hỏi khác nhau từ Chủ đề chung đó để phân phối lần lượt cho $N$ người chơi. Nhờ vậy, ở cùng một lượt, các bé sẽ được đối mặt với độ khó tương đương nhau.
- **Thuật toán chống trùng lặp (Anti-Repetition)**:
  - Lưu mảng `seen_question_ids` dưới `localStorage`.
  - Khi sinh $N$ câu hỏi cho một vòng, lọc bỏ các ID đã có trong `seen_question_ids`.
  - **Reset Logic**: Nếu một chủ đề không đủ $N$ câu hỏi chưa từng xuất hiện, hệ thống sẽ tự động clear `seen_question_ids` của chủ đề đó để đảm bảo tiến trình game diễn ra liên tục.
- **Game State**: Quản lý `players` (tên, điểm số), `currentRound` (Vòng hiện tại), `currentPlayerIndex` (lượt của ai trong vòng).

### 4. Màn hình Gameplay (In-Game Screen)
- **Turn Indicator**: Hiển thị to, rõ ràng: "Lượt của: [Tên Player]".
- **UI Câu hỏi**: Sử dụng giao diện trắc nghiệm đẹp mắt. 
- **Chuyển lượt**: Khi người A trả lời xong -> Hiện kết quả đúng/sai -> Bấm "Tiếp tục" -> Chuyển sang câu hỏi mới cho người B.
- **Tiến trình**: Hiển thị thanh tiến trình tổng thể (Câu 5/20).

### 5. Màn hình Kết quả (Results / Leaderboard)
- **Multiplayer Popup**: 
  - Hiển thị Bảng xếp hạng (Leaderboard) sắp xếp theo điểm số.
  - Hiệu ứng pháo hoa / vinh danh cho người top 1 (Winner).
- **Single Player Popup**:
  - Tính tỷ lệ phần trăm (%): (Số câu đúng / Tổng số câu) * 100.
  - **Rankings / Lời chúc**:
    - **≥ 90%**: "Tuyệt đỉnh! Trình độ Master! 🏆"
    - **≥ 70%**: "Rất xuất sắc! Tiếp tục phát huy nhé! 🌟"
    - **≥ 50%**: "Khá tốt! Nhưng bạn cần luyện tập thêm chút nữa! 👍"
    - **< 50%**: "Đừng nản chí! Thất bại là mẹ thành công! 💪"
- **Hành động**: Nút "Chơi lại" (giữ nguyên config) hoặc "Về màn hình thiết lập".

## 💡 Ý tưởng Nâng cấp (Brainstorming)

Để Game Arena thực sự trở nên bùng nổ và giữ chân các bé, tôi đã research và đề xuất thêm một số tính năng thú vị (Bạn có thể chọn áp dụng ngay hoặc để dành cho Version 2):

1. **Hệ thống Avatar / Emojis ngộ nghĩnh**: Khi nhập tên người chơi, cho phép mỗi bé chọn một Avatar động vật (🦁, 🦊, 🐰, 🐼, 🐸). Điều này giúp UI màn hình chơi sinh động và dễ nhận diện lượt của ai hơn.
2. **Text-to-Speech (Phát âm tự động)**: **(Theo đề xuất tuyệt vời của bạn!)** Sử dụng Web Speech API để tự động đọc to từ vựng/mẫu câu tiếng Anh ngay khi bé chọn đáp án đúng. Điều này kết hợp cả thị giác và thính giác, giúp ghim sâu cách phát âm vào trí nhớ của trẻ.
3. **Hiệu ứng Chuỗi thắng (Combo / Streak)**: Nếu một bé trả lời đúng 2, 3 câu liên tiếp, màn hình sẽ hiện hiệu ứng "On Fire! 🔥" hoặc "Combo x3!". Việc này kích thích tâm lý muốn giữ chuỗi của trẻ.
4. **Âm thanh (Sound Effects) & Confetti**: Thêm âm thanh vui nhộn: Tiếng "Ting" khi trả lời đúng, tiếng "Te te" khi sai, tiếng vỗ tay khi kết thúc game. Màn hình người thắng cuộc sẽ có pháo giấy (Confetti) rơi xuống.
5. **Quyền trợ giúp (Lifelines)**: (Tùy chọn nâng cao) Mỗi bé có 1 quyền trợ giúp "50/50" (loại bỏ 2 đáp án sai) trong suốt ván chơi.
6. **Chế độ Time Attack (Áp lực thời gian)**: Cung cấp tùy chọn bật/tắt đếm ngược thời gian (Ví dụ 15 giây/câu). Trả lời càng nhanh điểm càng cao. Tính năng này tạo ra sự kịch tính cực lớn trong chế độ Multiplayer.
7. **Bảng phân tích Lỗi sai (Review Mistakes)**: Ở màn hình Kết quả, ngoài điểm số, cho phép bấm vào xem "Những câu mình đã sai" kèm đáp án đúng để các bé thực sự học được từ lỗi sai của mình.

## 🧪 Verification Plan

### Automated/Code Verification
- Kiểm tra strict mode của TypeScript, đảm bảo không sử dụng `any` cho các state của Game.
- Kiểm tra tính hợp lệ của LocalStorage (SSR safe - chỉ gọi localStorage trong `useEffect` hoặc sau khi mount).

### Manual Verification
- Chơi thử chế độ Multi: Nhập 3 người chơi, set 6 câu hỏi. Kiểm tra xem thứ tự lượt đi có đúng A -> B -> C -> A -> B -> C không.
- Kiểm tra LocalStorage: Chơi hết sạch các câu hỏi trong 1 chủ đề nhỏ, xác nhận hệ thống tự động reset storage khi cạn kiệt câu hỏi.
