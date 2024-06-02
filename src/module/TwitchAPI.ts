const tmi = require('tmi.js');

export default class TwitchAPI {
	public client = new tmi.Client({
		options: { debug: true },
		identity: {
			username: 'personastudio',
			password: 'oauth:04phnd1f3le44q88i37knxv3784rb7',
		},
		channels: ['personastudio', 'lemaraudeurtv'],
	});

	constructor() {
		this.client.connect();
	}
}
