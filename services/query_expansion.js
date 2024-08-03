import { readSystemPrompt } from '../helpers/read_system_prompts';
import { route } from '../ai/router';

const MODEL = 'openai';
const VERSION = 'gpt-4o-mini';
const TEMPERATURE = 0;

const MAX_RETRIES = process.env.MAX_RETRIES || 3;

export async function query_expansion(user_id, prompt, retries = 0) {
	try {
		console.info(`Query Expansion Request: ${user_id} ${prompt}`);
		const system_prompt = await readSystemPrompt('query_expansion.txt');

		let messages = [];
		let memories = []; //TODO: Get memories from database

		for (let i = 0; i < memories.length; i++) {
			let message = `${i + 1}. [User]: ${memories[i].message}`;
			messages.push(message);
		}

		let chat_history = messages.join('\n');
		system_prompt = `
            <chat history>
            ${chat_history}
            </chat history>

            <last_message>
            ${prompt}
            </last_message>`;

		const brainRequest = {
			model: MODEL,
			version: VERSION,
			temperature: TEMPERATURE,
			user_id: user_id,
			system_prompt: system_prompt,
			prompt: prompt
		};

		const brainResponse = await route(brainRequest);
		console.info(`Query Expansion Response: ${user_id} ${brainResponse.message}`);

		return brainResponse.message;
	} catch (error) {
		console.error(`query_expansion Error: ${error}`);

		if (retries < MAX_RETRIES) {
			console.log(`Retrying... Attempt ${retries + 1}`);
			return query_expansion(user_id, prompt, retries + 1);
		} else {
			throw error;
		}
	}
}
