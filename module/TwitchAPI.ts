const WebSocketClient = require('websocket').client;

export default class TwitchAPI {
	private twitchClient = new WebSocketClient();
	public connection: any;

	constructor() {
		this.twitchClient.on('connect', (connection: any) => {
			console.log('WebSocket Client Connected');
			connection.sendUTF(
				'CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands'
			);
			connection.sendUTF('PASS oauth:04phnd1f3le44q88i37knxv3784rb7');
			connection.sendUTF('NICK personastudio');
			connection.sendUTF('JOIN #PersonaStudio');
			this.connection = connection;
		});
	}

	login() {
		this.twitchClient.connect('wss://irc-ws.chat.twitch.tv:443');
	}

	onMessage(callback: any) {
		this.connection.on('message', (ircMessage: any) => {
			callback('test', 'test', 'test', 'test');
		});
		// this.twitchClient.on('connect', (connection: any) => {
		// 	console.log('WebSocket Client Connected');
		// 	connection.sendUTF(
		// 		'CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands'
		// 	);
		// 	connection.sendUTF('PASS oauth:cnqrgxxm4uffqrybm1niqmqpaog20j');
		// 	connection.sendUTF('NICK personastudio');
		// 	connection.sendUTF('JOIN #LeMaraudeurTV,#MooyaDEV');
		// 	connection.on('message', function (ircMessage: any) {
		// 		if (ircMessage.type !== 'utf8') return;
		// 		let rawIrcMessage = ircMessage.utf8Data.trimEnd();
		// 		console.log(
		// 			`Message received (${new Date().toISOString()}): '${rawIrcMessage}'\n`
		// 		);
		// 		const parse = parseMessages(rawIrcMessage);
		// 		if (parse === null) return;
		// 		if (parse.command === null) return;
		// 		if (parse.command.command !== 'PRIVMSG') return;
		// 		console.log('Received: ' + ircMessage.utf8Data);
		// 		callback(
		// 			parse.command.channel,
		// 			parse.tags,
		// 			parse.parameters,
		// 			connection
		// 		);
		// 	});
		// });
	}
}
