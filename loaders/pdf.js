import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';

export async function readPDF(filename) {
	const loader = new PDFLoader(filename, {
		splitPages: true,
		preserveFormatting: true
	});
	const documentPages = await loader.load();
	return documentPages;
}
