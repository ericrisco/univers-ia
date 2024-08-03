import { readSystemPrompt } from '../helpers/read_system_prompts.js';
import { route } from '../ai/router.js';

const MODEL = 'openai';
const VERSION = 'gpt-4o-mini';
const TEMPERATURE = 0;

const MAX_RETRIES = process.env.MAX_RETRIES || 3;

export async function query_keywords(user_id, prompt, retries = 0) {
	try {
		console.info(`Query Keywords Request: ${user_id} ${prompt}`);
		const system_prompt = await readSystemPrompt('query_keywords.txt');

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

		const keywords = JSON.parse(brainResponse.message);

		return keywords;
	} catch (error) {
		console.error(`query_keywords Error: ${error}`);

		if (retries < MAX_RETRIES) {
			console.log(`Retrying... Attempt ${retries + 1}`);
			return query_keywords(user_id, prompt, retries + 1);
		} else {
			throw error;
		}
	}
}
