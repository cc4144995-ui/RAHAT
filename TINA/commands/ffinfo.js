const axios = require("axios");

module.exports.config = {
  name: "ffinfo",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Rahat + ChatGPT",
  description: "Full Free Fire Account Information",
  commandCategory: "game",
  usages: "[uid]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const uid = args[0];

  if (!uid) {
    return api.sendMessage(
      "⚠️ | 𝗨𝘀𝗮𝗴𝗲: 𝗳𝗳𝗶𝗻𝗳𝗼 <𝘂𝗶𝗱>",
      event.threadID,
      event.messageID
    );
  }

  try {
    const { data } = await axios.get(
      `https://rahat-ffinfo-hzhg.vercel.app/get?uid=${uid}`
    );

    const acc = data.AccountInfo || {};
    const guild = data.GuildInfo || {};
    const captain = data.captainBasicInfo || {};
    const pet = data.petInfo || {};
    const social = data.socialinfo || {};
    const credit = data.creditScoreInfo || {};

    const msg = `
╔════════════════════╗
🎮 𝔽ℝ𝔼𝔼 𝔽𝕀ℝ𝔼 𝕀ℕ𝔽𝕆
╚════════════════════╝

👤 𝐀𝐂𝐂𝐎𝐔𝐍𝐓 𝐈𝐍𝐅𝐎
━━━━━━━━━━━━━━
🆔 🅤🅘🅓: ${uid}
📛 🅽🅰🅼🅴: ${acc.AccountName || "N/A"}
🌍 ʀᴇɢɪᴏɴ: ${acc.AccountRegion || "N/A"}
⭐ 𝑳𝑒𝒗𝑒𝒍: ${acc.AccountLevel || "N/A"}
❤️ 𝗟𝗶𝗸𝗲𝘀: ${acc.AccountLikes || "N/A"}
🎖️ 𝕋𝕚𝕥𝕝𝕖: ${acc.Title || "N/A"}

🏆 𝐁𝐑 𝐑𝐚𝐧𝐤 𝐏𝐨𝐢𝐧𝐭: ${acc.BrRankPoint || "N/A"}
🏅🅑🅡 🅜🅐🅧 🅡🅐🅝🅚: ${acc.BrMaxRank || "N/A"}

⚔️ ᴄs ʀᴀɴᴋ ᴘᴏɪɴᴛ: ${acc.CsRankPoint || "N/A"}
🎯 𝑪𝑺 𝑴𝑎𝒙 𝑹𝑎𝒏𝒌: ${acc.CsMaxRank || "N/A"}

🖼️ 𝑨𝒗𝑎𝒕𝑎𝒓 𝑰𝑫: ${acc.AccountAvatarId || "N/A"}
🎨 𝗕𝗮𝗻𝗻𝗲𝗿 𝗜𝗗: ${acc.AccountBannerId || "N/A"}
📱 𝕍𝕖𝕣𝕤𝕚𝕠𝕟: ${acc.ReleaseVersion || "N/A"}

━━━━━━━━━━━━━━

🏰 𝐆𝐔𝐈𝐋𝐃 𝐈𝐍𝐅𝐎
━━━━━━━━━━━━━━
🏷️ 🅖🅤🅘🅛🅓 🅝🅐🅜🅔: ${guild.GuildName || "N/A"}
🆔 🅶🆄🅸🅻🅳 🅸🅳: ${guild.GuildID || "N/A"}
👥 𝐌𝐞𝐦𝐛𝐞𝐫𝐬: ${guild.GuildMember || "N/A"}
📦 ℂ𝕒𝕡𝕒𝕔𝕚𝕥𝕪: ${guild.GuildCapacity || "N/A"}
🔰 ʟᴇᴠᴇʟ: ${guild.GuildLevel || "N/A"}
👑 𝑶𝒘𝒏𝑒𝒓 𝑼𝑰𝑫: ${guild.GuildOwner || "N/A"}

━━━━━━━━━━━━━━

👑 𝗖𝗔𝗣𝗧𝗔𝗜𝗡 𝗜𝗡𝗙𝗢
━━━━━━━━━━━━━━
📛 ℕ𝕚𝕔𝕜𝕟𝕒𝕞𝕖: ${captain.nickname || "N/A"}
🆔 𝐂𝐚𝐩𝐭𝐚𝐢𝐧 𝐔𝐈𝐃: ${captain.accountId || "N/A"}
🌍 🅡🅔🅖🅘🅞🅝𝐂𝐚𝐩𝐭𝐚𝐢𝐧 𝐔𝐈𝐃: ${captain.region || "N/A"}
⭐ 🅻🅴🆅🅴🅻: ${captain.level || "N/A"}
❤️ ʟɪᴋᴇs: ${captain.liked || "N/A"}

🏆 𝑩𝑹 𝑹𝑎𝒏𝒌: ${captain.rank || "N/A"}
🎖️ 𝗕𝗥 𝗠𝗮𝘅 𝗥𝗮𝗻𝗸: ${captain.maxRank || "N/A"}

⚔️ ℂ𝕊 ℝ𝕒𝕟𝕜: ${captain.csRank || "N/A"}
🎯 𝐂𝐒 𝐌𝐚𝐱 𝐑𝐚𝐧𝐤: ${captain.csMaxRank || "N/A"}

📊 🅡🅐🅝🅚🅘🅝🅖 🅟🅞🅘🅝🅣🅢: ${captain.rankingPoints || "N/A"}

━━━━━━━━━━━━━━

🐾 🅿🅴🆃 🅸🅽🅵🅾
━━━━━━━━━━━━━━
🆔 ᴘᴇᴛ ɪᴅ: ${pet.id || "N/A"}
⭐ 𝑷𝑒𝒕 𝑳𝑒𝒗𝑒𝒍: ${pet.level || "N/A"}
📈 𝗣𝗲𝘁 𝗘𝗫𝗣: ${pet.exp || "N/A"}
🎯 𝕊𝕜𝕚𝕝𝕝 𝕀𝔻: ${pet.selectedSkillId || "N/A"}
🎨 𝐒𝐤𝐢𝐧 𝐈𝐃: ${pet.skinId || "N/A"}

━━━━━━━━━━━━━━

💯 🅒🅡🅔🅓🅘🅣 🅘🅝🅕🅞
━━━━━━━━━━━━━━
📊 🅲🆁🅴🅳🅸🆃 🆂🅲🅾🆁🅴: ${credit.creditScore || "N/A"}
🎁 ʀᴇᴡᴀʀᴅ sᴛᴀᴛᴇ: ${credit.rewardState || "N/A"}

━━━━━━━━━━━━━━

🌐 𝐒𝐎𝐂𝐈𝐀𝐋 𝐈𝐍𝐅𝐎
━━━━━━━━━━━━━━
🗣️ 𝕃𝕒𝕟𝕘𝕦𝕒𝕘𝕖: ${social.language || "N/A"}
📝 𝗦𝗶𝗴𝗻𝗮𝘁𝘂𝗿𝗲: ${social.signature || "N/A"}

━━━━━━━━━━━━━━
⚡ Powered By 𝐑𝐀𝐇𝐀𝐓 𝐊𝐇𝐀𝐍 𝐀𝐏𝐈😎🥰
`;

    api.sendMessage(msg, event.threadID, event.messageID);

  } catch (err) {
    console.log(err);

    api.sendMessage(
      "❌ 𝑼𝑰𝑫 𝑵𝒐𝒕 𝑭𝒐𝒖𝒏𝑑 𝑶𝒓 𝑨𝑷𝑰 𝑬𝒓𝒓𝒐𝒓!",
      event.threadID,
      event.messageID
    );
  }
};

