import BrainResponse from '../../models/brain_response.js';

export async function openai_completion(brainRequest) {
	try {
		console.info(`OpenAI Request received: ${JSON.stringify(brainRequest)}`);

		let chatResponse = '';

		const completion = await openai.chat.completions.create({
			model: brainRequest.model_name,
			messages: [{ role: 'system', content: 'You are a helpful assistant.' }]
		});

		console.info(`OpenAI Request response: ${JSON.stringify(brainRequest)}`);

		chatResponse = completion.choices[0].message.content;

		return new BrainResponse(brainRequest.user_id, chatResponse);
	} catch (error) {
		console.error(`OpenAI Request Error: ${error}`);
		throw error;
	}
}
