import { NextApiRequest, NextApiResponse } from 'next';
import { readPdf } from '../../lib/parse-resume-from-pdf/read-pdf';
import { groupTextItemsIntoLines } from '../../lib/parse-resume-from-pdf/group-text-items-into-lines';
import { groupLinesIntoSections } from '../../lib/parse-resume-from-pdf/group-lines-into-sections';
import { extractResumeFromSections } from '../../lib/parse-resume-from-pdf/extract-resume-from-sections';

export const config = {
  api: { bodyParser: false }, // Necessary for binary PDF data
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const chunks: Uint8Array[] = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const pdfBuffer = Buffer.concat(chunks);

    const textItems = await readPdf(pdfBuffer);
    const lines = groupTextItemsIntoLines(textItems);
    const sections = groupLinesIntoSections(lines);
    const resume = extractResumeFromSections(sections);

    res.status(200).json(resume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to parse resume' });
  }
}
