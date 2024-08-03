import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

import atlastMongodbConnect from './db/connector.js';
import general from './routers/general.js';
import inference from './routers/inference.js';

import { ingestion } from './loaders/document_loader.js';
import { query } from './services/document_query.js';

const PORT = process.env.PORT ?? 3000;
const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(morgan('[:date[clf]]: :remote-addr ":user-agent" :method :url :status - :response-time ms'));

const mainUrl = '/univers-ia/api/v1';
app.use(mainUrl, general);
app.use(mainUrl, inference);

app.listen(PORT, async () => {
	console.log('Univers IA API is listening on port:', PORT);
	await atlastMongodbConnect();
	//await query('cocaina');
	//await ingestion();
});
