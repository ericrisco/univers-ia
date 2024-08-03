import { query_rewriting } from './query_rewriting.js';
import { query_keywords } from './query_keywords.js';
import { document_query } from './document_query.js';

export async function rag_pipeline(user_id, prompt) {
	try {
		let rag_content = '';
		console.info(`Rag pipeline Request: ${user_id} ${prompt}`);

		const rewrites = await query_rewriting(user_id, prompt);
		console.info(`Rewrites: ${rewrites}`);

		const keywordsPromises = rewrites.map((rewrite) => query_keywords(user_id, rewrite));
		const keywordsArrays = await Promise.all(keywordsPromises);

		const combinedResults = [...rewrites, ...keywordsArrays.flat()];

		const results = [...new Set(combinedResults)];
		console.info(`Unique results: ${results}`);

		const documentPromises = results.map((result) => document_query(result));
		const documentResults = await Promise.all(documentPromises);

		console.log(documentResults);

		console.info(`Rag pipeline Response: ${user_id} ${rag_content}`);

		return rag_content;
	} catch (error) {
		console.error(`rag_pipeline Error: ${error}`);
		throw error;
	}
}
