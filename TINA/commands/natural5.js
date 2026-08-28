/** THIS FULL BOT COMMAND FILE AND ALL API CREATE BY 𝐊𝐡𝐚𝐧 𝐑𝐚𝐡𝐮𝐥 𝐑𝐊 DONT CHINGE THE MY ANY CODE 🤙🖤📿  **/
module.exports.config = {
    name: "naturalv5",
    version: "1.0.0",
    hasPermission: 0,
    credits: "RAHAT",
    description: "Natural🥰",
    usePrefix: true,
    commandCategory: "Khan Rahul RK",
    usages: "Natural Video 5",
    cooldowns: 5,
    dependencies: {
    "request":"",
    "fs-extra":"",
    "axios":""
  }
};

module.exports.run = async({api,event,args,client,Users,Threads,__GLOBAL,Currencies}) => {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
   var hi = ["....!✨🌺🍂\n\n\nফুল সুন্দর বলেই ফুলের সাথে কাটানো সময়গুলো Special হয়ে থাকে!🌸🤍\n\n\n....!✨🌺🍂"];
  var know = hi[Math.floor(Math.random() * hi.length)];
  var link = [
    "https://i.imgur.com/THNxq4W.mp4",
    "https://i.imgur.com/68C43RD.mp4",
    "https://i.imgur.com/eM9oxrU.mp4",
    "https://i.imgur.com/fyzuKIb.mp4",
    "https://i.imgur.com/miliKnM.mp4",
    "https://i.imgur.com/eKdcfcV.mp4",
    "https://i.imgur.com/rrhSt3d.mp4",
    "https://i.imgur.com/BAADKLG.mp4",
    "https://i.imgur.com/YNXeRgF.mp4",

];
     var callback = () => api.sendMessage({body:` ${know} `,attachment: fs.createReadStream(__dirname + "/cache/15.mp4")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/15.mp4"));    
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/15.mp4")).on("close",() => callback());
   };
