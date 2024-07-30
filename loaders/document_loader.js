import fs from 'fs';
import path from 'path';
import { OpenAIEmbeddings } from '@langchain/openai';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import { MongoClient } from 'mongodb';
import { fileURLToPath } from 'url';

import { readDocx } from '../loaders/docx.js';
import { readPDF } from '../loaders/pdf.js';

export async function ingestion() {
	const documents = await load_documents();

	let dbUrl = process.env.MONGODB_URI;
	dbUrl = dbUrl.replace('<username>', process.env.MONGODB_USERNAME).replace('<password>', process.env.MONGODB_PASSWORD);

	const client = new MongoClient(dbUrl || '');
	const namespace = process.env.MONGODB_NAMESPACE;
	const [dbName, collectionName] = namespace.split('.');
	const collection = client.db(dbName).collection(collectionName);

	const embeddings = new OpenAIEmbeddings({ apiKey: process.env.OPENAI_TOKEN, model: process.env.EMBEDDING_MODEL });

	await MongoDBAtlasVectorSearch.fromDocuments(documents, embeddings, {
		collection,
		indexName: process.env.MONGODB_INDEXNAME,
		textKey: 'text',
		embeddingKey: 'embedding'
	});

	console.log('Document Ingestion Completed');
	await client.close();
	return;
}

async function load_documents() {
	try {
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);
		const rootDir = path.resolve(__dirname, '..');
		const documentsDir = path.join(rootDir, 'documents');

		const files = fs.readdirSync(documentsDir);
		const results = [];

		for (const file of files) {
			const filePath = path.join(documentsDir, file);
			const ext = path.extname(file).toLowerCase();

			let result;
			switch (ext) {
				case '.docx':
					result = await readDocx(filePath);
					break;
				case '.pdf':
					result = await readPDF(filePath);
					break;
				default:
					break;
			}
			results.push(...result);
		}

		console.log(results);

		return results;
	} catch (error) {
		console.error('Error listing the documents:', error);
		return [];
	}
}
