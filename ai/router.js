export async function route(brainRequest) {
	try {
		console.info(`Brain Route received: ${JSON.stringify(brainRequest)}`);

		let chatResponse = '';

		switch (llmRequest.model) {
			case 'openai':
				chatResponse = await openai_completion(brainRequest);
				break;
			default:
				throw new Error('Model not found');
		}

		console.info(`Brain Route received: ${JSON.stringify(brainRequest)}`);

		return new BrainResponse(brainRequest.user_id, chatResponse);
	} catch (error) {
		console.error(`Brain Route Error: ${error}`);
		throw error;
	}
}
