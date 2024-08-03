import { Router } from 'express';

import { input_guardrail, output_guardrail } from '../services/guardrail.js';
import { query_expansion } from '../services/query_expansion.js';
import { createMemory } from '../services/memory.js';

const router = Router();

router.post('/inference', async (req, res) => {
	const user_id = req.body.user_id;
	const prompt = req.body.prompt;
	const token = req.body.token;

	const startTime = new Date();
	let system_prompt = '';
	let message = '';
	let gin_activated = false;
	let gout_activated = false;

	try {
		//QUERY EXPANSION
		prompt_expanded = await query_expansion(prompt);

		//INPUT GUARDRAIL
		const inputGuardrail = await input_guardrail(user_id, prompt_expanded);
		if (!inputGuardrail) {
			gin_activated = true;
			throw new Error('Input guardrail failed');
		}

		//PREACTION
		//MEMORY
		const memories = await getMemories(user_id);
		//TOOLBELT
		const rag = ''; //TODO: Get RAG from Rag Pipeline
		//TODO: Augment System Prompt
		//INFERENCE
		//RESPONSE
	} catch (error) {
		if (error.message === 'Input guardrail failed') {
			message = 'No puc complir amb la teva petició, ja que no compleix els criteris de seguretat o no estic entrenat per respondre-la.';
		} else {
			message = 'He tingut un problema intern i no he pogut processar la teva petició. Torna-ho a intentar més tard.';
			console.error(error);
		}
	} finally {
		const endTime = new Date();
		const timeElapsed = endTime - startTime;
		await createMemory(user_id, system_prompt, prompt, message, timeElapsed, gin_activated, gout_activated);
		return res.json({
			time_elapsed: timeElapsed,
			moment: Date(),
			user_id,
			message
		});
	}
});

export default router;
