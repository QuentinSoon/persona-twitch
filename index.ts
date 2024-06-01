import TwitchAPIEmit from './module/TwitchAPI';

export const client = new TwitchAPIEmit();

(async () => {
	client.login();

	client.handleMessage((connection: any) => {
		console.log('message');
	});
})();

// client.login();

// client.handleMessage((connection: any) => {
// 	console.log('message');
// });
