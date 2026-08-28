const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "del",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Rahul",
  description: "Reply number to delete command file",
  commandCategory: "system",
  usages: ".del4",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const cmdPath = __dirname;
  const files = fs.readdirSync(cmdPath).filter(f => f.endsWith(".js"));

  if (!files.length)
    return api.sendMessage("❌ Kono command file pai nai", event.threadID);

  let msg = "🗂️ Command File List:\n\n";
  files.forEach((f, i) => {
    msg += `${i + 1}. ${f}\n`;
  });

  msg += "\n🗑️ Je file delete korte chao tar number reply daw";

  api.sendMessage(msg, event.threadID, (err, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      author: event.senderID,
      files
    });
  });
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  if (event.senderID !== handleReply.author)
    return api.sendMessage("❌ Tumi owner na", event.threadID);

  const index = parseInt(event.body) - 1;
  if (isNaN(index) || !handleReply.files[index])
    return api.sendMessage("❌ Vul number", event.threadID);

  const filePath = path.join(__dirname, handleReply.files[index]);

  try {
    fs.unlinkSync(filePath);
    api.sendMessage(`✅ Deleted: ${handleReply.files[index]}`, event.threadID);
  } catch (e) {
    api.sendMessage("❌ File delete korte parlam na", event.threadID);
  }
};