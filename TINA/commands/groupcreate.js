module.exports.config = {
 name: "creategroup",
 version: "1.0.0",
 hasPermission: 2, // bot admin
 credits: "RAHAT KHAN🌹",
 description: "Create a new group with mentioned users",
 commandCategory: "utility",
 usages: "creategroup Group Name | @mention1 @mention2",
 cooldowns: 5,
 aliases: ["newgroup", "makegroup"]
};

module.exports.run = async function ({ api, event, args, Threads, Users }) {
 const { threadID, senderID, mentions } = event;

 // 🔒 Admin check (Mirai standard)
 const adminBot = global.config.ADMINBOT || [];
 if (!adminBot.includes(senderID)) {
 return api.sendMessage(
 "❌ Only bot admins can create groups.",
 threadID
 );
 }

 // 👥 Mention IDs
 const mentionIDs = Object.keys(mentions);

 if (mentionIDs.length < 1) {
 return api.sendMessage(
 "⚠️ Please mention at least 1 person.\n\nUsage:\n.creategroup Group Name | @user1 @user2",
 threadID
 );
 }

 // 📝 Group name parse
 const input = args.join(" ");
 const parts = input.split("|");
 let groupName = "New Group";

 if (parts.length > 1 && parts[0].trim() !== "") {
 groupName = parts[0].trim();
 }

 // 👤 Add creator
 mentionIDs.push(senderID);

 try {
 // 🧠 Mirai create group
 const newThreadID = await api.createNewGroup(mentionIDs, groupName);

 return api.sendMessage(
 `✅ Group Created Successfully!\n\n📛 Name: ${groupName}\n🆔 Thread ID: ${newThreadID}`,
 threadID
 );
 } catch (err) {
 return api.sendMessage(
 `❌ Failed to create group.\n\nError: ${err.message || "Unknown Error"}`,
 threadID
 );
 }
};