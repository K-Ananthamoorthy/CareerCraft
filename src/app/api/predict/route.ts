import { NextResponse } from 'next/server'
import { Groq } from 'groq-sdk'

const groq = new Groq()

interface InputData {
  age: number
  attendance_rate: number
  average_test_score: number
  extracurricular_score: number
  coding_skill_score: number
  communication_score: number
  leadership_score: number
  internship_experience: number
  career_interest?: string
}

function generateInitialInsights(inputData: InputData) {
  const strengths = []
  const weaknesses = []
  const recommendations = []

// Academic Performance
if (inputData.average_test_score >= 95) {
  strengths.push("Exceptional academic performance with a mastery of subjects.");
  recommendations.push("Consider advanced placement (AP) courses or certifications to further challenge yourself.");
} else if (inputData.average_test_score >= 85) {
  strengths.push("Strong academic performance.");
  recommendations.push("Maintain consistent study habits and explore in-depth learning resources.");
} else if (inputData.average_test_score >= 70) {
  weaknesses.push("Moderate academic performance.");
  recommendations.push("Focus on regular revision, active recall techniques, and peer study groups.");
} else {
  weaknesses.push("Needs significant improvement in academics.");
  recommendations.push("Develop a structured study plan, seek one-on-one tutoring, and target weak areas.");
}

// Attendance Rate
if (inputData.attendance_rate >= 98) {
  strengths.push("Nearly perfect attendance, demonstrating strong commitment and discipline.");
} else if (inputData.attendance_rate >= 90) {
  strengths.push("Excellent attendance rate.");
  recommendations.push("Sustain your attendance while balancing extracurricular and academic priorities.");
} else if (inputData.attendance_rate >= 75) {
  weaknesses.push("Inconsistent attendance.");
  recommendations.push("Identify barriers to attendance, such as time management or health issues, and address them proactively.");
} else {
  weaknesses.push("Low attendance rate.");
  recommendations.push("Develop a time management strategy and set goals to improve class participation.");
}

// Coding Skills
if (inputData.coding_skill_score >= 10) {
  strengths.push("Exceptional coding abilities with advanced proficiency.");
  recommendations.push("Participate in international hackathons or contribute to complex open-source projects.");
} else if (inputData.coding_skill_score >= 8) {
  strengths.push("Strong coding skills.");
  recommendations.push("Explore advanced topics like data structures, algorithms, or system design.");
} else if (inputData.coding_skill_score >= 6) {
  weaknesses.push("Moderate coding proficiency.");
  recommendations.push("Work on refining problem-solving skills and coding best practices.");
} else {
  weaknesses.push("Limited coding skills.");
  recommendations.push("Start with beginner-friendly courses and practice regularly on platforms like HackerRank or LeetCode.");
}

// Extracurricular Activities
if (inputData.extracurricular_score >= 9) {
  strengths.push("Exceptional involvement in extracurricular activities.");
  recommendations.push("Consider leadership roles in your extracurricular activities or starting new initiatives.");
} else if (inputData.extracurricular_score >= 7) {
  strengths.push("Strong participation in extracurricular activities.");
  recommendations.push("Diversify your extracurricular involvement to gain a broader range of experiences.");
} else if (inputData.extracurricular_score >= 5) {
  weaknesses.push("Moderate extracurricular involvement.");
  recommendations.push("Increase participation in extracurricular activities that align with your interests and career goals.");
} else {
  weaknesses.push("Limited extracurricular involvement.");
  recommendations.push("Explore and join clubs, sports teams, or volunteer organizations to enhance your extracurricular profile.");
}

// Communication Skills
if (inputData.communication_score >= 10) {
  strengths.push("Exceptional communication skills with professional fluency.");
  recommendations.push("Leverage this skill for public speaking engagements, leadership roles, or mentoring others.");
} else if (inputData.communication_score >= 8) {
  strengths.push("Strong communication skills.");
  recommendations.push("Engage in workshops or seminars to fine-tune your abilities.");
} else if (inputData.communication_score >= 6) {
  weaknesses.push("Moderate communication skills.");
  recommendations.push("Practice active listening and participate in group discussions or debates.");
} else {
  weaknesses.push("Needs significant improvement in communication.");
  recommendations.push("Focus on one-on-one interactions and consider joining a public speaking or debate club.");
}

// Leadership Skills
if (inputData.leadership_score >= 10) {
  strengths.push("Outstanding leadership qualities with proven success in leading teams.");
  recommendations.push("Pursue high-responsibility roles in organizations or projects.");
} else if (inputData.leadership_score >= 8) {
  strengths.push("Strong leadership potential.");
  recommendations.push("Take up initiatives that involve managing teams or resolving conflicts.");
} else if (inputData.leadership_score >= 6) {
  weaknesses.push("Moderate leadership abilities.");
  recommendations.push("Volunteer for small-scale leadership roles to build confidence and experience.");
} else {
  weaknesses.push("Limited leadership exposure.");
  recommendations.push("Participate in leadership development programs or take on informal leadership opportunities.");
}

// Internship Experience
if (inputData.internship_experience >= 8) {
  strengths.push("Extensive and diverse internship experience.");
  recommendations.push("Consider sharing insights through blogs or mentoring peers.");
} else if (inputData.internship_experience >= 5) {
  strengths.push("Strong internship experience.");
  recommendations.push("Focus on gaining expertise in a specific domain to enhance career prospects.");
} else if (inputData.internship_experience >= 2) {
  weaknesses.push("Limited internship experience.");
  recommendations.push("Apply for internships that align with your career interests.");
} else {
  weaknesses.push("No significant internship experience.");
  recommendations.push("Seek entry-level internships or volunteer work to build your resume.");
}

// Enhanced Prediction Score Calculation
const maxScores = {
  average_test_score: 100,
  attendance_rate: 100,
  extracurricular_score: 10,
  coding_skill_score: 10,
  communication_score: 10,
  leadership_score: 10,
  internship_experience: 10
};

const weights = {
  average_test_score: 0.30,
  attendance_rate: 0.10,
  extracurricular_score: 0.10,
  coding_skill_score: 0.15,
  communication_score: 0.15,
  leadership_score: 0.15,
  internship_experience: 0.05
};

const penalties = {
  lowAttendance: inputData.attendance_rate < 60 ? 5 : 0,
  lowCoding: inputData.coding_skill_score < 4 ? 5 : 0,
  lowLeadership: inputData.leadership_score < 4 ? 5 : 0
};

const rawScore = (
  (inputData.average_test_score / maxScores.average_test_score) * weights.average_test_score * 100 +
  (inputData.attendance_rate / maxScores.attendance_rate) * weights.attendance_rate * 100 +
  (inputData.extracurricular_score / maxScores.extracurricular_score) * weights.extracurricular_score * 100 +
  (inputData.coding_skill_score / maxScores.coding_skill_score) * weights.coding_skill_score * 100 +
  (inputData.communication_score / maxScores.communication_score) * weights.communication_score * 100 +
  (inputData.leadership_score / maxScores.leadership_score) * weights.leadership_score * 100 +
  (inputData.internship_experience / maxScores.internship_experience) * weights.internship_experience * 100
);

const predictionScore = (rawScore - penalties.lowAttendance - penalties.lowCoding - penalties.lowLeadership).toFixed(2);

return {
  predictionScore,
  strengths,
  weaknesses,
  recommendations
};


}

