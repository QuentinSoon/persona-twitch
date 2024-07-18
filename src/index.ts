import path from 'path';
import TwitchAPI from './module/TwitchAPI';
const cookiesPath = path.resolve(__dirname, 'cookies.json');

export const twitchApi = new TwitchAPI();

(async () => {
	twitchApi.client.on(
		'message',
		async (channel: any, tags: any, message: any, self: any) => {
			if (self) return;

			if (message === '!hello') {
				const announcements = await twitchApi.SendChatAnnouncement({
					broadcaster_id: '1103788558',
					moderator_id: '1045274424',
				});
			}

			if (message === '!a') {
				const announcements = await twitchApi.GetUsers({
					name: 'quentinlabs',
				});
				console.log(announcements);
			}

			if (message === '!c') {
				const channelInformation = await twitchApi.GetChannelInformation({
					broadcaster_id: '1103788558',
				});
				console.log(channelInformation);
			}

			// if (message === '!game') {
			// 	const channelInformation = await twitchApi.GetChannelInformation({
			// 		broadcaster_id: '1045274424',
			// 	});
			// 	console.log(channelInformation);
			// 	// client.client.say(channel, `@${tags.username}, heya!`);
			// }
			// if (message === '!clip') {
			// 	const clip = await twitchApi.CreateClip({
			// 		broadcaster_id: '1045274424',
			// 	});

			// 	console.log(clip);

			// 	const browser = await puppeteer.launch({
			// 		headless: false,
			// 		executablePath:
			// 			'/System/Volumes/Preboot/Cryptexes/App/System/Applications/Safari.app/Contents/MacOS/Safari',
			// 	});
			// 	const page = await browser.newPage();

			// 	await page.goto(clip.edit_url);

			// 	await page.type('#cmgr-title-input', 'Test Clip mdr');

			// 	await page.click(
			// 		'.ScCoreButton-sc-ocjdkq-0 ScCoreButtonPrimary-sc-ocjdkq-1 itFOsv gmCwLG'
			// 	);

			// 	// await page.waitForNavigation();

			// 	// await browser.close();
			// }
		}
	);
})();

const Test = () => {
	setTimeout(async () => {
		const announcements = await twitchApi.SendChatAnnouncement({
			broadcaster_id: '1103788558',
			moderator_id: '1045274424',
		});
		Test();
	}, 10000);
};
Test();
