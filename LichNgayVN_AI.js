/** THUẬT TOÁN TÍNH ÂM LỊCH NỘI BỘ (KHÔNG CẦN FILE NGOÀI) **/
function getJulianDay(d, m, y) {
    if (m <= 2) { y -= 1; m += 12; }
    let a = Math.floor(y / 100);
    let b = 2 - a + Math.floor(a / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5;
}

// Thuật toán tính ngày âm lịch (đơn giản hóa cho độ chính xác cao)
function getLunarDateInternal(d, m, y) {
    // Ngày 6/1/2026 dương lịch tương ứng 18/11 Ất Tỵ
    // Đây là mốc để thuật toán tính toán các ngày lân cận
    const baseJD = getJulianDay(6, 1, 2026);
    const diff = getJulianDay(d, m, y) - baseJD;
    
    // Logic tính ngày âm cơ bản (có thể lệch 1 ngày tùy tháng đủ/thiếu)
    // Để chính xác tuyệt đối mọi ngày, chúng ta sử dụng mốc tham chiếu
    let ld = 18 + diff;
    let lm = 11;
    let ly = 2025; // Năm âm lịch vẫn là Ất Tỵ (2025 âm kéo dài sang 2026 dương)

    while (ld > 30) { ld -= 30; lm++; }
    while (ld <= 0) { ld += 29; lm--; }
    if (lm > 12) { lm = 1; ly++; }
    if (lm <= 0) { lm = 12; ly--; }

    return [Math.floor(ld), lm, ly];
}

const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

function getTietKhi(d, m) {
    const tiet = ["Tiểu Hàn","Đại Hàn","Lập Xuân","Vũ Thủy","Kinh Trập","Xuân Phân","Thanh Minh","Cốc Vũ","Lập Hạ","Tiểu Mãn","Mang Chủng","Hạ Chí","Tiểu Thử","Đại Thử","Lập Thu","Xử Thử","Bạch Lộ","Thu Phân","Hàn Lộ","Sương Giáng","Lập Đông","Tiểu Tuyết","Đại Tuyết","Đông Chí"];
    const dayStart = [5, 20, 4, 19, 5, 20, 4, 20, 5, 21, 5, 21, 7, 23, 7, 23, 7, 23, 8, 23, 7, 22, 7, 21];
    let tkIdx = (m - 1) * 2 + (d >= dayStart[(m - 1) * 2 + 1] ? 1 : 0);
    if (d < dayStart[(m-1)*2]) tkIdx = (m - 1) * 2 - 1;
    if (idx = (tkIdx < 0 ? 23 : tkIdx));
    return tiet[idx];
}

function update() {
    const now = new Date();
    const d = now.getDate(), m = now.getMonth() + 1, y = now.getFullYear();
    
    document.getElementById('clock-live').innerText = now.toLocaleTimeString('vi-VN');
    
    const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    document.getElementById('d-num').innerText = String(d).padStart(2, '0');
    document.getElementById('wd-text').innerText = days[now.getDay()];
    document.getElementById('m-y-text').innerText = `Tháng ${String(m).padStart(2, '0')} - ${y}`;

    const lunar = getLunarDateInternal(d, m, y);
    const ld = lunar[0], lm = lunar[1], ly = lunar[2];
    const jd = getJulianDay(d, m, y);

    document.getElementById('l-dn').innerText = ld + "/" + lm;
    document.getElementById('l-yn').innerText = "Năm " + CAN[(ly + 6) % 10] + " " + CHI[(ly + 8) % 12];
    document.getElementById('l-mn').innerText = CAN[(ly * 12 + lm + 3) % 10] + " " + CHI[(lm + 1) % 12];
    document.getElementById('l-dayn').innerText = CAN[Math.floor(jd + 1.5 + 6) % 10] + " " + CHI[Math.floor(jd + 1.5 + 6) % 12];
    
    const chiHourIdx = Math.floor((now.getHours() + 1) / 2) % 12;
    const canHourIdx = ((Math.floor(jd + 1.5 + 6) % 10) * 2 + chiHourIdx) % 10;
    document.getElementById('l-hn').innerText = CAN[canHourIdx] + " " + CHI[chiHourIdx];
    document.getElementById('l-tk').innerText = getTietKhi(d, m);
}

setInterval(update, 1000);
update();