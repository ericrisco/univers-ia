import { Router } from 'express';
import os from 'os';

const router = Router();

router.get('/ping', async (req, res) => {
	try {
		var hostname = os.hostname();
		return res.json({ hostname, moment: Date() });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

export default router;