async function getEnhancedInsightsFromGroq(inputData: InputData, initialInsights: string) {
  try {
    const personalizedPrompt = `
Based on the following performance insights and user data, provide a personalized and actionable analysis:

**Initial Insights**:
${initialInsights}

**Additional User Information**:
- Age: ${inputData.age}
- Career Interest: ${inputData.career_interest || "Not specified"}

**Request**:
1. Analyze the strengths and how they can be strategically leveraged for success.
2. Provide actionable, specific recommendations for each area of improvement.
3. Suggest strategies to achieve academic and professional growth based on the user's goals.
4. Recommend career paths or industries where the user's profile aligns strongly.

**Format**:
- Use markdown headings for organization (e.g., ## Strengths, ## Recommendations).
- Include bullet points for clarity.
- End with a summary of potential next steps.
    `

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "user", content: personalizedPrompt }
      ],
      model: "llama-3.1-70b-versatile",
    })

    return chatCompletion.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Error in generating enhanced insights:', error)
    throw new Error('Failed to retrieve enhanced insights.')
  }
}


export async function POST(req: Request) {
  try {
    const inputData: InputData = await req.json()
    const initialInsights = generateInitialInsights(inputData)
    
    const initialInsightsString = `
Your Performance Insights
Predicted Performance Score: ${initialInsights.predictionScore}

Strengths:
${initialInsights.strengths.join('\n')}

Areas for Improvement:
${initialInsights.weaknesses.join('\n')}

Recommendations:
${initialInsights.recommendations.join('\n')}
`

    const enhancedInsights = await getEnhancedInsightsFromGroq(inputData, initialInsightsString)

    return NextResponse.json({ initialInsights, enhancedInsights })
  } catch (error) {
    console.error('Error in prediction:', error)
    return NextResponse.json({ error: 'Failed to process prediction' }, { status: 500 })
  }
}

