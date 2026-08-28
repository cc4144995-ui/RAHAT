module.exports.config = {
  name: "tagall",
  version: "1.1.0",
  hasPermssion: 1, // শুধু গ্রুপ এডমিন
  credits: "Rahul Khan",
  description: "সব মেম্বারকে ট্যাগ করবে এবং নামের লিস্ট দেখাবে",
  commandCategory: "group",
  usages: "tagall [মেসেজ]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const members = threadInfo.userInfo;

    if (!members || members.length === 0) {
      return api.sendMessage(
        "❌ গ্রুপে কোনো মেম্বার পাওয়া যায়নি!",
        event.threadID
      );
    }

    let mentions = [];
    let nameList = "";
    let count = 1;

    for (let user of members) {
      mentions.push({
        tag: "‎", // invisible mention
        id: user.id
      });

      nameList += `${count}. ${user.name}\n`;
      count++;
    }

    const customMsg = args.join(" ");
    const body =
      (customMsg ? `📢 ${customMsg}\n\n` : "📢 সবাই একটু মনোযোগ দিন\n\n") +
      "👥 গ্রুপ মেম্বার লিস্ট:\n" +
      nameList +
      `\nমোট মেম্বার: ${members.length} জন`;

    api.sendMessage(
      {
        body: body,
        mentions: mentions
      },
      event.threadID
    );

  } catch (err) {
    console.log(err);
    api.sendMessage(
      "❌ দুঃখিত! TagAll কমান্ডে সমস্যা হয়েছে।",
      event.threadID
    );
  }
};