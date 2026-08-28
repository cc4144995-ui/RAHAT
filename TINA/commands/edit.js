const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "edit",
  version: "1.0.7",
  hasPermssion: 2,
  credits: "RAHAT🥰",
  description: "Edit image using NanoBanana API",
  commandCategory: "AI",
  usages: "reply image + text",
  cooldowns: 30
};

module.exports.run = async function ({ api, event, args }) {
  const prompt = args.join(" ");
  if (!prompt)
    return api.sendMessage(
      "⚠️ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐬𝐨𝐦𝐞 𝐭𝐞𝐱𝐭 𝐟𝐨𝐫 𝐭𝐡𝐞 𝐢𝐦𝐚𝐠𝐞.",
      event.threadID,
      event.messageID
    );

  api.setMessageReaction("☣️", event.messageID, () => {}, true);

  try {
    if (
      !event.messageReply ||
      !event.messageReply.attachments ||
      !event.messageReply.attachments[0] ||
      !event.messageReply.attachments[0].url
    ) {
      api.setMessageReaction("⚠️", event.messageID, () => {}, true);
      return api.sendMessage(
        "⚠️ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚𝐧 𝐢𝐦𝐚𝐠𝐞.",
        event.threadID,
        event.messageID
      );
    }

    // WAIT MESSAGE
    api.sendMessage(
      "⏳ Please wait few minutes... image processing চলছে...",
      event.threadID
    );

    const imgUrl = event.messageReply.attachments[0].url;

    const requestURL = `https://mahbub-ullash.cyberbot.top/api/nano-banana?prompt=${encodeURIComponent(
      prompt
    )}&imageUrl=${encodeURIComponent(imgUrl)}`;

    const res = await axios.get(requestURL);
    const data = res.data;

    if (!data || data.status !== true || !data.image) {
      api.setMessageReaction("⚠️", event.messageID, () => {}, true);
      return api.sendMessage(
        "❌ 𝐀𝐏𝐈 𝐄𝐫𝐫𝐨𝐫: 𝐈𝐦𝐚𝐠𝐞 𝐝𝐚𝐭𝐚 𝐧𝐨𝐭 𝐫𝐞𝐜𝐞𝐢𝐯𝐞𝐝.",
        event.threadID,
        event.messageID
      );
    }

    const finalImageURL = data.image;

    // ✅ CUSTOM OPERATOR NAME
    const operatorName = "Khan Rahul RK API";

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    const filePath = path.join(cacheDir, `${Date.now()}.jpg`);

    const writer = fs.createWriteStream(filePath);
    const response = await axios({
      url: finalImageURL,
      method: "GET",
      responseType: "stream",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36"
      }
    });

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    api.setMessageReaction("☢️", event.messageID, () => {}, true);

    api.sendMessage(
      {
        body: `✅ 𝐈𝐦𝐚𝐠𝐞 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲!\n👤 Operator: ${operatorName}`,
        attachment: fs.createReadStream(filePath)
      },
      event.threadID,
      () => {
        setTimeout(() => {
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            console.error("File delete error:", e);
          }
        }, 2000);
      },
      event.messageID
    );

  } catch (err) {
    console.error("❌ ERROR Details:", err);
    api.setMessageReaction("❌", event.messageID, () => {}, true);
    return api.sendMessage(
      "❌ 𝐄𝐫𝐫𝐨𝐫 𝐰𝐡𝐢𝐥𝐞 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐭𝐡𝐞 𝐢𝐦𝐚𝐠𝐞.",
      event.threadID,
      event.messageID
    );
  }
};