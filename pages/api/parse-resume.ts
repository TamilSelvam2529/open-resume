import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import { readPdf } from '../../lib/parse-resume-from-pdf/read-pdf';
import { groupTextItemsIntoLines } from '../../lib/parse-resume-from-pdf/group-text-items-into-lines';
import { groupLinesIntoSections } from '../../lib/parse-resume-from-pdf/group-lines-into-sections';
import { extractResumeFromSections } from '../../lib/parse-resume-from-pdf/extract-resume-from-sections';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function bufferFromStream(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const buffer = await bufferFromStream(req);
    const textItems = await readPdf(buffer);
    const lines = groupTextItemsIntoLines(textItems);
    const sections = groupLinesIntoSections(lines);
    const resume = extractResumeFromSections(sections);

    return res.status(200).json(resume);
  } catch (error) {
    console.error('Error parsing resume:', error);
    return res.status(500).json({ 
      error: 'Failed to parse resume',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}
