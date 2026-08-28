module.exports.config = {
  name: "admin",
  version: "1.3.1",
  hasPermssion: 1,
  credits: "RAHAT",
  description: "Manage bot owner, admin & supporter",
  commandCategory: "admin",
  usages: "[list/add/remove] [owner/admin/supporter] [mention/userID]",
  cooldowns: 5,
  dependencies: {
    "fs-extra": ""
  }
};

module.exports.languages = {
  "bn": {
    "listOwner": "👑 OWNERS LIST:\n\n%1",
    "listAdmin": "🛡️ ADMIN LIST:\n\n%1",
    "listSupporter": "🤝 SUPPORTER LIST:\n\n%1",
    "notHavePermssion": "[Admin] তোমার এই কমান্ড ব্যবহারের অনুমতি নেই!",
    "addedOwner": "[Admin] %1 জন Owner যোগ করা হয়েছে:\n\n%2",
    "removedOwner": "[Admin] %1 জন Owner রিমুভ করা হয়েছে:\n\n%2",
    "addedAdmin": "[Admin] %1 জন Admin যোগ করা হয়েছে:\n\n%2",
    "removedAdmin": "[Admin] %1 জন Admin রিমুভ করা হয়েছে:\n\n%2",
    "addedSupporter": "[Admin] %1 জন Supporter যোগ করা হয়েছে:\n\n%2",
    "removedSupporter": "[Admin] %1 জন Supporter রিমুভ করা হয়েছে:\n\n%2"
  },
  "en": {
    "listOwner": "👑 OWNERS LIST:\n\n%1",
    "listAdmin": "🛡️ ADMIN LIST:\n\n%1",
    "listSupporter": "🤝 SUPPORTER LIST:\n\n%1",
    "notHavePermssion": "[Admin] You don't have permission!",
    "addedOwner": "[Admin] Added %1 Owner:\n\n%2",
    "removedOwner": "[Admin] Removed %1 Owner:\n\n%2",
    "addedAdmin": "[Admin] Added %1 Admin:\n\n%2",
    "removedAdmin": "[Admin] Removed %1 Admin:\n\n%2",
    "addedSupporter": "[Admin] Added %1 Supporter:\n\n%2",
    "removedSupporter": "[Admin] Removed %1 Supporter:\n\n%2"
  }
};

