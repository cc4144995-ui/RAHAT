module.exports.config = {
  name: "gcadmin",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "RAHAT🥰",
  description: "Add/Remove group admin",
  commandCategory: "group",
  usages: "[@mention] | [remove @mention]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, mentions } = event;

  if (!Object.keys(mentions).length) {
    return api.sendMessage(
      "⚠️ কাউকে মেনশন করুন।",
      threadID,
      messageID
    );
  }

  try {
    const removeMode =
      args[0] &&
      ["remove", "rm", "unadmin"].includes(args[0].toLowerCase());

    for (const uid of Object.keys(mentions)) {
      await api.changeAdminStatus(
        threadID,
        uid,
        !removeMode
      );
    }

    return api.sendMessage(
      removeMode
        ? `✅ ${Object.keys(mentions).length} জনের Admin Remove করা হয়েছে।`
        : `✅ ${Object.keys(mentions).length} জনকে Admin করা হয়েছে।`,
      threadID,
      messageID
    );

  } catch (e) {
    console.log(e);
    return api.sendMessage(
      "❌ কাজ করা যায়নি। Bot অবশ্যই Group Admin হতে হবে।",
      threadID,
      messageID
    );
  }
};