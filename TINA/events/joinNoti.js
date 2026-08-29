module.exports.config = {
name: "joinNoti",
eventType: ["log:subscribe"],
version: "1.0.1",
credits: "RAHAT",
description: "Notify bot or group member with random gif/photo/video",
dependencies: {
"fs-extra": "",
"path": "",
"pidusage": ""
}
};

module.exports.onLoad = function () {
const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
const { join } = global.nodemodule["path"];

const path = join(__dirname, "cache", "joinGif");

if (!existsSync(path))
mkdirSync(path, { recursive: true });

const path2 = join(__dirname, "cache", "joinGif", "randomgif");

if (!existsSync(path2))
mkdirSync(path2, { recursive: true });

return;
};

module.exports.run = async function({ api, event }) {

const { join } = global.nodemodule["path"];
const { threadID } = event;

// ==============================
// 🤖 BOT JOIN MESSAGE
// ==============================

if (
event.logMessageData.addedParticipants.some(
i => i.userFbId == api.getCurrentUserID()
)
) {

api.changeNickname(
  `{ ${global.config.PREFIX} } × ${
    global.config.BOTNAME || "Bot"
  }`,
  threadID,
  api.getCurrentUserID()
);

const fs = require("fs");

return api.sendMessage(
  `╭━━━〔 🤖 BOT ONLINE 〕━━━╮

🌸 আসসালামু আলাইকুম সবাইকে!

✨ আমি ${global.config.BOTNAME || "Bot"}
এই গ্রুপের নতুন সদস্য।

🛠️ Command ➜ ${global.config.PREFIX}help
👑 Owner ➜ ${global.config.PREFIX}Owner

💖 সবাই ভালো থাকবেন।
🤝 আমাকে আপনাদের পরিবারের একজন মনে করবেন।

╰━━━〔 𝐊𝐇𝐀𝐍 𝐑𝐀𝐇𝐔𝐋 𝐑𝐊 〕━━━╯`,
threadID,
() => {

    api.sendMessage(
      {
        body: `🌺 ${global.config.BOTNAME || "Bot"} Successfully Joined!

🤖 এখন আমি আপনাদের সাথে আছি।
⚡ ${global.config.PREFIX}help — সব Command
👑 ${global.config.PREFIX}Owner — Owner Info

💕 Thanks for adding me!`,
attachment: fs.createReadStream(
__dirname + "/cache/avt.png"
)
},
threadID
);

  }
);

}

// ==============================
// 👤 NEW MEMBER JOIN MESSAGE
// ==============================

else {

try {

  const {
    createReadStream,
    existsSync,
    mkdirSync,
    readdirSync
  } = global.nodemodule["fs-extra"];

  let {
    threadName,
    participantIDs
  } = await api.getThreadInfo(threadID);

  const threadData =
    global.data.threadData.get(parseInt(threadID)) || {};

  const path =
    join(__dirname, "cache", "joinGif");

  const pathGif =
    join(path, `${threadID}.gif`);

  var mentions = [];
  var nameArray = [];
  var memLength = [];
  var i = 0;

  for (let id in event.logMessageData.addedParticipants) {

    const userName =
      event.logMessageData.addedParticipants[id].fullName;

    nameArray.push(userName);

    mentions.push({
      tag: userName,
      id
    });

    memLength.push(
      participantIDs.length - i++
    );
  }

  memLength.sort((a, b) => a - b);

  var msg =
    typeof threadData.customJoin == "undefined"
      ? `╭━━━〔 🌺 WELCOME 🌺 〕━━━╮

🌸 আসসালামু আলাইকুম 🌸

🎉 আমাদের পরিবারে নতুন একজন!

👤 নাম ➜ {name}
🔢 সদস্য নম্বর ➜ {soThanhVien}
🏠 গ্রুপ ➜ {threadName}

💖 তোমাকে জানাই আন্তরিক স্বাগতম!
🤝 সবার সাথে মিলেমিশে থাকবে।
😊 হাসি-আনন্দে গ্রুপটাকে সুন্দর রাখবে।

✨ তোমার আগমনে পরিবার আরও বড় হলো! ✨

💕 Welcome & Enjoy 💕

╰━━━〔 𝐊𝐇𝐀𝐍 𝐑𝐀𝐇𝐔𝐋 𝐑𝐊 〕━━━╯`
: threadData.customJoin;

  msg = msg
    .replace(/\{name}/g, nameArray.join(", "))
    .replace(
      /\{type}/g,
      memLength.length > 1 ? "You" : "Friend"
    )
    .replace(
      /\{soThanhVien}/g,
      memLength.join(", ")
    )
    .replace(
      /\{threadName}/g,
      threadName
    );

  if (!existsSync(path))
    mkdirSync(path, { recursive: true });

  const randomPath =
    readdirSync(
      join(
        __dirname,
        "cache",
        "joinGif",
        "randomgif"
      )
    );

  var formPush;

  if (existsSync(pathGif)) {

    formPush = {
      body: msg,
      attachment: createReadStream(pathGif),
      mentions
    };

  }

  else if (randomPath.length != 0) {

    const pathRandom =
      join(
        __dirname,
        "cache",
        "joinGif",
        "randomgif",
        randomPath[
          Math.floor(
            Math.random() * randomPath.length
          )
        ]
      );

    formPush = {
      body: msg,
      attachment: createReadStream(pathRandom),
      mentions
    };

  }

  else {

    formPush = {
      body: msg,
      mentions
    };

  }

  return api.sendMessage(
    formPush,
    threadID
  );

} catch (e) {

  return console.log(e);

}

}

};