module.exports.run = async function ({
  api, event, args, Users, getText
}) {
  const { threadID, messageID, mentions, senderID } = event;
  const { configPath } = global.client;
  const { writeFileSync } = global.nodemodule["fs-extra"];

  delete require.cache[require.resolve(configPath)];
  let config = require(configPath);

  // ===== OWNER FIX (NO CUT) =====
  if (!config.OWNER && config.OWNER_ID) {
    config.OWNER = Array.isArray(config.OWNER_ID)
      ? config.OWNER_ID
      : [config.OWNER_ID];
  }
  if (!config.OWNER) config.OWNER = [];
  if (!config.ADMINBOT) config.ADMINBOT = [];
  if (!config.SUPPORTER) config.SUPPORTER = [];

  // ===== PERMISSION =====
  const isOwner = config.OWNER.includes(senderID);
  const isAdmin = config.ADMINBOT.includes(senderID);
  const isSupporter = config.SUPPORTER.includes(senderID);

  let myPerm = 0;
  if (isOwner) myPerm = 3;
  else if (isAdmin) myPerm = 2;
  else if (isSupporter) myPerm = 1;

  const mentionIDs = Object.keys(mentions);
  const target = args[1];
  const contentIDs = args.slice(2);

  // ===== LIST =====
  if (args[0] === "list" || args[0] === "all") {
    const makeList = async (arr) => {
      if (!arr.length) return "Empty";
      let out = [];
      for (const id of arr) {
        const name = await Users.getNameUser(id);
        out.push(`➤ ${name} [ ${id} ]`);
      }
      return out.join("\n");
    };

    return api.sendMessage(
      getText("listOwner", await makeList(config.OWNER)) +
      "\n\n" +
      getText("listAdmin", await makeList(config.ADMINBOT)) +
      "\n\n" +
      getText("listSupporter", await makeList(config.SUPPORTER)),
      threadID,
      messageID
    );
  }

  // ===== ADD =====
  if (args[0] === "add") {
    const ids = mentionIDs.length ? mentionIDs : contentIDs;
    if (!ids.length)
      return api.sendMessage("⚠️ Mention বা ID দিন!", threadID, messageID);

    let result = [];

    // OWNER
    if (target === "owner") {
      if (myPerm < 3)
        return api.sendMessage(getText("notHavePermssion"), threadID, messageID);

      for (const id of ids) {
        if (!config.OWNER.includes(id)) config.OWNER.push(id);
        result.push(`[ ${id} ] » ${await Users.getNameUser(id)}`);
      }
      writeFileSync(configPath, JSON.stringify(config, null, 4));
      return api.sendMessage(getText("addedOwner", result.length, result.join("\n")), threadID, messageID);
    }

    // ADMIN
    if (target === "admin") {
      if (myPerm < 3)
        return api.sendMessage(getText("notHavePermssion"), threadID, messageID);

      for (const id of ids) {
        if (!config.ADMINBOT.includes(id)) config.ADMINBOT.push(id);
        result.push(`[ ${id} ] » ${await Users.getNameUser(id)}`);
      }
      writeFileSync(configPath, JSON.stringify(config, null, 4));
      return api.sendMessage(getText("addedAdmin", result.length, result.join("\n")), threadID, messageID);
    }

    // SUPPORTER
    if (target === "supporter") {
      if (myPerm < 2)
        return api.sendMessage(getText("notHavePermssion"), threadID, messageID);

      for (const id of ids) {
        if (!config.SUPPORTER.includes(id)) config.SUPPORTER.push(id);
        result.push(`[ ${id} ] » ${await Users.getNameUser(id)}`);
      }
      writeFileSync(configPath, JSON.stringify(config, null, 4));
      return api.sendMessage(getText("addedSupporter", result.length, result.join("\n")), threadID, messageID);
    }
  }

  // ===== REMOVE (AUTO FIX) =====
  if (args[0] === "remove" || args[0] === "rm") {
    if (myPerm < 2)
      return api.sendMessage(getText("notHavePermssion"), threadID, messageID);

    const ids = mentionIDs.length ? mentionIDs : contentIDs;
    if (!ids.length)
      return api.sendMessage("⚠️ Mention বা ID দিন!", threadID, messageID);

    let removed = [];

    for (const id of ids) {
      const name = await Users.getNameUser(id);

      if (config.OWNER.includes(id)) {
        if (myPerm < 3)
          return api.sendMessage(getText("notHavePermssion"), threadID, messageID);
        config.OWNER = config.OWNER.filter(i => i != id);
        removed.push(`👑 Owner Removed ➜ ${name} [ ${id} ]`);
        continue;
      }

      if (config.ADMINBOT.includes(id)) {
        if (myPerm < 3)
          return api.sendMessage(getText("notHavePermssion"), threadID, messageID);
        config.ADMINBOT = config.ADMINBOT.filter(i => i != id);
        removed.push(`🛡️ Admin Removed ➜ ${name} [ ${id} ]`);
        continue;
      }

      if (config.SUPPORTER.includes(id)) {
        config.SUPPORTER = config.SUPPORTER.filter(i => i != id);
        removed.push(`🤝 Supporter Removed ➜ ${name} [ ${id} ]`);
        continue;
      }
    }

    writeFileSync(configPath, JSON.stringify(config, null, 4));

    if (!removed.length)
      return api.sendMessage("❌ User কোন লিস্টেই নেই!", threadID, messageID);

    return api.sendMessage("✅ REMOVE SUCCESS:\n\n" + removed.join("\n"), threadID, messageID);
  }

  return api.sendMessage("❓ Wrong usage! Try: .admin list", threadID, messageID);
};