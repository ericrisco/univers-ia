import { openai_completion } from './brains/openai.js';

export async function route(brainRequest) {
	try {
		console.info(`Brain Route received: ${JSON.stringify(brainRequest)}`);

		let brainResponse;

		switch (brainRequest.model) {
			case 'openai':
				brainResponse = await openai_completion(brainRequest);
				break;
			default:
				throw new Error('Model not found');
		}

		if (!brainResponse) {
			throw new Error('No response from model');
		}

		return brainResponse;
	} catch (error) {
		console.error(`Brain Route Error: ${error}`);
		throw error;
	}
}
