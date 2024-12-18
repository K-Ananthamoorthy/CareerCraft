import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai"
import pdf from 'pdf-parse'
import { createWorker } from 'tesseract.js'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    const data = await pdf(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

async function extractTextFromImage(imageBuffer: Buffer): Promise<string> {
  const worker = await createWorker('eng');
  try {
    const { data: { text } } = await worker.recognize(imageBuffer);
    await worker.terminate();
    return text;
  } catch (error) {
    console.error('Error extracting text from image:', error);
    await worker.terminate();
    throw new Error('Failed to extract text from image');
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let resumeContent: string;

    if (file.type === 'application/pdf') {
      resumeContent = await extractTextFromPDF(buffer);
    } else if (file.type.startsWith('image/')) {
      resumeContent = await extractTextFromImage(buffer);
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    if (!resumeContent || typeof resumeContent !== 'string') {
      return NextResponse.json({ error: 'Invalid resume content' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze the following resume content and provide a comprehensive analysis. 
    Provide your analysis in a JSON format with the following keys:
    - 'strengths' (array of 3-5 strings): Highlight the key strengths of the candidate based on their resume.
    - 'improvements' (array of 3-5 strings): Suggest areas for improvement or missing elements in the resume.
    - 'keywords' (array of 5-10 strings): Identify important keywords or skills present in the resume.
    - 'formatting' (array of 2-3 strings): Provide suggestions for improving the resume's format or structure.
    - 'overall_score' (number): Provide an overall score for the resume out of 100.
    - 'summary' (string): Provide a brief summary of the candidate's profile based on the resume.
    Keep each suggestion concise and actionable.
    
    Resume content:
    ${resumeContent}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    if (!analysis.strengths || !analysis.improvements || !analysis.keywords || !analysis.formatting || !analysis.overall_score || !analysis.summary) {
      return NextResponse.json({ error: 'Invalid AI response structure' }, { status: 500 });
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in resume analysis:', error);
    return NextResponse.json({ error: 'Failed to analyze resume' }, { status: 500 });
  }
}

