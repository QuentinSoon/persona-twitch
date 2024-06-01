export type MessageType = {
	tags: MessageTags | null;
	source: MessageSource | null;
	command: MessageCommand | null;
	parameters: string | null;
};

interface MessageTags {
	badges: MessageBadges;
	color: string;
	'display-name': string;
	'emote-only': string;
	emotes: {};
	id: string;
	mod: string;
	'room-id': string;
	subscriber: string;
	turbo: string;
	'tmi-sent-ts': string;
	'user-id': string;
	'user-type': string;
}

interface MessageBadges {
	staff: string;
	broadcaster: string;
	turbo: string;
}

interface MessageSource {
	nick: string | null;
	host: string | null;
}

interface MessageCommand {
	command: string;
	channel: string;
}

export function parseMessages(message: string) {
	let parsedMessage: MessageType = {
		tags: {
			badges: {
				staff: '',
				broadcaster: '',
				turbo: '',
			},
			color: '',
			'display-name': '',
			'emote-only': '',
			emotes: {},
			id: '',
			mod: '',
			'room-id': '',
			subscriber: '',
			turbo: '',
			'tmi-sent-ts': '',
			'user-id': '',
			'user-type': '',
		},
		source: {
			nick: '',
			host: '',
		},
		command: {
			command: '',
			channel: '',
		},
		parameters: '',
	};

	let idx = 0;

	let rawTagsComponent: string | null = null;
	let rawSourceComponent: string | null = null;
	let rawCommandComponent: string | null = null;
	let rawParametersComponent: string | null = null;

	if (message[idx] === '@') {
		let endIdx = message.indexOf(' ');
		rawTagsComponent = message.slice(1, endIdx);
		idx = endIdx + 1;
	}

	if (message[idx] === ':') {
		idx += 1;
		let endIdx = message.indexOf(' ', idx);
		rawSourceComponent = message.slice(idx, endIdx);
		idx = endIdx + 1;
	}

	let endIdx = message.indexOf(':', idx);
	if (endIdx === -1) {
		endIdx = message.length;
	}

	rawCommandComponent = message.slice(idx, endIdx).trim();

	if (endIdx !== message.length) {
		idx = endIdx + 1;
		rawParametersComponent = message.slice(idx);
	}

	parsedMessage.command = parseCommand(rawCommandComponent);

	if (parsedMessage.command === null) {
		return null;
	} else {
		if (rawTagsComponent !== null) {
			parsedMessage.tags = parseTags(rawTagsComponent);
		}

		parsedMessage.source = parseSource(rawSourceComponent);

		parsedMessage.parameters = rawParametersComponent;
		if (rawParametersComponent && rawParametersComponent[0] === '!') {
			parsedMessage.command = parseParameters(
				rawParametersComponent,
				parsedMessage.command
			);
		}
	}

	return parsedMessage;
}

