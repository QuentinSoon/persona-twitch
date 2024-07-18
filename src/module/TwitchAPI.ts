const tmi = require('tmi.js');
import axios from 'axios';

export default class TwitchAPI {
	private apiURL = 'https://api.twitch.tv/helix';
	private BarearToken = 'kaegoabz7slabov1aq3uyu5dt3t4hg';
	// private BarearToken = 'et70fzndd8cvbymdayf7kbslf7c4ue';
	private ClientID = 'gp762nuuoqcoxypju8c569th9wz7q5';

	public client = new tmi.Client({
		options: { debug: true },
		identity: {
			username: 'personastudio',
			password: 'oauth:04phnd1f3le44q88i37knxv3784rb7',
		},
		channels: ['quentinlabs', 'lemaraudeurtv'],
	});

	constructor() {
		this.client.connect();
	}

	/**
	 * Get Channel Information
	 * @description Get information about one channel.
	 */
	async GetChannelInformation({ broadcaster_id }: { broadcaster_id: string }) {
		const result = await axios.get(
			`${this.apiURL}/channels?broadcaster_id=${broadcaster_id}`,
			{
				headers: {
					Authorization: `Bearer ${this.BarearToken}`,
					'Client-ID': this.ClientID,
				},
			}
		);
		return result.data.data[0];
	}

	/**
	 * Get Users
	 * @description Get information about one user.
	 */
	async GetUsers({ name }: { name: string }) {
		const result = await axios.get(`${this.apiURL}/users`, {
			headers: {
				Authorization: `Bearer ba6ll8i29b0xa14nxgkf6jy9o658z4`,
				'Client-ID': 'gp762nuuoqcoxypju8c569th9wz7q5',
			},
		});
		console.log(result);
		return result.data.data[0];
	}

	/**
	 * Send Chat Announcement
	 * @description Get information about one user.
	 */
	async SendChatAnnouncement({
		broadcaster_id,
		moderator_id,
	}: {
		broadcaster_id: string;
		moderator_id: string;
	}) {
		const result = await axios.post(
			`${this.apiURL}/chat/announcements?broadcaster_id=${broadcaster_id}&moderator_id=${moderator_id}`,
			{
				message:
					'Rejoins-nous sur le Discord, il est tellement cool : https://discord.gg/test',
				color: 'primary',
			},
			{
				headers: {
					Authorization: `Bearer ${this.BarearToken}`,
					'Client-ID': this.ClientID,
				},
			}
		);
		// return result.data.data[0];
	}

	/**
	 * Create Clip
	 * @description Create a clip from the broadcaster’s stream.
	 */
	async CreateClip({ broadcaster_id }: { broadcaster_id: string }) {
		const result = await axios.post(
			`${this.apiURL}/clips?broadcaster_id=${broadcaster_id}`,
			{
				broadcaster_id,
			},
			{
				headers: {
					Authorization: `Bearer ${this.BarearToken}`,
					'Client-ID': this.ClientID,
				},
			}
		);
		return result.data.data[0];
	}
}
