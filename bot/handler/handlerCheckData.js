/**
 * ==============================================
 * ⚡ M41NUL-Bot - Mirai Messenger Bot
 * ==============================================
 * 
 * Developer : MAINUL - X
 * GitHub    : M41NUL
 * WhatsApp  : +8801308850528
 * Telegram  : @mdmainulislaminfo
 * Email     : githubmainul@gmail.com
 * 
 * ==============================================
 * Original Framework: CYBER BOT COMMUNITY
 * Modified & Maintained by MAINUL - X
 * ==============================================
 * 
 * Copyright (c) 2026 MAINUL - X
 * All Rights Reserved
 * 
 * This code is part of M41NUL-Bot project.
 * Unauthorized reproduction or distribution is prohibited.
 * 
 * ==============================================
 */

const { db, utils, GoatBot } = global;
const { config } = GoatBot;
const { log, getText } = utils;
const { creatingThreadData, creatingUserData } = global.client.database;

module.exports = async function (usersData, threadsData, event) {
	const { threadID } = event;
	const senderID = event.senderID || event.author || event.userID;

	// ———————————— CHECK THREAD DATA ———————————— //
	if (threadID) {
		try {
			if (global.temp.createThreadDataError.includes(threadID))
				return;

			const findInCreatingThreadData = creatingThreadData.find(t => t.threadID == threadID);
			if (!findInCreatingThreadData) {
				if (global.db.allThreadData.some(t => t.threadID == threadID))
					return;

				const threadData = await threadsData.create(threadID);
				log.info("DATABASE", `New Thread: ${threadID} | ${threadData.threadName} | ${config.database.type}`);
			}
			else {
				await findInCreatingThreadData.promise;
			}
		}
		catch (err) {
			if (err.name != "DATA_ALREADY_EXISTS") {
				global.temp.createThreadDataError.push(threadID);
				log.err("DATABASE", getText("handlerCheckData", "cantCreateThread", threadID), err);
			}
		}
	}


	// ————————————— CHECK USER DATA ————————————— //
	if (senderID) {
		// Skip userID 0 (unreact events from Facebook API)
		if (senderID === 0 || senderID === '0') {
			return;
		}
		
		try {
			const findInCreatingUserData = creatingUserData.find(u => u.userID == senderID);
			if (!findInCreatingUserData) {
				if (db.allUserData.some(u => u.userID == senderID))
					return;

				const userData = await usersData.create(senderID);
				log.info("DATABASE", `New User: ${senderID} | ${userData.name} | ${config.database.type}`);
			}
			else {
				await findInCreatingUserData.promise;
			}
		}
		catch (err) {
			if (err.name != "DATA_ALREADY_EXISTS")
				log.err("DATABASE", getText("handlerCheckData", "cantCreateUser", senderID), err);
		}
	}
};
