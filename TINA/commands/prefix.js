const fs = require("fs");

module.exports.config = {
	name: "prefix",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "RAHUL",
	description: "no prefix",
	commandCategory: "No command marks needed",
	usages: "...",
	cooldowns: 1,
};

module.exports.handleEvent = function ({ api, event, client, __GLOBAL }) {

	const { threadID, messageID } = event;

	//  crash fix (important)
	if (!event.body) return;

	const body = event.body.toLowerCase();

	if (
		body.indexOf("prefix") === 0 ||
		body.indexOf("ano prefix") === 0
	) {
		const moment = require("moment-timezone");
		var gio = moment.tz("Asia/Dhaka").format("HH:mm:ss || D/MM/YYYY");

		var msg = {
			body:
`My prefix is » ${global.config.PREFIX} «
Use Help for list of commands.

My Owner Facebook Id Link https://www.facebook.com/khanrahulrk823
Telegram Id  @rahatkhanrahul`
		};

		api.sendMessage(msg, threadID, messageID);
	}
};

module.exports.run = function ({ api, event, client, __GLOBAL }) {};