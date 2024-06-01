import TwitchAPI from './module/TwitchAPI';

const client = new TwitchAPI();

(async () => {
	client.login();

	client.onMessage(
		(channel: string, tags: any, message: string, connection: any) => {
			console.log('fff');
		}
	);
})();

// const WebSocketClient = require('websocket').client;

// const client = new WebSocketClient();
// const parser = require('./module/IRCParser');
// const { parseMessages } = require('./module/parser');

// client.on('connect', (ws: any) => {
// 	console.log('WebSocket Client Connected');

// 	ws.sendUTF('CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands');
// 	ws.sendUTF('PASS oauth:04phnd1f3le44q88i37knxv3784rb7');
// 	ws.sendUTF('NICK personastudio');
// 	ws.sendUTF('JOIN #personastudio');

// 	ws.on('message', (message: any) => {
// 		parseMessage(message);
// 	});
// });

// client.connect('ws://irc-ws.chat.twitch.tv:80');

// function parseMessage(messages: any) {
// 	if (messages.type !== 'utf8') return;
// 	let rawIrcMessage = messages.utf8Data.trimEnd();
// 	const parse = parseMessages(rawIrcMessage);
// 	if (parse === null) return;
// 	const message = parse.parameters;
// 	const channel = parse.command.channel;
// 	const tags = parse.tags;

// 	console.log(`[${channel}] ${tags['display-name']}: ${message}`);
// }
