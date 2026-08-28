module.exports.config = {

  name: "club1",

  version: "1.0.0",

  hasPermssion: 0,

  credits: "Khan Rahul RK Owner",

  description: "Auto reply for Matir Manus",

  commandCategory: "No Prefix",

  usages: "No Prefix",

  cooldowns: 5

};


module.exports.handleEvent = async function ({ api, event }) {


  if (!event.body) return;


  const msg = event.body.toLowerCase().trim();


  if (

    msg === "matir manus" ||

    msg === "মাটির মানুষ"

  ) {


    // First Message

    api.sendMessage(

`🌸 𝙈𝘼𝙏𝙄𝙍 𝙈𝘼𝙉𝙐𝙎 🌸


⚡ Club Code: 4863914`,

      event.threadID

    );


    // Second Message

    setTimeout(() => {


      api.sendMessage(

`━━━━━━━━━━━━━━


👑 Owner 🥰

😍Fayek Khan😘


━━━━━━━━━━━━━━


💎 Super Admin 🥰

😍Jannatul Rima😘


━━━━━━━━━━━━━━


🛡️ Admin List 🥰


🥰Alvera Houqe

🥰Ali Ahmed

🥰AJ Captain Smb

🥰Md Mahabub Gazi

🥰Morshed Allam

🥰Younus Mahmud Joy

🥰Asikur Rahman

🥰Nirob Hossain Niloy

🥰Farzana Doly

🥰Siam Ahmed Khan


━━━━━━━━━━━━━━

❤️ Welcome To Matir Manus ❤️`,

        event.threadID

      );


    }, 1000);

  }

};


module.exports.run = async function () {};