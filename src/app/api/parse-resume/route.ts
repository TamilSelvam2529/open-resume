import { NextResponse } from 'next/server';
import { readPdf } from '@/lib/parse-resume-from-pdf/read-pdf';
import { groupTextItemsIntoLines } from '@/lib/parse-resume-from-pdf/group-text-items-into-lines';
import { groupLinesIntoSections } from '@/lib/parse-resume-from-pdf/group-lines-into-sections';
import { extractResumeFromSections } from '@/lib/parse-resume-from-pdf/extract-resume-from-sections';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const textItems = await readPdf(buffer);
    const lines = groupTextItemsIntoLines(textItems);
    const sections = groupLinesIntoSections(lines);
    const resume = extractResumeFromSections(sections);

    return NextResponse.json(resume);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to parse resume' },
      { status: 500 }
    );
  }
}
