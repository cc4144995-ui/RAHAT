const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ====== CONFIG ZONE ======
const FAKE_CHAT_API_URL = 'https://nexalo-api.vercel.app/api/fake-chat-v2';
const ACCESS_TOKEN = '6628568379|c1e620fa708a1d5696fb991c1bde5662';
// ==========================

module.exports.config = {
 name: "fakechat",
 version: "1.0.1",
 hasPermssion: 2,
 credits: "RAHAT+nazrul",
 description: "প্রোফাইল ছবি দিয়ে ফেক চ্যাট বাবল বানাবে 💬 (reply বা mention দুটোই কাজ করে)",
 commandCategory: "fun",
 usages: "[text/@mention text] (reply করলে mention লাগবে না)",
 cooldowns: 5
};

// Helper: get user info (name) as a Promise
function getUserName(api, userID) {
 return new Promise((resolve) => {
 try {
 // 일부 Facebook chat APIs use api.getUserInfo([...], cb)
 api.getUserInfo([userID], (err, ret) => {
 if (err) return resolve(null);
 if (ret && ret[userID] && ret[userID].name) return resolve(ret[userID].name);
 resolve(null);
 });
 } catch (e) {
 resolve(null);
 }
 });
}

// Helper: mask a name for privacy, e.g. "Nazrul" -> "Na****"
function maskName(name) {
 if (!name) return "";
 name = name.trim();
 if (name.length <= 2) return name.charAt(0) + "*";
 const visible = Math.min(2, name.length);
 return name.slice(0, visible) + "*".repeat(Math.min(4, Math.max(1, name.length - visible)));
}

module.exports.run = async function ({ api, event, args }) {
 let filePath;

 try {
 // If user provided no args at all -> error (still require text)
 if (args.length < 1) {
 return api.sendMessage(
 "❌ দয়া করে কিছু টেক্সট লিখুন।\nউদাহরণ:\n.fakechat হ্যালো\n.fakechat @username হ্যালো\n(বা কারও মেসেজে রিপ্লাই করে রেপ্লাই টেক্সট লিখে রান করো)",
 event.threadID,
 event.messageID
 );
 }

 let imageUserID = event.senderID; // default: sender (you)
 let text;

 // --- CASE A: If the command is a reply to another message, use that sender's profile pic ---
 if (event.messageReply && event.messageReply.senderID) {
 imageUserID = event.messageReply.senderID;
 }

 // Prepare text: if mentions present, use the first mention for special handling
 const mentionIds = event.mentions ? Object.keys(event.mentions) : [];
 if (mentionIds.length > 0) {
 // If someone is mentioned explicitly, prefer their photo unless the command was a reply (reply overrides)
 // But we'll still use the reply override above; here we just fetch & mask their name and prepend to text.
 const firstMentionId = mentionIds[0];

 // If the user both replied AND mentioned someone, keep the reply's imageUserID (reply has priority).
 // But still show masked name of the mentioned person in the text.
 const realName = await getUserName(api, firstMentionId);
 const masked = realName ? maskName(realName) : '';

 // Build text: remove any literal @username tokens from args and join
 text = args.filter(a => !a.startsWith('@')).join(' ').trim();

 // Prepend masked name if available
 if (masked) {
 text = `${masked}: ${text || ""}`.trim();
 }
 } else {
 // No explicit mention: just use args as text
 text = args.join(' ').trim();
 }

 if (!text) {
 return api.sendMessage(
 "❌ দয়া করে ফেক চ্যাটের জন্য কিছু টেক্সট দিন।",
 event.threadID,
 event.messageID
 );
 }

 // If reply and there were no mentions, ensure imageUserID already set to replied user above.
 // Build Facebook profile pic URL
 const imageUrl = `https://graph.facebook.com/${imageUserID}/picture?width=512&height=512&access_token=${ACCESS_TOKEN}`;
 const apiUrl = `${FAKE_CHAT_API_URL}?imageUrl=${encodeURIComponent(imageUrl)}&text=${encodeURIComponent(text)}`;

 const fakeChatResponse = await axios.get(apiUrl, { timeout: 30000, responseType: 'stream' });

 const tempDir = path.join(__dirname, "cache");
 if (!fs.existsSync(tempDir)) {
 fs.mkdirSync(tempDir, { recursive: true });
 }
 const fileName = `fakechat_${crypto.randomBytes(8).toString('hex')}.png`;
 filePath = path.join(tempDir, fileName);

 const writer = fs.createWriteStream(filePath);
 fakeChatResponse.data.pipe(writer);

 await new Promise((resolve, reject) => {
 writer.on('finish', resolve);
 writer.on('error', reject);
 });

 api.sendMessage({
 body: "💬 এখানে আপনার ফেক চ্যাট বাবল",
 attachment: fs.createReadStream(filePath)
 }, event.threadID, () => {
 try {
 if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
 } catch (e) { /* ignore */ }
 }, event.messageID);

 } catch (err) {
 api.sendMessage(`⚠️ সমস্যা হয়েছে: ${err.message}`, event.threadID, event.messageID);
 if (filePath && fs.existsSync(filePath)) {
 try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
 }
 }
};