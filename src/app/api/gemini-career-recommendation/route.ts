import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { studentProfileId, careerPathId } = await request.json();

    // Fetch student profile and career path data
    const { data: studentProfile, error: studentError } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('id', studentProfileId)
      .single();

    if (studentError) throw studentError;

    const { data: careerPath, error: careerError } = await supabase
      .from('career_paths')
      .select('*')
      .eq('id', careerPathId)
      .single();

    if (careerError) throw careerError;

    // Generate recommendation using Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Given the following student profile and career path, provide a personalized career recommendation:

Student Profile:
${JSON.stringify(studentProfile, null, 2)}

Career Path:
${JSON.stringify(careerPath, null, 2)}

Please provide a detailed recommendation on why this career path might be suitable for the student, considering their skills, interests, and background. Also, suggest some steps the student could take to prepare for this career path.`;

    const result = await model.generateContent(prompt);
    const recommendation = result.response.text();

    // Store the recommendation in the database
    const { data: storedRecommendation, error: insertError } = await supabase
      .from('gemini_career_recommendations')
      .insert({
        student_profile_id: studentProfileId,
        career_path_id: careerPathId,
        recommendation: recommendation
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ recommendation: storedRecommendation });
  } catch (error) {
    console.error('Error in Gemini career recommendation:', error);
    return NextResponse.json({ error: 'Failed to generate career recommendation' }, { status: 500 });
  }
}

