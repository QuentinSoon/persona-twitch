import TwitchAPI from './module/TwitchAPI';

export const client = new TwitchAPI();

// (async () => {
client.client.on(
	'message',
	(channel: any, tags: any, message: any, self: any) => {
		if (self) return;
		if (message === '!hello') {
			client.client.say(channel, `@${tags.username}, heya!`);
		}
	}
);
// })();
