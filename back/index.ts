import TwitchAPIEmit from './module/TwitchAPI';
import { MessageTags } from './module/utils/parser';

export const client = new TwitchAPIEmit();

(async () => {
	client.login();

	client.receiveMessage(
		(channel: string, tags: MessageTags, message: string) => {
			console.log(`[${channel}] ${tags['display-name']}: ${message}`);
		}
	);
})();
