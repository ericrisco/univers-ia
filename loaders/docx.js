import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';
import { Document } from '@langchain/core/documents';

export async function readDocx(filename) {
	const loader = new DocxLoader(filename);
	const document = await loader.load();
	const docText = document[0].pageContent;
	const metadata = document[0].metadata;

	const chaptersRegex = /\n\nCapítol [IVXLCDM]+\. .*?(?=\n\nCapítol [IVXLCDM]+\. |\n{2,}$)/gs;
	let chapters = docText.match(chaptersRegex) || [];

	const processedChapters = chapters.map((chapter) => {
		const document = new Document();
		document.pageContent = chapter.replace(/\n{2,}/g, '\n').trim();
		document.metadata = metadata;
		return document;
	});

	console.log(processedChapters);

	return processedChapters;
}
