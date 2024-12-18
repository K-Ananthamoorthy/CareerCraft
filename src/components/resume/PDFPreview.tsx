'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button' // or the appropriate library/file
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface PDFPreviewProps {
  file: File
}

export default function PDFPreview({ file }: PDFPreviewProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  return (
    <div className="pdf-preview">
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        className="flex justify-center"
      >
        <Page pageNumber={pageNumber} width={300} />
      </Document>
      <p className="mt-2 text-center">
        Page {pageNumber} of {numPages}
      </p>
      {numPages && numPages > 1 && (
        <div className="flex justify-center mt-2 space-x-2">
          <Button
            onClick={() => setPageNumber(page => Math.max(page - 1, 1))}
            disabled={pageNumber <= 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => setPageNumber(page => Math.min(page + 1, numPages || 1))}
            disabled={pageNumber >= (numPages || 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

