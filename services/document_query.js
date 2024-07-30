import { OpenAIEmbeddings } from '@langchain/openai';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import { MongoClient } from 'mongodb';

export async function query(input) {
	let dbUrl = process.env.MONGODB_URI;
	dbUrl = dbUrl.replace('<username>', process.env.MONGODB_USERNAME).replace('<password>', process.env.MONGODB_PASSWORD);

	const client = new MongoClient(dbUrl || '');
	const namespace = process.env.MONGODB_NAMESPACE;
	const [dbName, collectionName] = namespace.split('.');
	const collection = client.db(dbName).collection(collectionName);

	const embeddings = new OpenAIEmbeddings({ apiKey: process.env.OPENAI_TOKEN, model: process.env.EMBEDDING_MODEL });

	const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
		collection,
		indexName: process.env.MONGODB_INDEXNAME,
		textKey: 'text',
		embeddingKey: 'embedding'
	});

	const resultOne = await vectorStore.similaritySearch(input, 5);
	console.log(resultOne);

	await client.close();
}
