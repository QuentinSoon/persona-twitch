const WebSocketClient = require('websocket').client;

import { parseMessages } from './utils/parser';

export default class TwitchAPI {
	private twitchClient = new WebSocketClient();

	constructor() {}

	login() {
		this.twitchClient.on('connect', (connection: any) => {
			console.log('WebSocket Client Connected');
			connection.sendUTF(
				'CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands'
			);
			connection.sendUTF('PASS oauth:04phnd1f3le44q88i37knxv3784rb7');
			connection.sendUTF('NICK personastudio');
			connection.sendUTF('JOIN #PersonaStudio,#ValiantOfficial');
		});

		this.twitchClient.connect('wss://irc-ws.chat.twitch.tv:443');
	}

	receiveMessage(callback: Function) {
		this.twitchClient.on('connect', (connection: any) => {
			connection.on('message', function (ircMessage: any) {
				const parse = parseMessages(ircMessage.utf8Data);
				if (parse === null) return;
				if (parse.command?.command === 'PRIVMSG') {
					callback(parse.command.channel, parse.tags, parse.parameters);
				}
			});
		});
	}
}
