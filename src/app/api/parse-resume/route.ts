import { NextResponse } from 'next/server';
import { readPdf } from '@/lib/parse-resume-from-pdf/read-pdf';
import { groupTextItemsIntoLines } from '@/lib/parse-resume-from-pdf/group-text-items-into-lines';
import { groupLinesIntoSections } from '@/lib/parse-resume-from-pdf/group-lines-into-sections';
import { extractResumeFromSections } from '@/lib/parse-resume-from-pdf/extract-resume-from-sections';

// Required configuration for PDF processing
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30; // Maximum execution time (seconds)

export async function POST(request: Request) {
  try {
    // Handle PDF buffer directly
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Process PDF using existing OpenResume logic
    const textItems = await readPdf(buffer);
    const lines = groupTextItemsIntoLines(textItems);
    const sections = groupLinesIntoSections(lines);
    const resume = extractResumeFromSections(sections);

    return NextResponse.json(resume);
  } catch (error) {
    console.error('Resume parsing failed:', error);
    return NextResponse.json(
      { error: 'Resume parsing failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
