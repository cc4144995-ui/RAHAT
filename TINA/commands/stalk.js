/**
 * Stalk Command (Mirai Bot)
 * Gets detailed information about a Facebook user including their profile picture
 */

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");
const fsp = fs.promises;

const API_ENDPOINT = "https://priyanshuapi.xyz/api/runner/fb-stalk/stalk";

/* ===== Helpers ===== */
function preventLinkPreview(value) {
  if (!value || value === "No data") return value;
  return value.replace(/https?:\/\/\S+/gi, (url) =>
    url.replace("://", "://\u200b")
  );
}

function normalizeFacebookLink(link) {
  if (!link) return link;
  let normalized = link.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }
  return normalized;
}

function buildFormattedMessage(data = {}) {
  const safeWebsite = preventLinkPreview(data.website || "No data");
  const safeLink = preventLinkPreview(data.link || "No data");

  return (
    `👤 𝐍𝐚𝐦𝐞: ${data.name || "No data"}\n` +
    `🆔 𝐈𝐃: ${data.userId || "No data"}\n` +
    `📛 𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞: ${data.username || "No data"}\n` +
    `🎂 𝐁𝐢𝐫𝐭𝐡𝐝𝐚𝐲: ${data.birthday || "No data"}\n` +
    `⚤ 𝐆𝐞𝐧𝐝𝐞𝐫: ${data.gender || "No data"}\n` +
    `💑 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧𝐬𝐡𝐢𝐩 𝐒𝐭𝐚𝐭𝐮𝐬: ${data.relationshipStatus || "No data"}\n` +
    `ℹ️ 𝐀𝐛𝐨𝐮𝐭: ${data.about || "No data"}\n` +
    `🏡 𝐇𝐨𝐦𝐞𝐭𝐨𝐰𝐧: ${data.hometown || "No data"}\n` +
    `📍 𝐋𝐨𝐜𝐚𝐭𝐢𝐨𝐧: ${data.location || "No data"}\n` +
    `🌐 𝐖𝐞𝐛𝐬𝐢𝐭𝐞: ${safeWebsite}\n` +
    `🔗 𝐋𝐢𝐧𝐤: ${safeLink}\n` +
    `💬 𝐒𝐭𝐚𝐭𝐮𝐬: ${data.quotes || "No data"}\n` +
    `❤️ 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧𝐬𝐡𝐢𝐩 𝐰𝐢𝐭𝐡: ${data.significantOther || "No data"}\n` +
    `👥 𝐓𝐨𝐭𝐚𝐥 𝐅𝐨𝐥𝐥𝐨𝐰𝐞𝐫𝐬: ${data.subscribersCount ?? "No data"}`
  );
}

/* ===== Mirai Config ===== */
module.exports.config = {
  name: "stalk",
  aliases: ["userinfo", "whois"],
  version: "1.0.0",
  hasPermission: 0,
  credits: "RAHAT😘",
  description: "Get detailed information about a Facebook user",
  commandCategory: "utility",
  usages:
    "stalk | stalk @mention | stalk UID | stalk (reply) | stalk profile_link",
  cooldowns: 5
};

/* ===== Mirai Run ===== */
module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID, mentions, messageReply } = event;

  try {
    let userId = null;
    let targetLink = null;

    if (Object.keys(mentions).length > 0) {
      userId = Object.keys(mentions)[0];
    } else if (messageReply) {
      userId = messageReply.senderID;
    } else if (args.length > 0 && /^\d+$/.test(args[0])) {
      userId = args[0];
    } else if (
      args.length > 0 &&
      args[0].match(
        /(?:https?:\/\/)?(?:www\.)?(?:facebook|fb)\.com\/(?:profile\.php\?id=|[\w.]+)/
      )
    ) {
      targetLink = normalizeFacebookLink(args[0]);
    } else if (args.length === 0) {
      userId = senderID;
    } else {
      return api.sendMessage(
        "❓ Usage:\n" +
          "- stalk\n" +
          "- stalk @mention\n" +
          "- stalk UID\n" +
          "- stalk (reply)\n" +
          "- stalk Facebook profile link",
        threadID,
        messageID
      );
    }

    const payload = targetLink
      ? { link: targetLink }
      : { userId: String(userId) };

    const processingMsg = await api.sendMessage(
      "🔍 Fetching user information...",
      threadID
    );

    const apiKey = global.config?.apiKeys?.priyanshuApi;
    if (!apiKey) {
      return api.sendMessage(
        "⚠️ Priyanshu API key is not configured in config.json",
        threadID,
        messageID
      );
    }

    const response = await axios.post(API_ENDPOINT, payload, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      timeout: 15000
    });

    if (!response.data?.success || !response.data?.data) {
      throw new Error("Failed to fetch user information");
    }

    const userData = response.data.data;
    const formattedBody =
      userData.formattedMessage || buildFormattedMessage(userData);

    let attachment = null;
    let profilePicPath = null;

    if (userData.profilePictureUrl) {
      try {
        const dir = path.join(__dirname, "temporary");
        await fsp.mkdir(dir, { recursive: true });

        profilePicPath = path.join(
          dir,
          `profile_${userData.userId || userId || Date.now()}.jpg`
        );

        const imgRes = await axios.get(userData.profilePictureUrl, {
          responseType: "arraybuffer",
          timeout: 15000
        });

        const buffer = Buffer.from(imgRes.data);
        await fsp.writeFile(profilePicPath, buffer);
        attachment = fs.createReadStream(profilePicPath);
      } catch (e) {
        console.error("Profile picture download failed:", e.message);
      }
    }

    api.unsendMessage(processingMsg.messageID);

    await api.sendMessage(
      {
        body: formattedBody,
        mentions: [
          {
            tag: userData.name || "Facebook User",
            id: userData.userId || userId || senderID
          }
        ],
        attachment
      },
      threadID,
      messageID
    );

    if (profilePicPath) {
      await fsp.unlink(profilePicPath).catch(() => {});
    }
  } catch (error) {
    console.error("Stalk command error:", error.message || error);
    return api.sendMessage(
      "❌ User information fetch করতে সমস্যা হয়েছে, পরে আবার চেষ্টা করো।",
      threadID,
      messageID
    );
  }
};