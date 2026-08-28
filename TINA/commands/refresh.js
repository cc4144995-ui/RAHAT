const frames = ['⬜⬜⬜⬜⬜', '🟦⬜⬜⬜⬜', '🟦🟦⬜⬜⬜', '🟦🟦🟦⬜⬜', '🟦🟦🟦🟦⬜', '🟦🟦🟦🟦🟦'];
const spin = ['◐', '◓', '◑', '◒'];

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function pct(done, total) {
  return Math.round((done / Math.max(total, 1)) * 100);
}

function barStr(done, total, size = 12) {
  const f = Math.round((done / Math.max(total, 1)) * size);
  return '█'.repeat(f) + '░'.repeat(size - f);
}

// Facebook theke shob group fetch korbe
async function fetchAllGroupThreads(api) {
  const groups = [];
  let timestamp = null;
  const BATCH = 100;

  while (true) {
    let batch;

    try {
      batch = await new Promise((resolve, reject) => {
        api.getThreadList(BATCH, timestamp, ['INBOX'], (err, data) => {
          if (err) return reject(err);
          resolve(data);
        });
      });
    }
    catch {
      break;
    }

    if (!batch || !batch.length)
      break;

    const filtered = batch.filter(t => t.isGroup);

    groups.push(...filtered);

    if (batch.length < BATCH)
      break;

    timestamp = parseInt(batch[batch.length - 1].timestamp);
  }

  return groups;
}

module.exports = {
  config: {
    name: "refresh",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Khan Rahul RK",
    description: "Facebook theke shob group refresh kore",
    commandCategory: "admin",
    usages: "",
    cooldowns: 5
  },

  run: async function ({ api, event, Threads }) {

    const { threadID, messageID } = event;

    // ── Start ──
    api.sendMessage(
      `╭─────────────────────────╮
│  ♻️  INBOX REFRESH       │
│  ${spin[0]} Facebook theke ana hocche...
╰─────────────────────────╯`,
      threadID,
      async (err, info) => {

        const mid = info.messageID;

        const edit = async (txt) => {
          try {
            api.editMessage(txt, mid);
          }
          catch {}
        };

        // Animation
        let sf = 0;

        const anim = setInterval(async () => {
          await edit(
            `╭─────────────────────────╮
│  ♻️  INBOX REFRESH       │
│  ${spin[sf % 4]} Facebook theke ana hocche...
│  ${frames[Math.min(sf, 5)]}
╰─────────────────────────╯`
          );

          sf++;
        }, 500);

        // ── Fetch Groups ──
        let fbGroups = [];

        try {
          fbGroups = await fetchAllGroupThreads(api);
        }
        catch {}

        clearInterval(anim);

        const total = fbGroups.length;

        await edit(
          `╭─────────────────────────╮
│  ♻️  INBOX REFRESH       │
│  ✅ ${total} ta group paoya geche!
│  💾 Database update hocche...
│  [░░░░░░░░░░░░] 0%
╰─────────────────────────╯`
        );

        // ── Save + Ping ──
        let saved = 0,
            alreadyIn = 0,
            pinged = 0,
            pingFailed = 0;

        const pingedThreadIDs = new Set();

        for (let i = 0; i < fbGroups.length; i++) {

          const g = fbGroups[i];

          // Save database
          const existing = await Threads.getData(g.threadID);

          if (!existing || !existing.data) {

            try {

              await Threads.setData(g.threadID, {
                threadInfo: g,
                data: {}
              });

              saved++;

            }
            catch {}

          }
          else {

            alreadyIn++;

          }

          // Send ♻️
          try {

            await new Promise((resolve, reject) => {
              api.sendMessage("♻️", g.threadID, (err) => {
                if (err) return reject(err);
                resolve();
              });
            });

            pinged++;

            pingedThreadIDs.add(g.threadID);

          }
          catch {

            pingFailed++;

          }

          // Progress
          if (i % 5 === 0 || i === fbGroups.length - 1) {

            const p = pct(i + 1, total);

            await edit(
              `╭─────────────────────────╮
│  ♻️  REFRESH HOCCHE...   │
│  📡 Ping: ${i + 1}/${total}
│  [${barStr(i + 1, total)}] ${p}%
│  💾 New: ${saved}  ✅ Pinged: ${pinged}
╰─────────────────────────╯`
            );
          }

          await sleep(250);
        }

        // ── Nickname Set ──
        const botName = "♤R𝙎亗BOT H𝖢𝖪𝖤𝖱 𝖪𝖨𝖭𝖦💔";

        const botUID = api.getCurrentUserID();

        let nickSet = 0,
            nickSkip = 0;

        await edit(
          `╭─────────────────────────╮
│  🏷️ NICKNAME CHECK      │
│  Nickname set hocche...
│  ${frames[2]}
╰─────────────────────────╯`
        );

        for (const g of fbGroups) {

          if (!pingedThreadIDs.has(g.threadID)) {
            nickSkip++;
            continue;
          }

          try {

            const infoThread = await new Promise((resolve, reject) => {
              api.getThreadInfo(g.threadID, (err, data) => {
                if (err) return reject(err);
                resolve(data);
              });
            });

            const nicknames =
              infoThread.nicknames ||
              {};

            let current = "";

            if (typeof nicknames === "object") {
              current = nicknames[botUID] || "";
            }

            if (!current || current.trim() === "") {

              await new Promise((resolve, reject) => {
                api.changeNickname(
                  botName,
                  g.threadID,
                  botUID,
                  (err) => {
                    if (err) return reject(err);
                    resolve();
                  }
                );
              });

              nickSet++;

            }
            else {

              nickSkip++;

            }

          }
          catch {

            nickSkip++;

          }

          await sleep(300);
        }

        // ── Final Result ──
        const lines = [
          `╭───── ♻️ REFRESH DONE ─────╮`,
          `│`,
          `│  📦 Total Group : ${total}`,
          `│  🆕 New Save    : ${saved}`,
          `│  ✅ Pinged      : ${pinged}`,
          `│  ❌ Ping Failed : ${pingFailed}`,
          `│  🏷️ Nick Set    : ${nickSet}`,
          `│  ✔️ Nick OK     : ${nickSkip}`,
          `│`,
          `│  💾 Database update complete`,
          `│  🏷️ Nickname: ${botName}`,
          `│  ♻️ Inbox fully refreshed`,
          `╰────────────────────────────╯`
        ];

        return api.sendMessage(
          lines.join("\n"),
          threadID,
          messageID
        );
      },
      messageID
    );
  }
};