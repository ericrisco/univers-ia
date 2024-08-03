import { promises as fs } from 'fs';
import path from 'path';

export async function readSystemPrompt(fileName) {
	try {
		const correctedPath = new URL(import.meta.url).pathname.replace(/^\/([A-Z]:\/)/, '$1');
		const basePath = path.dirname(path.dirname(correctedPath));
		const filePath = path.join(basePath, 'ai', 'system_prompts', fileName);
		const data = await fs.readFile(filePath, 'utf8');
		return data;
	} catch (err) {
		throw new Error(`Error reading file: ${err.message}`);
	}
}
