import axios from 'axios';
import GeminiAIAPI from './GeminiAIAPI';
import MistralAPI from './MistralAPI';

const tmi = require('tmi.js');

export default class TwitchAPI {
	private client = new tmi.Client({
		options: { debug: true },
		identity: {
			username: 'personastudio',
			password: 'oauth:04phnd1f3le44q88i37knxv3784rb7',
		},
		channels: ['personastudio', 'lemaraudeurtv'],
	});

	constructor() {
		this.client.on(
			'message',
			async (channel: any, tags: any, message: any, self: any) => {
				if (self) return;

				// Si l'utilisateur s'appel personastudio Ignore le message
				if (tags.username === 'personastudio') return;

				// if (!message.startsWith('!')) {
				// 	try {
				// 		const completion = await openai.chat.completions.create({
				// 			messages: [
				// 				{
				// 					role: 'user',
				// 					content: `En francais, tu est actuellement sur twitch. Tu est un assistant personnel en france pour les spectateur dans le chat. Ne depasse JAMAIS les 30 mots. Un viewer pose une question, tu dois repondre. Soit le plus precis possible. Voici la question: "${message}". Ne ment pas. Soit honnete. Invente surtout PAS si tu ne sais pas.`,
				// 				},
				// 			],
				// 			model: 'gpt-3.5-turbo',
				// 		});
				// 		await this.reply(
				// 			tags['user-id'],
				// 			tags['id'],
				// 			`${completion.choices[0].message.content}`
				// 		);
				// 	} catch (error) {
				// 		console.log(error);
				// 	}
				// 	return;
				// }

				if (!message.startsWith('!')) {
					const mistral = new MistralAPI();
					const result = await mistral.isOffensive(message);
					await this.reply(tags['user-id'], tags['id'], result);

					if (result) return;
				}

				if (message.toLowerCase().includes('@personastudio')) {
					// const Gemini = new GeminiAIAPI();
					// const result = await Gemini.generateContent(`"${message}"`);

					// console.log(result);

					// const messageSansBalises = result.replace(/```json|\n```/g, '');

					// const parsed = JSON.parse(messageSansBalises);

					// console.log(parsed);
					// await this.reply(
					// 	tags['user-id'],
					// 	tags['id'],
					// 	parsed.content +
					// 		' 🤖 ' +
					// 		'Message violent ? ' +
					// 		parsed.violent +
					// 		' Message offensant ? ' +
					// 		parsed.offensant
					// );

					const mistral = new MistralAPI();
					const result = await mistral.generateContent(message);
					await this.reply(tags['user-id'], tags['id'], result);
					return;
				}

				if (self || !message.startsWith('!')) return;

				const args = message.slice(1).split(' ');
				const command = args.shift().toLowerCase();

				if (command === 'hello') {
					this.client.say(channel, `@${tags.username}, heya!`);
				}
				if (command === 'deleteme') {
					try {
						await this.deleteMessage(tags.id);
					} catch (error) {
						console.log(error);
					}
					console.log(`Deleting message: ${tags.id}, channel: ${channel}`);
				}

				if (command === 'title') {
					try {
						await this.changeTitle(args.join(' '));
					} catch (error) {
						console.log(error);
					}
					console.log(
						`Changing title to: ${args.join(' ')}, channel: ${channel}`
					);
				}

				if (command === 'br') {
					try {
						const data = await this.getBroadcastID();
						console.log(data);
					} catch (error) {
						console.log(error);
					}
					console.log(
						`Changing title to: ${args.join(' ')}, channel: ${channel}`
					);
				}
				if (command === 'reply') {
					try {
						await this.reply(tags['user-id'], tags['id'], '"Hello"');
					} catch (error) {
						console.log(error);
					}
					console.log(
						`Changing title to: ${args.join(' ')}, channel: ${channel}`
					);
				}
				if (command === 'game') {
					try {
						const data = await this.getGame();

						// const completion = await openai.chat.completions.create({
						// 	messages: [
						// 		{
						// 			role: 'user',
						// 			content: `En francais, tu est actuellement sur twitch. Explique, si c'est un jeu les regles du jeu, sinon explique la categorie. Voici le nom "${data.game_name}". Soit le plus precis possible mais pas trop long. ne depasse pas les 30 mots.`,
						// 		},
						// 	],
						// 	model: 'gpt-3.5-turbo',
						// });

						const Gemini = new GeminiAIAPI();
						const result = await Gemini.generateContent(
							`Explique, si c'est un jeu les regles du jeu, sinon explique la categorie. Voici le nom "${data.game_name}".`
						);
						await this.reply(tags['user-id'], tags['id'], result);

						// await this.reply(
						// 	tags['user-id'],
						// 	tags['id'],
						// 	`${completion.choices[0].message.content}`
						// );
					} catch (error) {
						console.log(error);
					}
					console.log(
						`Changing title to: ${args.join(' ')}, channel: ${channel}`
					);
				}
				if (command === 'lt') {
					try {
						const completion = await openai.chat.completions.create({
							messages: [
								{
									role: 'user',
									content: `Reponds juste par true ou false! Est-ce-que le message est violent, insultant, raciste, sexiste ou homophobe? "${args}". Prends de pincetes. Ne soit pas trop severe. Soit juste.`,
								},
							],
							model: 'gpt-3.5-turbo',
						});

						if (completion.choices[0].message.content === 'True') {
							await this.reply(
								tags['user-id'],
								tags['id'],
								`@${tags['username']}. Votre message a ete supprime car il est inaproprie.`
							);
							await this.deleteMessage(tags.id);
						}
					} catch (error) {
						console.log(error);
					}
				}
			}
		);
	}

