import { useState, useEffect } from 'react'

export function useTypingEffect(text: string, isTyping: boolean) {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    if (!isTyping) {
      setDisplayedText(text)
      return
    }

    let index = 0
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => {
        if (index < text.length) {
          index++
          return text.slice(0, index)
        }
        clearInterval(intervalId)
        return prev
      })
    }, 20) // Adjust typing speed here

    return () => clearInterval(intervalId)
  }, [text, isTyping])

  return displayedText
}

