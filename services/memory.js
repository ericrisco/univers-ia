import Memory from '../models/memory.js';

export async function getMemories(user_id) {
	try {
		const memories = await Memory.getLastMemories(user_id);
		memories = memories.reverse();

		const transformed = memories.flatMap((memory) => [
			{
				role: 'user',
				content: memory.input
			},
			{
				role: 'assistant',
				content: memory.output
			}
		]);

		return transformed;
	} catch (error) {
		console.error('Error getMemories:', error);
		throw error;
	}
}

export async function getUserMemories(user_id) {
	try {
		const memories = await Memory.getLastMemories(user_id);
		memories = memories.reverse();

		const transformed = memories.map((memory) => memory.input);

		return transformed;
	} catch (error) {
		console.error('Error getUserMemories:', error);
		throw error;
	}
}

export async function createMemory(user_id, system_prompt, input, output, time_elapsed = 0, gin_activated = false, gout_activated = false) {
	try {
		await Memory.createMemory(user_id, system_prompt, input, output, time_elapsed, gin_activated, gout_activated);
	} catch (error) {
		console.error('Error Service createMemory:', error);
		throw error;
	}
}
