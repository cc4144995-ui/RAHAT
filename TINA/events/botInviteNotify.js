module.exports.config = {
  name: "botInviteNotify",
  eventType: ["log:subscribe"],
  version: "1.2.0",
  credits: "RAHAT KHAN😍",
  description: "Notify owner group when bot is added to any group"
};

module.exports.run = async function ({ api, event }) {
  try {
    const botID = api.getCurrentUserID();

    // 🔴 এখানে তোমার personal group ID বসাও
    const NOTIFY_GROUP_ID = "1447233410257721";

    if (!event.logMessageData) return;

    const added = event.logMessageData.addedParticipants || [];

    for (const user of added) {
      if (
        user.userFbId == botID ||
        user.userFbId == `fbid:${botID}`
      ) {
        const threadInfo = await api.getThreadInfo(event.threadID);

        const msg =
`🚨 BOT ALERT 🚨

বস তোমার বট একটা গ্রুপ এ এড করা হয়েছে ✅

📌 গ্রুপ নাম: ${threadInfo.threadName || "No Name"}
👥 মেম্বার: ${threadInfo.participantIDs.length}
🆔 গ্রুপ ID: ${event.threadID}
👤 এড করেছে: ${event.author}

⏰ সময়: ${new Date().toLocaleString()}
`;

        await api.sendMessage(msg, NOTIFY_GROUP_ID);
        return;
      }
    }
  } catch (err) {
    console.log("BotInviteNotify Error:", err);
  }
};