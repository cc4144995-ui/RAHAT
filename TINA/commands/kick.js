module.exports = {
  config: {
    name: "kick",
    version: "4.0",
    credits: "RAHAT",
    hasPermission: 2,
    commandCategory: "group",
    guide: "mention/reply"
  },

  run: async function ({ api, event }) {
    const { threadID, messageID, mentions, messageReply } = event;

    let uids = [];

    if (messageReply) uids.push(messageReply.senderID);
    if (mentions) uids.push(...Object.keys(mentions));

    if (uids.length === 0) {
      return api.sendMessage("⚠️ Mention ba reply dao", threadID, messageID);
    }

    for (let uid of uids) {
      try {
        await api.removeUserFromGroup(uid, threadID);
        api.sendMessage("🚫 তোমাকে গ্রুপ থেকে রিমুভ করা হলো সরি 😔", threadID);
      } catch {
        api.sendMessage("❌ Kick dite parlam na", threadID, messageID);
      }
    }
  }
};