export async function generateCertificate(
    canvas: HTMLCanvasElement,
    userName: string,
    avatarUrl: string,
    courseName: string,
    issueDate: string,
    engineeringBranch: string
  ): Promise<void> {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
  
    // Set canvas size (A4 dimensions at 300 DPI for high quality)
    canvas.width = 3508 // 11.7 inches * 300 DPI
    canvas.height = 2480 // 8.3 inches * 300 DPI
  
    // Set white background
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  
    // Load and draw border
    const borderImage = new Image()
    borderImage.crossOrigin = "anonymous"
    await new Promise((resolve) => {
      borderImage.onload = resolve
      borderImage.src = '/certificate-border.png' // Replace with your actual border image
    })
    ctx.drawImage(borderImage, 0, 0, canvas.width, canvas.height)
  
    // Configure text styles
    ctx.textAlign = 'center'
    ctx.fillStyle = '#000'
  
    // Draw main heading
    ctx.font = 'bold 120px "Inter", sans-serif'
    ctx.fillText('Certificate of Completion', canvas.width / 2, 300)
  
    // Draw "This is to certify that"
    ctx.font = '64px "Inter", sans-serif'
    ctx.fillText('This is to certify that', canvas.width / 2, 500)
  
    // Draw student name
    ctx.font = 'bold 96px "Inter", sans-serif'
    ctx.fillText(userName, canvas.width / 2, 650)
  
    // Draw engineering branch
    ctx.font = '64px "Inter", sans-serif'
    ctx.fillText(engineeringBranch, canvas.width / 2, 750)
  
    // Draw "has successfully completed the course"
    ctx.font = '64px "Inter", sans-serif'
    ctx.fillText('has successfully completed the course', canvas.width / 2, 900)
  
    // Draw course name
    ctx.font = 'bold 96px "Inter", sans-serif'
    ctx.fillText(courseName, canvas.width / 2, 1050)
  
    // Draw issue date
    ctx.font = '64px "Inter", sans-serif'
    ctx.fillText(`Issued on: ${issueDate}`, canvas.width / 2, 1200)
  
    // Load and draw avatar
    const avatarImage = new Image()
    avatarImage.crossOrigin = "anonymous"
    await new Promise((resolve) => {
      avatarImage.onload = resolve
      avatarImage.src = avatarUrl || '/default-avatar.png' // Replace with your default avatar image
    })
    ctx.save()
    ctx.beginPath()
    ctx.arc(canvas.width / 2, 1400, 150, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(avatarImage, canvas.width / 2 - 150, 1250, 300, 300)
    ctx.restore()
  
    // Load and draw digital signature
    const signatureImage = new Image()
    signatureImage.crossOrigin = "anonymous"
    await new Promise((resolve) => {
      signatureImage.onload = resolve
      signatureImage.src = '/digital-signature.png' // Replace with your actual signature image
    })
    ctx.drawImage(signatureImage, canvas.width / 2 - 150, 1600, 300, 100)
  
    // Draw signature line
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2 - 200, 1750)
    ctx.lineTo(canvas.width / 2 + 200, 1750)
    ctx.stroke()
  
    // Draw signature text
    ctx.font = '48px "Inter", sans-serif'
    ctx.fillText('Authorized Signature', canvas.width / 2, 1800)
  
    // Draw note at bottom
    ctx.font = 'italic 40px "Inter", sans-serif'
    ctx.fillText('This certificate is proudly presented for outstanding achievement and dedication.', canvas.width / 2, 2300)
    ctx.fillText('May it serve as a testament to your hard work and commitment to excellence.', canvas.width / 2, 2350)
  }
  
  