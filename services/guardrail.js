import { readSystemPrompt } from '../helpers/read_system_prompts.js';
import { route } from '../ai/router.js';

const MODEL = 'openai';
const VERSION = 'gpt-4o';
const TEMPERATURE = 0;

const MAX_RETRIES = process.env.MAX_RETRIES || 3;

async function guardrail(user_id, prompt, fileName, retries = 0) {
	try {
		const system_prompt = await readSystemPrompt(fileName);
		const brainRequest = {
			model: MODEL,
			version: VERSION,
			temperature: TEMPERATURE,
			user_id: user_id,
			system_prompt: system_prompt,
			prompt: prompt
		};
		const brainResponse = await route(brainRequest);
		const guardrail_response = brainResponse.message === 'true' ? true : brainResponse.message === 'false' ? false : null;

		if (guardrail_response === null) {
			throw new Error(`Invalid boolean string: ${brainResponse.message}`);
		}

		return guardrail_response;
	} catch (error) {
		console.error(`guardrail Error: ${error}`);

		if (retries < MAX_RETRIES) {
			console.log(`Retrying... Attempt ${retries + 1}`);
			return await guardrail(user_id, prompt, fileName, retries + 1);
		} else {
			throw error;
		}
	}
}

export async function input_guardrail(user_id, prompt, retries = 0) {
	console.info(`Input guardrail received: ${user_id} ${prompt}`);
	const response = await guardrail(user_id, prompt, 'input_guardrail.txt', retries);
	console.log(`Input guardrail response: ${user_id} ${response}`);
	return response;
}

export async function output_guardrail(user_id, prompt, retries = 0) {
	console.info(`Output guardrail received: ${user_id} ${prompt}`);
	const response = await guardrail(user_id, prompt, 'output_guardrail.txt', retries);
	console.log(`Output guardrail response: ${user_id} ${response}`);
	return response;
}
