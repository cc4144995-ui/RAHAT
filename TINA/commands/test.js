const { createCanvas } = require("canvas");
const fs = require("fs");
const axios = require("axios");

module.exports.config = {
  name: "test",
  version: "1.3",
  credits: "Cyber Rajib",
  hasPermssion: 0,
  commandCategory: "date and time",
  description: "ইংরেজি / বাংলা / হিজরি ক্যালেন্ডার + ফিউচারিস্টিক PNG ক্যালেন্ডার (হলুদ ফ্লিকার বর্ডার)",
  usages: "calendar_full"
};

function toBanglaNumber(num) {
  const map = {0:"০",1:"১",2:"২",3:"৩",4:"৪",5:"৫",6:"৬",7:"৭",8:"৮",9:"৯"};
  return num.toString().split("").map(d => map[d] || d).join("");
}

function pad(n) { return n < 10 ? "0" + n : n.toString(); }
function isGregorianLeap(year) {
  return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);
}

// Bengali calendar conversion
function toBengaliDate(gDate) {
  const gy = gDate.getFullYear();

  const bMonths = [
    "বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন",
    "কার্তিক", "অগ্রহায়ণ", "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"
  ];

  const startThis = new Date(gy, 3, 14);
  let banglaYear, startOfYear;
  if (gDate >= startThis) {
    banglaYear = gy - 593;
    startOfYear = startThis;
  } else {
    banglaYear = gy - 594;
    startOfYear = new Date(gy - 1, 3, 14);
  }

  const gyForLeap = startOfYear.getFullYear() + 1;
  const falgunDays = isGregorianLeap(gyForLeap) ? 30 : 29;
  const monthLengths = [31,31,31,31,31,30,30,30,30,30,falgunDays,30];

  const msPerDay = 24 * 60 * 60 * 1000;
  const d1 = new Date(startOfYear.getFullYear(), startOfYear.getMonth(), startOfYear.getDate());
  const d2 = new Date(gDate.getFullYear(), gDate.getMonth(), gDate.getDate());
  let daysPassed = Math.floor((d2 - d1) / msPerDay);

  let mIndex = 0;
  while (mIndex < 12 && daysPassed >= monthLengths[mIndex]) {
    daysPassed -= monthLengths[mIndex];
    mIndex++;
  }
  return {
    year: banglaYear,
    monthName: bMonths[mIndex] || "অজানা",
    day: daysPassed + 1
  };
}

