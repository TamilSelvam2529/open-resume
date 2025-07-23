import { NextResponse } from 'next/server';
import { Readable } from 'stream';
import { readPdf } from '@/lib/parse-resume-from-pdf/read-pdf';
import { groupTextItemsIntoLines } from '@/lib/parse-resume-from-pdf/group-text-items-into-lines';
import { groupLinesIntoSections } from '@/lib/parse-resume-from-pdf/group-lines-into-sections';
import { extractResumeFromSections } from '@/lib/parse-resume-from-pdf/extract-resume-from-sections';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function bufferFromStream(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

export async function POST(request: Request) {
  try {
    const data = await request.arrayBuffer();
    const textItems = await readPdf(Buffer.from(data));
    const lines = groupTextItemsIntoLines(textItems);
    const sections = groupLinesIntoSections(lines);
    const resume = extractResumeFromSections(sections);
    
    return NextResponse.json(resume);
  } catch (error) {
    console.error('Error parsing resume:', error);
    return NextResponse.json(
      { error: 'Failed to parse resume' },
      { status: 500 }
    );
  }
}
