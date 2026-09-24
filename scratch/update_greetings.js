/* eslint-disable */
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data/greetings.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// AI-generated contextual phrases for greetings
const newPhrases = {
  1: [ // Hello & Goodbye
    { en: "Hello, how are you?", vi: "Xin chào, bạn khỏe không?" },
    { en: "Hi there!", vi: "Chào bạn!" },
    { en: "Hey, it's good to see you.", vi: "Này, rất vui được gặp bạn." },
    { en: "Goodbye, see you later.", vi: "Tạm biệt, hẹn gặp lại sau." },
    { en: "Bye for now.", vi: "Tạm biệt nhé." },
    { en: "See you tomorrow.", vi: "Hẹn gặp bạn ngày mai." },
    { en: "Welcome to our home.", vi: "Chào mừng đến với nhà của chúng tôi." },
    { en: "Greetings from Vietnam.", vi: "Lời chào từ Việt Nam." },
    { en: "Nice to meet you.", vi: "Rất vui được gặp bạn." },
    { en: "She is my best friend.", vi: "Cô ấy là bạn thân nhất của tôi." }
  ],
  2: [ // Morning to Night
    { en: "Good morning, everyone.", vi: "Chào buổi sáng, mọi người." },
    { en: "Good afternoon, sir.", vi: "Chào buổi chiều, ngài." },
    { en: "Good evening, ladies and gentlemen.", vi: "Chào buổi tối, thưa quý ông và quý bà." },
    { en: "Have a good night.", vi: "Chúc một đêm tốt lành." },
    { en: "How are you today?", vi: "Hôm nay bạn thế nào?" },
    { en: "See you tomorrow morning.", vi: "Hẹn gặp bạn sáng mai." },
    { en: "I need to sleep now.", vi: "Tôi cần phải ngủ bây giờ." },
    { en: "Wake up early.", vi: "Thức dậy sớm." },
    { en: "Sweet dreams.", vi: "Chúc những giấc mơ đẹp." },
    { en: "Have a good rest.", vi: "Nghỉ ngơi tốt nhé." }
  ],
  3: [ // How are you?
    { en: "I am fine, thank you.", vi: "Tôi khỏe, cảm ơn bạn." },
    { en: "That is great news.", vi: "Đó là tin tuyệt vời." },
    { en: "I had a good day.", vi: "Tôi đã có một ngày tốt lành." },
    { en: "It is not a bad idea.", vi: "Đó không phải là một ý tồi." },
    { en: "Why are you sad?", vi: "Tại sao bạn buồn?" },
    { en: "I am very happy for you.", vi: "Tôi rất vui cho bạn." },
    { en: "I feel tired today.", vi: "Hôm nay tôi cảm thấy mệt." },
    { en: "I am too busy right now.", vi: "Bây giờ tôi quá bận." },
    { en: "He is sick in bed.", vi: "Anh ấy đang ốm nằm trên giường." },
    { en: "Are you okay?", vi: "Bạn có ổn không?" }
  ],
  4: [ // Nice to meet you
    { en: "It is a nice day.", vi: "Đó là một ngày đẹp trời." },
    { en: "I am glad to be here.", vi: "Tôi rất vui khi ở đây." },
    { en: "Happy to see you again.", vi: "Rất vui được gặp lại bạn." },
    { en: "Let's meet at the cafe.", vi: "Hãy gặp nhau ở quán cà phê." },
    { en: "I don't know him.", vi: "Tôi không biết anh ấy." },
    { en: "Let me introduce myself.", vi: "Hãy để tôi giới thiệu bản thân." },
    { en: "I have a new phone.", vi: "Tôi có một chiếc điện thoại mới." },
    { en: "He is my colleague.", vi: "Anh ấy là đồng nghiệp của tôi." },
    { en: "My boss is very strict.", vi: "Sếp của tôi rất nghiêm khắc." },
    { en: "We are a great team.", vi: "Chúng ta là một đội tuyệt vời." }
  ],
  5: [ // Polite Expressions
    { en: "Please sit down.", vi: "Làm ơn ngồi xuống." },
    { en: "I am so sorry.", vi: "Tôi rất xin lỗi." },
    { en: "Excuse me, where is the toilet?", vi: "Xin lỗi, nhà vệ sinh ở đâu?" },
    { en: "Thanks for your help.", vi: "Cảm ơn vì sự giúp đỡ của bạn." },
    { en: "I beg your pardon?", vi: "Xin lỗi, bạn nói gì cơ?" },
    { en: "You are always welcome.", vi: "Bạn luôn được chào đón." },
    { en: "Can you help me?", vi: "Bạn có thể giúp tôi không?" },
    { en: "Are you sure about that?", vi: "Bạn có chắc về điều đó không?" },
    { en: "No problem at all.", vi: "Không có vấn đề gì cả." },
    { en: "That is very kind of you.", vi: "Bạn thật là tốt bụng." }
  ],
  6: [ // What's up?
    { en: "What's sup today?", vi: "Hôm nay có gì mới không?" },
    { en: "Hey bro, long time no see.", vi: "Chào người anh em, lâu rồi không gặp." },
    { en: "What's up, dude?", vi: "Có chuyện gì thế, anh bạn?" },
    { en: "Thanks, mate.", vi: "Cảm ơn, bạn hiền." },
    { en: "That sounds crazy.", vi: "Nghe có vẻ điên rồ." },
    { en: "Let's just chill out.", vi: "Hãy cứ thư giãn thôi." },
    { en: "Do you want to hang out?", vi: "Bạn có muốn đi chơi không?" },
    { en: "That car looks cool.", vi: "Chiếc xe đó trông ngầu thật." },
    { en: "Hey man, how is it going?", vi: "Chào anh bạn, mọi chuyện thế nào rồi?" },
    { en: "I will catch you later.", vi: "Tôi sẽ gặp lại bạn sau nhé." }
  ],
  7: [ // Say Hello to Family
    { en: "I love my mom.", vi: "Tôi yêu mẹ tôi." },
    { en: "My dad is a doctor.", vi: "Bố tôi là bác sĩ." },
    { en: "Her son is very smart.", vi: "Con trai cô ấy rất thông minh." },
    { en: "My daughter loves drawing.", vi: "Con gái tôi thích vẽ." },
    { en: "He is my older brother.", vi: "Anh ấy là anh trai tôi." },
    { en: "My sister is studying.", vi: "Em gái tôi đang học." },
    { en: "Grandpa is reading a newspaper.", vi: "Ông nội đang đọc báo." },
    { en: "Grandma makes the best cookies.", vi: "Bà nội làm bánh quy ngon nhất." },
    { en: "My uncle lives in London.", vi: "Chú tôi sống ở London." },
    { en: "Aunt Mary is coming today.", vi: "Dì Mary sẽ đến hôm nay." }
  ],
  8: [ // Meeting a stranger
    { en: "Don't talk to strangers.", vi: "Đừng nói chuyện với người lạ." },
    { en: "Excuse me, do you have the time?", vi: "Xin lỗi, bạn có biết mấy giờ rồi không?" },
    { en: "Can I ask you a question?", vi: "Tôi có thể hỏi bạn một câu được không?" },
    { en: "Do you know this place?", vi: "Bạn có biết nơi này không?" },
    { en: "What is your name?", vi: "Tên của bạn là gì?" },
    { en: "I need some help here.", vi: "Tôi cần một chút giúp đỡ ở đây." },
    { en: "I think I am lost.", vi: "Tôi nghĩ là tôi bị lạc rồi." },
    { en: "Which direction should I go?", vi: "Tôi nên đi hướng nào?" },
    { en: "The train is arriving soon.", vi: "Tàu sắp đến rồi." },
    { en: "Where is the bus station?", vi: "Bến xe buýt ở đâu?" }
  ],
  9: [ // At the workplace
    { en: "Morning everyone, let's start.", vi: "Chào buổi sáng mọi người, hãy bắt đầu nào." },
    { en: "The boss wants to see you.", vi: "Sếp muốn gặp bạn." },
    { en: "Sorry I am late.", vi: "Xin lỗi tôi đến trễ." },
    { en: "I woke up early today.", vi: "Hôm nay tôi thức dậy sớm." },
    { en: "Do you want some coffee?", vi: "Bạn có muốn uống chút cà phê không?" },
    { en: "Let's take a short break.", vi: "Hãy nghỉ giải lao một lát." },
    { en: "We are very busy this week.", vi: "Chúng tôi rất bận trong tuần này." },
    { en: "I have a lot of work.", vi: "Tôi có rất nhiều việc." },
    { en: "I am feeling tired.", vi: "Tôi đang cảm thấy mệt." },
    { en: "Are you ready to go?", vi: "Bạn đã sẵn sàng đi chưa?" }
  ],
  10: [ // Email greetings
    { en: "Dear Mr. Smith,", vi: "Kính gửi ông Smith," },
    { en: "Dear Madam,", vi: "Kính gửi bà," },
    { en: "Dear Sir,", vi: "Kính thưa ngài," },
    { en: "I will write an email.", vi: "Tôi sẽ viết một email." },
    { en: "I hope you are well.", vi: "Tôi hy vọng bạn vẫn khỏe." },
    { en: "Best regards,", vi: "Trân trọng," },
    { en: "Yours sincerely,", vi: "Chân thành," },
    { en: "I am waiting for your reply.", vi: "Tôi đang chờ phản hồi của bạn." },
    { en: "Please see the attached file.", vi: "Vui lòng xem file đính kèm." },
    { en: "Send me an email later.", vi: "Hãy gửi email cho tôi sau." }
  ]
};

data.lessons.forEach((lesson, idx) => {
  const customPhrases = newPhrases[idx + 1];
  if (customPhrases) {
    lesson.phrases = customPhrases.map((p, i) => ({
      id: `p-${Date.now()}-${idx}-${i}`,
      phrase: p.en,
      meaningVi: p.vi,
      ipa: `/${p.en.toLowerCase().replace(/[^a-z ]/g, '')}/`,
      usage: "Dùng trong giao tiếp"
    }));
  }
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated greetings.json with AI generated phrases!');