	login() {
		this.client.connect();
	}

	async deleteMessage(description: string) {
		const broadcaster_id = await this.getBroadcastID();

		const res = await axios.delete(
			`https://api.twitch.tv/helix/moderation/chat?broadcaster_id=${broadcaster_id.data[0].id}&moderator_id=1045274424&message_id=${description}`,
			{
				headers: {
					Authorization: `Bearer vtpdxj4vnil9h1izlr4m9u4x8md85n`,
					'Client-ID': `gp762nuuoqcoxypju8c569th9wz7q5`,
				},
			}
		);
		return await res.data;
	}

	async getBroadcastID() {
		const res = await axios.get(`https://api.twitch.tv/helix/users`, {
			headers: {
				Authorization: `Bearer vtpdxj4vnil9h1izlr4m9u4x8md85n`,
				'Client-ID': `gp762nuuoqcoxypju8c569th9wz7q5`,
			},
		});
		return await res.data;
	}

	async changeTitle(title: string) {
		const broadcaster_id = await this.getBroadcastID();
		const res = await axios.patch(
			`https://api.twitch.tv/helix/channels?broadcaster_id=${broadcaster_id.data[0].id}`,
			{
				title: title,
			},
			{
				headers: {
					Authorization: `Bearer vtpdxj4vnil9h1izlr4m9u4x8md85n`,
					'Client-ID': `gp762nuuoqcoxypju8c569th9wz7q5`,
				},
			}
		);

		return await res.data;
	}

	async reply(sender: string, parent: string, message: string) {
		const broadcaster_id = await this.getBroadcastID();

		const res = await axios.post(
			`https://api.twitch.tv/helix/chat/messages`,
			{
				broadcaster_id: broadcaster_id.data[0].id,
				sender_id: broadcaster_id.data[0].id,
				message: message,
				reply_parent_message_id: parent,
			},
			{
				headers: {
					Authorization: `Bearer kaegoabz7slabov1aq3uyu5dt3t4hg`,
					'Client-ID': `gp762nuuoqcoxypju8c569th9wz7q5`,
				},
			}
		);
		return await res.data;
	}

	async replySender(sender: string, parent: string, message: string) {
		const broadcaster_id = await this.getBroadcastID();

		const res = await axios.post(
			`https://api.twitch.tv/helix/chat/messages`,
			{
				broadcaster_id: broadcaster_id.data[0].id,
				sender_id: sender,
				message: message,
				reply_parent_message_id: parent,
			},
			{
				headers: {
					Authorization: `Bearer kaegoabz7slabov1aq3uyu5dt3t4hg`,
					'Client-ID': `gp762nuuoqcoxypju8c569th9wz7q5`,
				},
			}
		);
		console.log(res);
		return await res.data;
	}

	async getGame() {
		const broadcaster_id = await this.getBroadcastID();

		const res = await axios.get(
			`https://api.twitch.tv/helix/channels?broadcaster_id=${broadcaster_id.data[0].id}`,
			{
				headers: {
					Authorization: `Bearer kaegoabz7slabov1aq3uyu5dt3t4hg`,
					'Client-ID': `gp762nuuoqcoxypju8c569th9wz7q5`,
				},
			}
		);
		console.log(res.data.data[0].game_id);
		return await res.data.data[0];
	}
}
