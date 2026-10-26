// src/lunar.js
// Đổi ngày dương sang âm lịch Việt Nam (múi giờ UTC+7).
// Thuật toán của Hồ Ngọc Đức: tính ngày sói (trăng mới) và kinh độ Mặt Trời
// để xác định tháng 11 âm lịch và tháng nhuận.
// Phải load trước CalendarSheet.js.

const LUNAR_TZ = 7;
const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

function jdFromDate(dd, mm, yy) {
  const a = Math.floor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  if (jd < 2299161) jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  return jd;
}

function getNewMoonDay(k, tz) {
  const T = k / 1236.85, T2 = T * T, T3 = T2 * T, dr = Math.PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  // Viết tách từng số hạng, giữ đúng dấu như công thức gốc
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  const deltat = T < -11
    ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
    : -0.000278 + 0.000265 * T + 0.000262 * T2;
  return Math.floor(Jd1 + C1 - deltat + 0.5 + tz / 24);
}

function getSunLongitude(jdn, tz) {
  const T = (jdn - 2451545.5 - tz / 24) / 36525, T2 = T * T, dr = Math.PI / 180;
  const M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
  let L = (L0 + DL) * dr;
  L -= Math.PI * 2 * Math.floor(L / (Math.PI * 2));
  return Math.floor(L / Math.PI * 6);
}

function getLunarMonth11(yy, tz) {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = Math.floor(off / 29.530588853);
  let nm = getNewMoonDay(k, tz);
  if (getSunLongitude(nm, tz) >= 9) nm = getNewMoonDay(k - 1, tz);
  return nm;
}

function getLeapMonthOffset(a11, tz) {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, tz), tz);
  let last;
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, tz), tz);
  } while (arc !== last && i < 14);
  return i - 1;
}

/** @returns {{day:number, month:number, year:number, leap:boolean}} */
function solarToLunar(dd, mm, yy, tz = LUNAR_TZ) {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, tz);
  if (monthStart > dayNumber) monthStart = getNewMoonDay(k, tz);
  let a11 = getLunarMonth11(yy, tz);
  let b11 = a11;
  let year;
  if (a11 >= monthStart) {
    year = yy;
    a11 = getLunarMonth11(yy - 1, tz);
  } else {
    year = yy + 1;
    b11 = getLunarMonth11(yy + 1, tz);
  }
  const day = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);
  let leap = false;
  let month = diff + 11;
  if (b11 - a11 > 365) {
    const leapDiff = getLeapMonthOffset(a11, tz);
    if (diff >= leapDiff) {
      month = diff + 10;
      if (diff === leapDiff) leap = true;
    }
  }
  if (month > 12) month -= 12;
  if (month >= 11 && diff < 4) year -= 1;
  return { day, month, year, leap };
}

function canChiYear(year) {
  return `${CAN[(year + 6) % 10]} ${CHI[(year + 8) % 12]}`;
}

/** "16 tháng 9, năm Bính Ngọ" (tháng nhuận ghi rõ "nhuận") */
function lunarLabel(date) {
  const l = solarToLunar(date.getDate(), date.getMonth() + 1, date.getFullYear());
  return `${l.day} tháng ${l.month}${l.leap ? " nhuận" : ""}, năm ${canChiYear(l.year)}`;
}
