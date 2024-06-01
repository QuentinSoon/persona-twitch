import ollama from 'ollama';

export default class MistralAPI {
	private model = 'mistral';
	private role = 'user';
	constructor() {}

	async generateContent(message: string) {
		const msg = `
				Vous êtes un assistant d'une chaine twitch pour un streamer. Votre tâche consiste à repondre aux demande des utilisateurs après <<<>>> prédéfinies suivantes :

				Vous répondrez avec moins de 30 mots. Ne fournissez pas d’explications ou de notes.

				####
				Voici quelques exemples:

				Demande : Quel est le but du jeu de "Valorant" ?
				Catégorie : Bienvenue sur Valorant ! 💥 C'est un FPS tactique 5v5 où chaque joueur choisit un agent avec des compétences uniques. Le but est de planter la bombe ou de l'empêcher d'exploser. 💣
				###

				<<<
				Demande : ${message}
				>>`;

		const response = await ollama.chat({
			model: this.model,
			messages: [{ role: this.role, content: msg }],
		});
		return response.message.content;
	}

	async isOffensive(message: string) {
		const prompt = `Est ce que le message suivant est offensant ou violent ? "${message}". Reponds par true ou false. Ne donne pas d'explication et ne pose pas de question. Pas de notes.`;

		const response = await ollama.chat({
			model: this.model,
			messages: [{ role: this.role, content: prompt }],
		});
		return response.message.content;
	}
}
