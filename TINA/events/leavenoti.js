module.exports.config = { name: "leave", eventType: ["log:unsubscribe"], version: "2.0.0", credits: "RAHAT", description: "Notify when a member leaves the group with random gif/photo/video", dependencies: { "fs-extra": "", "path": "" } };

module.exports.onLoad = function () { const { existsSync, mkdirSync } = global.nodemodule["fs-extra"]; const { join } = global.nodemodule["path"];

const path = join(__dirname, "cache", "leaveGif", "randomgif");

if (!existsSync(path)) { mkdirSync(path, { recursive: true }); }

return; };

module.exports.run = async function ({ api, event, Users, Threads }) {

// Bot নিজে leave করলে কোনো message দিবে না if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) { return; }

const { createReadStream, existsSync, readdirSync } = global.nodemodule["fs-extra"];

const { join } = global.nodemodule["path"]; const { threadID } = event;

const moment = require("moment-timezone");

const time = moment .tz("Asia/Dhaka") .format("DD/MM/YYYY • hh:mm A");

const hours = Number( moment.tz("Asia/Dhaka").format("HH") );

const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;

const userID = event.logMessageData.leftParticipantFbId;

const name = global.data.userName.get(userID) || await Users.getNameUser(userID);

const type = event.author == userID ? "নিজে নিজেই চলে গেছে 😌" : "Admin সাহেবের হাতে বিদায় নিয়েছে 😅";

// ========================================== // 😂 FUNNY LEAVE MESSAGE // ==========================================

let msg = typeof data.customLeave == "undefined"

? `╭━━━〔 🚪 MEMBER EXIT 〕━━━╮ 

😳 আরে ${name}!

👋 তুমি সত্যিই চলে গেলে নাকি? গ্রুপের এত সুন্দর পরিবেশ ছেড়ে এভাবে পালিয়ে গেলে কেন? 😂

╭──────────────╮ 📌 অবস্থা ➜ ${type} 🕐 সময় ➜ {time} ╰──────────────╯

🤣 যাও যাও... আটকাবো না! কিন্তু আবার ফিরে আসলে "আমি তো শুধু একটু ঘুরতে গেছিলাম" এই অজুহাত চলবে না! 😆

💔 গ্রুপে তোমার চেয়ারটা এখন খালি... 🪑 তবে ধুলো জমতে বেশি সময় লাগবে না! 😂

🌸 ভালো থেকো, যেখানে থাকো হাসিখুশি থাকো। আর আমাদের কথা মনে পড়লে... 👀 গ্রুপে আবার হাজির হয়ে যেও!

╰━━━〔 😎 KHAN RAHUL RK 〕━━━╯`

: data.customLeave; 

// ========================================== // 🔄 VARIABLE REPLACE // ==========================================

msg = msg .replace(/{name}/g, name) .replace(/{type}/g, type)

.replace( /\{session}/g, hours < 12 ? "সকাল 🌅" : hours < 17 ? "দুপুর ☀️" : hours < 20 ? "সন্ধ্যা 🌇" : "রাত 🌙" ) .replace(/\{time}/g, time); 

// ========================================== // 🎞️ RANDOM GIF / PHOTO / VIDEO // ==========================================

const randomPath = readdirSync( join( __dirname, "cache", "leaveGif", "randomgif" ) );

let formPush;

if (randomPath.length > 0) {

const pathRandom = join( __dirname, "cache", "leaveGif", "randomgif", randomPath[ Math.floor( Math.random() * randomPath.length ) ] ); formPush = { body: msg, attachment: createReadStream(pathRandom) }; 

} else {

formPush = { body: msg }; 

}

return api.sendMessage( formPush, threadID ); };

