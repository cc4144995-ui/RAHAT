const fs = require("fs");
const path = require("path");
const axios = require("axios");
const Photo360 = require("abir-photo360-apis");

module.exports.config = {
 name: "ephoto",
 version: "1.2.0",
 permission: 0,
 credits: "RAHAT",
 description: "Generate stylish images using Ephoto360 templates",
 commandCategory: "textmaker",
 usages: "/ephoto <templateID> <text>",
 cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
 if (args.length < 2) {
 return api.sendMessage(
 "⚠️ দয়া করে একটি টেমপ্লেট আইডি ও একটি নাম দিন।\n\n📌 উদাহরণ:\n/ephoto 1 Rahul",
 event.threadID,
 event.messageID
 );
 }

 const templateKey = args[0].toLowerCase();
 const name = args.slice(1).join(" ");
 const cacheDir = path.join(__dirname, "cache");
 const imagePath = path.join(cacheDir, "ephoto_output.png");

 const templatesPath = path.join(__dirname, "Nazrul", "nazrulephoto.json");
 let templates = {};

 try {
 templates = JSON.parse(fs.readFileSync(templatesPath, "utf8"));
 } catch (error) {
 return api.sendMessage("❌ টেমপ্লেট লোড করতে ব্যর্থ হয়েছে!", event.threadID, event.messageID);
 }

 const templateUrl = templates[templateKey];
 if (!templateUrl) {
 const available = Object.keys(templates).join(", ");
 return api.sendMessage(
 `❌ ভুল টেমপ্লেট আইডি!\n\n✅ উপলব্ধ টেমপ্লেট আইডি:\n${available}\n\n📌 উদাহরণ:\n/ephoto 1 Rahul`,
 event.threadID,
 event.messageID
 );
 }

 if (!fs.existsSync(cacheDir)) {
 fs.mkdirSync(cacheDir, { recursive: true });
 }

 try {
 const photo360 = new Photo360(templateUrl);
 photo360.setName(name);

 const result = await photo360.execute();

 const response = await axios.get(result.imageUrl, { responseType: "arraybuffer" });
 fs.writeFileSync(imagePath, response.data);

 return api.sendMessage(
 {
 body: `✅𝐈𝐦𝐚𝐠𝐞 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐝 𝐅𝐨𝐫\n𝐍𝐚𝐦𝐞:-${name}\n𝐍𝐮𝐦𝐛𝐞𝐫:-${templateKey}\n𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ━➢ Khan Rahul RK🌹`,
 attachment: fs.createReadStream(imagePath)
 },
 event.threadID,
 event.messageID
 );
 } catch (err) {
 console.error("Ephoto Error:", err.message);
 return api.sendMessage(
 "❌ ইমেজ জেনারেট করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।",
 event.threadID,
 event.messageID
 );
 }
};
