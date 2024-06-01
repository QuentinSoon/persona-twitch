import TwitchAPI from './module/TwitchAPI';

export const client = new TwitchAPI();

(async () => {
	client.login();
})();