module.exports.run = async ({ api, event }) => {
  try {
    // ======================== Date & Time ========================
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    const gDay = now.getDate();
    const gMonth = now.getMonth() + 1;
    const gYear = now.getFullYear();

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = ((hours + 11) % 12) + 1;
    const timeStr = `${toBanglaNumber(hour12)}:${toBanglaNumber(minutes)}:${toBanglaNumber(seconds)} ${ampm}`;

    const b = toBengaliDate(now);
    let hijriInfo = { date: "N/A", monthName: "N/A", day: "N/A", year: "N/A" };
    try {
      const dateParam = `${pad(gDay)}-${pad(gMonth)}-${gYear}`;
      const res = await axios.get(`https://api.aladhan.com/v1/gToH?date=${dateParam}`);
      if (res?.data?.data?.hijri) {
        const h = res.data.data.hijri;
        const hijriMonthsBn = {
          "Muharram": "মহররম",
          "Safar": "সফর",
          "Rabi al-Awwal": "রবিউল আউয়াল",
          "Rabi al-Thani": "রবিউস সানি",
          "Jumada al-Awwal": "জুমাদিউল আউয়াল",
          "Jumada al-Thani": "জুমাদিউস সানি",
          "Rajab": "রজব",
          "Sha'aban": "শা‘বান",
          "Ramadan": "রমজান",
          "Shawwal": "শাওয়াল",
          "Dhul-Qadah": "জিলকদ",
          "Dhul-Hijjah": "জিলহজ"
        };
        const monthEn = h.month?.en || "Hijri";
        const monthBn = hijriMonthsBn[monthEn] || monthEn;
        hijriInfo = {
          monthName: monthBn,
          day: toBanglaNumber(h.day),
          year: toBanglaNumber(h.year)
        };
      }
    } catch (e) { console.warn("Hijri API error:", e.message); }

    // ======================== Futuristic Calendar Image ========================
    const today = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();

    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    const width = 1000;
    const height = 800;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#1a1a2e");
    gradient.addColorStop(0.5, "#162447");
    gradient.addColorStop(1, "#1f4068");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Lightning/pulse effect
    for (let i = 0; i < 150; i++) {
      const x1 = Math.random() * width;
      const y1 = Math.random() * height;
      const x2 = x1 + (Math.random() * 50 - 25);
      const y2 = y1 + (Math.random() * 50 - 25);
      ctx.strokeStyle = `rgba(255,255,0,${Math.random() * 0.2})`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Header
    ctx.font = "bold 64px Sans";
    ctx.textAlign = "center";
    ctx.shadowColor = "#ffff00";
    ctx.shadowBlur = 30;
    ctx.fillStyle = "#ffff00";
    ctx.fillText(`${monthNames[month]} ${year}`, width / 2, 80);

    // Weekdays
    ctx.font = "bold 28px Sans";
    weekdays.forEach((day, i) => {
      ctx.shadowColor = "#ffff00";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(day, 50 + i * 120 + 40, 150);
    });

    // Month grid
    const boxSize = 100;
    const padding = 15;
    const startX = 50;
    const startY = 180;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let x = startX + firstDay * (boxSize + padding);
    let y = startY;

    for (let day = 1; day <= daysInMonth; day++) {
      if (day === today) {
        ctx.fillStyle = "#ffeb3b";
        ctx.shadowColor = "#ffff00";
        ctx.shadowBlur = 25;
      } else {
        ctx.fillStyle = "#0ff";
        ctx.shadowColor = "#00ffff";
        ctx.shadowBlur = 15;
      }
      ctx.fillRect(x, y, boxSize, boxSize);

      ctx.fillStyle = "#000";
      ctx.font = "bold 36px Sans";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(day, x + boxSize / 2, y + boxSize / 2);

      x += boxSize + padding;
      if ((firstDay + day) % 7 === 0) { 
        x = startX; 
        y += boxSize + padding; 
      }
    }

    // Flickering border
    const borderPadding = 20;
    const flickerIntensity = Math.random() * 50 + 20;
    ctx.lineWidth = 10;
    ctx.strokeStyle = `rgba(255,255,0,${flickerIntensity/100})`;
    ctx.shadowBlur = flickerIntensity / 2;
    ctx.shadowColor = `rgba(255,255,0,${flickerIntensity/100})`;
    ctx.strokeRect(borderPadding, borderPadding, width - 2 * borderPadding, height - 2 * borderPadding);

    const filePath = `/tmp/futuristic_calendar_${Date.now()}.png`;
    fs.writeFileSync(filePath, canvas.toBuffer());

    // ======================== Send Combined Message ========================
    const message =
`╭•┄┅═══❁🌺❁═══┅┄•╮
⚡      বিশ্ব ক্যালেন্ডার      ⚡
╰•┄┅═══❁🌺❁═══┅┄•╯

📅 ইংরেজি তারিখ: ${toBanglaNumber(gYear)}
📝 মাস: ${toBanglaNumber(gMonth)}
📛 দিন: ${toBanglaNumber(gDay)}
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
🗓️ বাংলা তারিখ: ${toBanglaNumber(b.year)}
📝 মাস: ${b.monthName}
📛 দিন: ${toBanglaNumber(b.day)}
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
🕌 হিজরি তারিখ: ${hijriInfo.year}
🗒️ মাস: ${hijriInfo.monthName}
📛 দিন: ${hijriInfo.day}
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
🕒 সময়: ${timeStr}
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
ᴅᴇᴠ: ᴄʏʙᴇʀ ʀᴀᴊɪʙ`;

    api.sendMessage(
      { body: message, attachment: fs.createReadStream(filePath) },
      event.threadID,
      () => fs.unlinkSync(filePath)
    );

  } catch (error) {
    console.error("Calendar Full Error:", error);
    api.sendMessage("ক্যালেন্ডার তৈরি করতে সমস্যা হচ্ছে! 💔", event.threadID);
  }
};