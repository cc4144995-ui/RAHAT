/**
 * Sylhet Division All-in-One Info
 * Sylhet + Moulvibazar + Sreemangal
 * Tourist Spots + FULL Mazar + Ziarat Rules
 * High Quality & Unique
 * Credits: Rahat
 * ⚠️ Do NOT change credits or protection key
 */

const PROTECT_KEY = "RAHAT_SYLHET_ALL_PROTECT";

module.exports.config = {
  name: "sylhetall",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "RAHAT",
  description: "Sylhet, Moulvibazar & Sreemangal complete tourist + mazar + ziarat guide",
  commandCategory: "Information",
  usages: ".sylhetall",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {

  // 🔐 Anti-change system
  if (module.exports.config.credits !== "RAHAT" || PROTECT_KEY !== "RAHAT_SYLHET_ALL_PROTECT") {
    return api.sendMessage(
      "❌ File modified detected!\n⚠️ Credits বা system change করা হয়েছে।",
      event.threadID,
      event.messageID
    );
  }

  const msg =
`🌿🕌 সিলেট বিভাগ – সম্পূর্ণ ভ্রমণ ও জিয়ারত গাইড 🕌🌿

══════════════════
🏞️ সিলেট জেলার দর্শনীয় স্থান
══════════════════
📍 জাফলং  
📍 রাতারগুল সোয়াম্প ফরেস্ট  
📍 বিছানাকান্দি  
📍 লালাখাল  
📍 ভোলাগঞ্জ  
📍 মালনীছড়া চা বাগান  
📍 হাকালুকি হাওর  

══════════════════
🏞️ মৌলভীবাজার জেলার দর্শনীয় স্থান
══════════════════
📍 লাউয়াছড়া জাতীয় উদ্যান  
📍 হাকালুকি হাওর  
📍 মাধবকুণ্ড জলপ্রপাত  
📍 হামহাম জলপ্রপাত  
📍 পরিকুট পাহাড়  

══════════════════
🏞️ শ্রীমঙ্গল (Sreemangal) দর্শনীয় স্থান
══════════════════
📍 লাউয়াছড়া জাতীয় উদ্যান  
📍 নীলকণ্ঠ টি কেবিন  
📍 বাইক্কা বিল  
📍 চা বাগান এলাকা  
📍 লেমন লেক  

══════════════════
🕌 সিলেট জেলার মাজার (FULL)
══════════════════
🕋 হযরত শাহজালাল (রহ.)  
📍 দরগাহ মহল্লা, সিলেট  

🕋 হযরত শাহপরান (রহ.)  
📍 খাদিমনগর, সিলেট  

══════════════════
🕌 মৌলভীবাজার জেলার মাজার (FULL)
══════════════════
🕋 হযরত সৈয়দ শাহ মোস্তফা (রহ.)  
📍 মৌলভীবাজার সদর  

🕋 হযরত শাহ মজিদ (রহ.)  
📍 কুলাউড়া  

🕋 হযরত সৈয়দ শাহ কামাল (রহ.)  
📍 রাজনগর  

══════════════════
🕌 শ্রীমঙ্গল (Sreemangal) মাজার (FULL)
══════════════════
🕋 হযরত শাহ ইসমাইল (রহ.)  
📍 শ্রীমঙ্গল শহর  

🕋 হযরত শাহ সুলতান (রহ.)  
📍 শ্রীমঙ্গল, মৌলভীবাজার  

══════════════════
🤲 জিয়ারতের সম্পূর্ণ নিয়ম
══════════════════
✅ নিয়ত: শুধু আল্লাহর সন্তুষ্টির জন্য  
✅ সালাম: “আসসালামু আলাইকুম ইয়া আহলাল কুবুর”  
✅ কিবলার দিকে মুখ করে দোয়া  

📖 সূরা পড়ার নিয়ম:
▪️ সূরা ফাতিহা – ১ বার  
▪️ সূরা ইখলাস – ৩ বার  
▪️ সূরা ফালাক – ১ বার  
▪️ সূরা নাস – ১ বার  
▪️ আয়াতুল কুরসি – ১ বার (ইচ্ছা হলে)  

❌ নিষিদ্ধ কাজ:
▪️ কবরকে সিজদা  
▪️ কবর ঘিরে তাওয়াফ  
▪️ কবরবাসীর কাছে দোয়া চাওয়া  
▪️ মানত, সুতো, আগরবাতি  

══════════════════
🕌 সঠিক আকিদা
══════════════════
✔️ উপকার ও ক্ষতি একমাত্র আল্লাহর হাতে  
✔️ ওলীগণ সম্মানিত, উপাস্য নন  

✨ সিলেট বিভাগ = প্রকৃতি, ইতিহাস ও দ্বীনের মিলন ✨`;

  return api.sendMessage(msg, event.threadID, event.messageID);
};