import { NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'

export async function POST(req: Request) {
  const inputData = await req.json()

  return new Promise((resolve) => {
    const pythonScriptPath = path.join(process.cwd(), 'lib', 'ml_model.py')
    const pythonProcess = spawn('python', [pythonScriptPath])
    let result = ''
    let errorOutput = ''

    pythonProcess.stdin.write(JSON.stringify(inputData))
    pythonProcess.stdin.end()

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString()
    })

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python script error:', errorOutput)
        resolve(NextResponse.json({ error: 'Prediction failed', details: errorOutput }, { status: 500 }))
      } else {
        try {
          const parsedResult = JSON.parse(result)
          resolve(NextResponse.json(parsedResult))
        } catch (error) {
          console.error('Failed to parse prediction result:', error)
          const errorMessage = (error as Error).message
          resolve(NextResponse.json({ error: 'Failed to parse prediction result', details: errorMessage }, { status: 500 }))
        }
      }
    })
  })
}