function parseTags(tags: string): MessageTags {
	const tagsToIgnore: { [key: string]: any | null } = {
		'client-nonce': null,
		flags: null,
	};

	let dictParsedTags: { [key: string]: any } = {};
	let parsedTags = tags.split(';');

	parsedTags.forEach((tag) => {
		let parsedTag = tag.split('=');
		let tagValue = parsedTag[1] === '' ? null : parsedTag[1];

		switch (parsedTag[0]) {
			case 'badges':
			case 'badge-info':
				if (tagValue) {
					let dict: { [key: string]: string } = {};
					let badges = tagValue.split(',');
					badges.forEach((pair) => {
						let badgeParts = pair.split('/');
						dict[badgeParts[0]] = badgeParts[1];
					});
					dictParsedTags[parsedTag[0]] = dict;
				} else {
					dictParsedTags[parsedTag[0]] = null;
				}
				break;
			case 'emotes':
				if (tagValue) {
					let dictEmotes: {
						[key: string]: { startPosition: string; endPosition: string }[];
					} = {};
					let emotes = tagValue.split('/');
					emotes.forEach((emote) => {
						let emoteParts = emote.split(':');

						let textPositions: {
							startPosition: string;
							endPosition: string;
						}[] = [];
						let positions = emoteParts[1].split(',');
						positions.forEach((position) => {
							let positionParts = position.split('-');
							textPositions.push({
								startPosition: positionParts[0],
								endPosition: positionParts[1],
							});
						});

						dictEmotes[emoteParts[0]] = textPositions;
					});

					dictParsedTags[parsedTag[0]] = dictEmotes;
				} else {
					dictParsedTags[parsedTag[0]] = null;
				}

				break;
			case 'emote-sets':
				if (tagValue === null) {
					dictParsedTags[parsedTag[0]] = null;
					break;
				}
				let emoteSetIds = tagValue.split(',');
				dictParsedTags[parsedTag[0]] = emoteSetIds;
				break;
			default:
				if (!(parsedTag[0] in tagsToIgnore)) {
					dictParsedTags[parsedTag[0]] = tagValue;
				}
		}
	});

	return {
		badges: dictParsedTags['badges'] as MessageBadges,
		color: dictParsedTags['color'] as string,
		'display-name': dictParsedTags['display-name'] as string,
		'emote-only': dictParsedTags['emote-only'] as string,
		emotes: dictParsedTags['emotes'] as {},
		id: dictParsedTags['id'] as string,
		mod: dictParsedTags['mod'] as string,
		'room-id': dictParsedTags['room-id'] as string,
		subscriber: dictParsedTags['subscriber'] as string,
		turbo: dictParsedTags['turbo'] as string,
		'tmi-sent-ts': dictParsedTags['tmi-sent-ts'] as string,
		'user-id': dictParsedTags['user-id'] as string,
		'user-type': dictParsedTags['user-type'] as string,
	};
}

function parseCommand(rawCommandComponent: string): MessageCommand | null {
	let parsedCommand: MessageCommand | null = null;
	let commandParts = rawCommandComponent.split(' ');

	switch (commandParts[0]) {
		case 'JOIN':
		case 'PART':
		case 'NOTICE':
		case 'CLEARCHAT':
		case 'HOSTTARGET':
		case 'PRIVMSG':
			parsedCommand = {
				command: commandParts[0],
				channel: commandParts[1],
			};
			break;
		case 'PING':
			parsedCommand = {
				command: commandParts[0],
				channel: '',
			};
			break;
		case 'CAP':
			parsedCommand = {
				command: commandParts[0],
				channel: '',
			};
			break;
		case 'GLOBALUSERSTATE':
		case 'USERSTATE':
		case 'ROOMSTATE':
			parsedCommand = {
				command: commandParts[0],
				channel: commandParts[1],
			};
			break;
		case 'RECONNECT':
			console.log(
				'The Twitch IRC server is about to terminate the connection for maintenance.'
			);
			parsedCommand = {
				command: commandParts[0],
				channel: '',
			};
			break;
		case '421':
			console.log(`Unsupported IRC command: ${commandParts[2]}`);
			return null;
		case '001':
			parsedCommand = {
				command: commandParts[0],
				channel: commandParts[1],
			};
			break;
		default:
			console.log(`\nUnexpected command: ${commandParts[0]}\n`);
			return null;
	}

	return parsedCommand;
}

function parseSource(rawSourceComponent: string | null): MessageSource | null {
	if (rawSourceComponent === null) {
		return null;
	} else {
		let sourceParts = rawSourceComponent.split('!');
		return {
			nick: sourceParts.length === 2 ? sourceParts[0] : null,
			host: sourceParts.length === 2 ? sourceParts[1] : sourceParts[0],
		};
	}
}

function parseParameters(
	rawParametersComponent: string,
	command: MessageCommand | null
): MessageCommand | null {
	let idx = 0;
	let commandParts = rawParametersComponent.slice(idx + 1).trim();
	let paramsIdx = commandParts.indexOf(' ');

	// if (paramsIdx === -1) {
	// 	command!.botCommand = commandParts.slice(0);
	// } else {
	// 	command!.botCommand = commandParts.slice(0, paramsIdx);
	// 	command!.botCommandParams = commandParts.slice(paramsIdx).trim();
	// }

	return command;
}
