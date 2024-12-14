import { NextRequest, NextResponse } from 'next/server'
import { Groq } from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

export async function POST(req: NextRequest) {
  try {
    const { messages, pdfContent } = await req.json()

    const contextMessage = `The following is the content of a PDF document: ${pdfContent}\n\nPlease answer the user's question based on this content.`

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: contextMessage },
        ...messages
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 1000,
    })

    return NextResponse.json(chatCompletion.choices[0].message)
  } catch (error) {
    console.error('Error in PDF chat route:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

