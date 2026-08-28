const fs = require("fs");

const axios = require("axios");

const path = require("path");

module.exports.config = {

  name: "unsendnotify",

  version: "1.0.6",

  hasPermission: 0,

  permission: 0,

  credits: "nazrul",

  description: "Unsend হলে টেক্সট ও মিডিয়া আলাদা রিপোর্ট পাঠাবে (মিডিয়া ফাইল সহ)",

  prefix: false,

 usePrefix: false,

  commandCategory: "group",

  usages: "",

  cooldowns: 0

};

const notifyGroupTID = "1447233410257721"; // এখানে তোমার নির্দিষ্ট গ্রুপ TID দাও

if (!fs.existsSync(__dirname + "/unsendCache"))

  fs.mkdirSync(__dirname + "/unsendCache");

module.exports.handleEvent = async function ({ api, event }) {

  const { messageID, threadID, senderID, type, body, attachments } = event;

  if (!global._unsendData) global._unsendData = {};

  // ✅ সংরক্ষণ করা হচ্ছে

  if (type === "message") {

    const savedAttachments = [];

    if (attachments?.length > 0) {

      for (const item of attachments) {

        const ext = item.type === "photo" ? "jpg"

                  : item.type === "video" ? "mp4"

                  : item.type === "audio" ? "mp3"

                  : item.type === "animated_image" ? "gif"

                  : "bin";

        const filename = `${messageID}_${item.filename || Date.now()}.${ext}`;

        const filepath = path.join(__dirname, "unsendCache", filename);

        const file = (await axios.get(item.url, { responseType: "arraybuffer" })).data;

        fs.writeFileSync(filepath, Buffer.from(file, "utf-8"));

        savedAttachments.push({ type: item.type, path: filepath, filename: filename });

      }

    }

    global._unsendData[messageID] = {

      senderID,

      threadID,

      body: body || "",

      attachments: savedAttachments,

      time: Date.now()

    };

  }

  // ✅ আনসেন্ড হলে রিপোর্ট

  if (type === "message_unsend") {

    const oldMsg = global._unsendData[messageID];

    if (!oldMsg) return;

    let name = "Unknown", groupName = "Unknown Group";

    try {

      const userInfo = await api.getUserInfo(oldMsg.senderID);

      name = userInfo?.[oldMsg.senderID]?.name || "Unknown";

    } catch (e) {

      console.log("❌ ইউজার নাম আনতে সমস্যা:", e.message);

    }

    try {

      const threadInfo = await api.getThreadInfo(oldMsg.threadID);

      groupName = threadInfo?.threadName || "Unnamed Group";

    } catch (e) {

      console.log("❌ গ্রুপ নাম আনতে সমস্যা:", e.message);

    }

    const time = new Date(oldMsg.time).toLocaleString("en-BD", {

      timeZone: "Asia/Dhaka"

    });

    // 📄 লিখিত মেসেজ

    if (oldMsg.body && oldMsg.body.trim() !== "") {

      const msgReport = `🚨 একটি মেসেজ Unsend হয়েছে!

━━━━━━━━━━━━━━

👤 𝐍𝐚𝐦𝐞: ${name}

🆔 𝐔𝐢𝐝: ${oldMsg.senderID}

🕒 𝐓𝐢𝐦𝐞: ${time}

👥 𝐆𝐜: ${groupName}

🆔𝐓𝐢𝐝${oldMsg.threadID}

💬 𝐌𝐬𝐠: ${oldMsg.body}`;

      await api.sendMessage(msgReport, notifyGroupTID);

    }

    // 🖼️ ছবি/ভিডিও মিডিয়া

    if (oldMsg.attachments.length > 0) {

      setTimeout(async () => {

        const mediaTypes = oldMsg.attachments.map(file => {

          const icon = file.type === "photo" ? "📷"

                     : file.type === "video" ? "🎥"

                     : file.type === "audio" ? "🎵"

                     : file.type === "animated_image" ? "🎞️"

                     : "📎";

          return `${icon} ${file.filename}`;

        });

        const mediaReport = `🚨 একটি মেসেজ Unsend হয়েছে!

━━━━━━━━━━━━━━

👤 𝐍𝐚𝐦𝐞: ${name}

🆔 𝐓𝐢𝐝: ${oldMsg.senderID}

🕒 𝐓𝐢𝐦𝐞: ${time}

👥 𝐆𝐜: ${groupName}

🆔𝐓𝐢𝐝: ${oldMsg.threadID}

📎 𝐌𝐬𝐠: ${mediaTypes.join(", ")}`;

        const files = oldMsg.attachments.map(f => fs.createReadStream(f.path));

        await api.sendMessage({ body: mediaReport, attachment: files }, notifyGroupTID);

        // ✅ ফাইল ডিলিট করে ক্লিন করা

        for (const f of oldMsg.attachments) {

          fs.unlinkSync(f.path);

        }

      }, 3000); // 3 সেকেন্ড দেরি

    }

    delete global._unsendData[messageID];

  }

};

module.exports.run = () => {};