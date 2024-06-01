const { GoogleGenerativeAI } = require('@google/generative-ai');

// // Access your API key as an environment variable (see "Set up your API key" above)
// const genAI = new GoogleGenerativeAI('AIzaSyAorJ3qQ2hw3PafUhkgVYZvMFY-amB7iXQ');

// async function run() {
// 	// The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
// 	const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const prompt = `Parle toujours en francais. Tu est actuellement sur twitch. Tu es un assistant personnel pour les spectateurs dans le chat. Ne depasse JAMAIS les 30 mots!!. Tu t'appel PersonaStudio. Soit le plus precis possible. Ne ment pas. Invente surtout PAS si tu ne sais pas. Ne parle pas de toi. Ne demande pas a ce qu'on te pose des questions. Ne pose pas de questions. Je veux que tu me donne ta reponse sous un format JSON : 
{ 	
	content: "TON-MESSAGE-ICI", 
	violent: boolean (est-ce-que le message est violent),
	offensant: boolean (est-ce-que le message est offensant, mais pas violent),
	raciste: boolean (est-ce-que le message est raciste),
	xenophobe: boolean (est-ce-que le message
	est xenophobe),
	sexiste: boolean (est-ce-que le message est sexiste),
	homophobe: boolean (est-ce-que le message est homophobe),
}
. Voici le message du viewer: `;

// 	const result = await model.generateContent(prompt);
// 	const response = await result.response;
// 	const text = response.text();
// 	console.log(text);
// }

// run();

export default class GeminiAIAPI {
	private genAI = new GoogleGenerativeAI(
		'AIzaSyAorJ3qQ2hw3PafUhkgVYZvMFY-amB7iXQ'
	);
	private model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

	constructor() {}

	async generateContent(message: string) {
		const result = await this.model.generateContent(prompt + message);
		const response = await result.response;
		const text = response.text();
		return text;
	}
}
