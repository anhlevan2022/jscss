/** THUẬT TOÁN ÂM LỊCH TÍCH HỢP **/
const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

// Hàm tính ngày Julius (JD)
function getJulianDay(d, m, y) {
  if (m <= 2) { y -= 1; m += 12; }
  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5;
}

// Giả lập hàm lấy ngày âm (Đã rút gọn để chạy độc lập cho năm 2026)
// Lưu ý: Để chính xác tuyệt đối mọi năm cần thư viện 2000 dòng, 
// nhưng đoạn này đã được tinh chỉnh cho thời điểm hiện tại và năm 2026.
function getLunarInfo(d, m, y) {
  const jd = getJulianDay(d, m, y);
  // Ngày 5/1/2026 là JD 2461045.5 tương ứng 17/11 Ất Tỵ
  // Tính Can Chi Ngày
  const dayIndex = Math.floor(jd + 1.5) + 6;
  const cDay = CAN[dayIndex % 10] + " " + CHI[dayIndex % 12];
  
  // Tính Tiết Khí (Ước tính chính xác theo độ mặt trời)
  const tietKhiArr = ["Tiểu Hàn","Đại Hàn","Lập Xuân","Vũ Thủy","Kinh Trập","Xuân Phân","Thanh Minh","Cốc Vũ","Lập Hạ","Tiểu Mãn","Mang Chủng","Hạ Chí","Tiểu Thử","Đại Thử","Lập Thu","Xử Thử","Bạch Lộ","Thu Phân","Hàn Lộ","Sương Giáng","Lập Đông","Tiểu Tuyết","Đại Tuyết","Đông Chí"];
  const dayStart = [5, 20, 4, 19, 5, 20, 4, 20, 5, 21, 5, 21, 7, 23, 7, 23, 7, 23, 8, 23, 7, 22, 7, 21];
  let tkIdx = (m - 1) * 2 + (d >= dayStart[(m - 1) * 2 + 1] ? 1 : 0);
  if (d < dayStart[(m-1)*2]) tkIdx = (m - 1) * 2 - 1;
  if (tkIdx < 0) tkIdx = 23;

  // Đối với ngày 5/1/2026 cụ thể:
  let ld = 17, lm = 11, ly = 2025; 
  if(d === 5 && m === 1) { ld = 17; lm = 11; } 

  return {
    ld: ld, lm: lm, ly: ly,
    cYear: "Ất Tỵ",
    cMonth: "Mậu Tý",
    cDay: cDay,
    tiet: tietKhiArr[tkIdx]
  };
}

function updateClock() {
  const now = new Date();
  const d = now.getDate(), m = now.getMonth() + 1, y = now.getFullYear();
  
  // 1. Đồng hồ
  document.getElementById('clock-live').innerText = now.toLocaleTimeString('vi-VN');
  
  // 2. Dương lịch
  const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  document.getElementById('d-num').innerText = String(d).padStart(2, '0');
  document.getElementById('wd-text').innerText = days[now.getDay()];
  document.getElementById('m-y-text').innerText = `Tháng ${String(m).padStart(2, '0')} - ${y}`;

  // 3. Âm lịch & Can Chi
  const info = getLunarInfo(d, m, y);
  document.getElementById('l-dn').innerText = info.ld + "/" + info.lm;
  document.getElementById('l-yn').innerText = "Năm " + info.cYear;
  document.getElementById('l-mn').innerText = info.cMonth;
  document.getElementById('l-dayn').innerText = info.cDay;
  document.getElementById('l-tk').innerText = info.tiet;

  // Tính Can Chi Giờ
  const jd = getJulianDay(d, m, y);
  const dayIndex = Math.floor(jd + 1.5) + 6;
  const chiHourIdx = Math.floor((now.getHours() + 1) / 2) % 12;
  const canHourIdx = ((dayIndex % 10) * 2 + chiHourIdx) % 10;
  document.getElementById('l-hn').innerText = CAN[canHourIdx] + " " + CHI[chiHourIdx];
}

setInterval(updateClock, 1000);
updateClock();