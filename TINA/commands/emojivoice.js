module.exports.config = {
name: "emoji_voice",
version: "10.0",
hasPermssion: 0,
credits: "𝐑𝐀𝐇𝐀𝐓 𝐊𝐇𝐀𝐍",
description: "Emoji দিলে কিউট মেয়ের ভয়েস পাঠাবে 😍",
commandCategory: "noprefix",
usages: "😘🥰😍",
cooldowns: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

const emojiAudioMap = {
"🥱": ["https://files.catbox.moe/9pou40.mp3"],
      "😁": ["https://files.catbox.moe/60cwcg.mp3"],
      "😌": ["https://files.catbox.moe/epqwbx.mp3"],
      "🥺": ["https://files.catbox.moe/wc17iq.mp3"],
      "🤭": ["https://files.catbox.moe/cu0mpy.mp3"],
      "😅": ["https://files.catbox.moe/jl3pzb.mp3"],
      "😏": ["https://files.catbox.moe/z9e52r.mp3"],
      "😞": ["https://files.catbox.moe/tdimtx.mp3"],
      "🤫": ["https://files.catbox.moe/0uii99.mp3"],
      "🍼": ["https://files.catbox.moe/p6ht91.mp3"],
      "🤔": ["https://files.catbox.moe/hy6m6w.mp3"],
      "🥰": ["https://files.catbox.moe/q7jtny.mp3"],
      "🤦": ["https://files.catbox.moe/ivlvoq.mp3"],
      "😘": ["https://files.catbox.moe/sbws0w.mp3"],
      "😙": ["https://files.catbox.moe/37dqpx.mp3"],
      "😑": ["https://files.catbox.moe/p78xfw.mp3"],
      "😢": ["https://files.catbox.moe/shxwj1.mp3"],
      "🙊": ["https://files.catbox.moe/3bejxv.mp3"],
      "🤨": ["https://files.catbox.moe/4aci0r.mp3"],
      "😡": ["https://files.catbox.moe/723xws.mp3"],
      "😠": ["https://files.catbox.moe/h9ekli.mp3"],
      "🤬": ["https://files.catbox.moe/723xws.mp3"],
      "😾": ["https://files.catbox.moe/h9ekli.mp3"],
      "😤": ["https://files.catbox.moe/h9ekli.mp3"],
      "🙈": ["https://files.catbox.moe/3qc90y.mp3"],
      "😍": ["https://files.catbox.moe/qjfk1b.mp3"],
      "😭": ["https://files.catbox.moe/itm4g0.mp3"],
      "😱": ["https://files.catbox.moe/mu0kka.mp3"],
      "😻": ["https://files.catbox.moe/y8ul2j.mp3"],
      "😿": ["https://files.catbox.moe/tqxemm.mp3"],
      "💔": ["https://files.catbox.moe/6yanv3.mp3"],
      "🤣": ["https://files.catbox.moe/2sweut.mp3"],
      "😔": ["https://files.catbox.moe/jl3pzb.mp3"],
      "🥹": ["https://files.catbox.moe/jf85xe.mp3"],
      "😩": ["https://files.catbox.moe/b4m5aj.mp3"],
      "🫣": ["https://files.catbox.moe/ttb6hi.mp3"],
      "🐸": ["https://files.catbox.moe/sg6ugl.mp3"],
      "🐍": ["https://files.catbox.moe/utl83s.mp3"],
      "💋": ["https://files.catbox.moe/37dqpx.mp3"],
      "🫦": ["https://files.catbox.moe/61w3i0.mp3"],
      "😴": ["https://files.catbox.moe/rm5ozj.mp3"],
      "🙏": ["https://files.catbox.moe/7avi7u.mp3"],
      "😼": ["https://files.catbox.moe/4oz916.mp3"],
      "🖕": ["https://files.catbox.moe/dtua60.mp3"],
      "🥵": ["https://files.catbox.moe/l90704.mp3"],
      "🙂": ["https://files.catbox.moe/4oks08.mp3"],
      "😒": ["https://files.catbox.moe/mt5il0.mp3"],
      "😓": ["https://files.catbox.moe/zh3mdg.mp3"],
      "🤧": ["https://files.catbox.moe/zh3mdg.mp3"],
      "🙄": ["https://files.catbox.moe/vgzkeu.mp3"],
      "😂": ["https://files.catbox.moe/0nxy8i.mp4"], // mp4 handled dynamically
      "😚": ["https://files.catbox.moe/qrv31r.mp3"],
      "🤲": ["https://files.catbox.moe/l8qym7.mp3"],
      "🫶": ["https://files.catbox.moe/egturw.mp3"],
      "👍": ["https://files.catbox.moe/f2qevj.mp3"]
    };

module.exports.handleEvent = async ({ api, event }) => {
const { threadID, messageID, body } = event;
if (!body || body.length > 2) return;

const emoji = body.trim();
const audioUrl = emojiAudioMap[emoji];
if (!audioUrl) return;

const cacheDir = path.join(__dirname, 'cache');
if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

const filePath = path.join(cacheDir, `${encodeURIComponent(emoji)}.mp3`);

try {
const response = await axios({
method: 'GET',
url: audioUrl,
responseType: 'stream'
});

const writer = fs.createWriteStream(filePath);
response.data.pipe(writer);

writer.on('finish', () => {
api.sendMessage({
attachment: fs.createReadStream(filePath)
}, threadID, () => {
fs.unlink(filePath, (err) => {
if (err) console.error("Error deleting file:", err);
});
}, messageID);
});

writer.on('error', (err) => {
console.error("Error writing file:", err);
api.sendMessage("ইমুজি দিয়ে লাভ নাই\nযাও মুড়ি খাও জান😘", threadID, messageID);
});

} catch (error) {
console.error("Error downloading audio:", error);
api.sendMessage("ইমুজি দিয়ে লাভ নাই\nযাও মুড়ি খাও জান😘", threadID, messageID);
}
};

module.exports.run = () => {};