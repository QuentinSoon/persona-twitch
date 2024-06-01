const WebSocketClient = require('websocket').client;

export default class TwitchAPI {
	private twitchClient = new WebSocketClient();
	private _connection: any;

	constructor() {}

	login() {
		return new Promise((resolve, reject) => {
			this.twitchClient.on('connect', (connection: any) => {
				console.log('WebSocket Client Connected');
				connection.sendUTF(
					'CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands'
				);
				connection.sendUTF('PASS oauth:04phnd1f3le44q88i37knxv3784rb7');
				connection.sendUTF('NICK personastudio');
				connection.sendUTF('JOIN #PersonaStudio');
				this._connection = connection;
			});

			this.twitchClient.connect('wss://irc-ws.chat.twitch.tv:443');

			this._openConnection();
		});
	}

	_openConnection() {
		this._connection = this._onMessage.bind(this);
		console.log('open connection');
	}

	_onMessage(event: any) {
		console.log('parts');
		// this.handleMessage();
	}

	handleMessage(connection: any) {
		this._connection.on('message', function (ircMessage: any) {
			console.log('message');
		});
		console.log('mdr');
	}
}
