import { Router } from 'express';

import { input_guardrail, output_guardrail } from '../services/guardrail.js';

const router = Router();

router.post('/inference', async (req, res) => {
	try {
		const user_id = req.body.user_id;
		const prompt = req.body.prompt;
		const token = req.body.token;

		//QUERY EXPANSION
		//INPUT GUARDRAIL
		const inputGuardrail = await input_guardrail(user_id, prompt);
		if (!inputGuardrail) {
			throw new Error('Input guardrail failed');
		}
		//PREACTION
		//MEMORY
		//TOOLBELT
		//INFERENCE
		//RESPONSE
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

export default router;
