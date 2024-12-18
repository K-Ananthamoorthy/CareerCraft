import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileIcon, ImageIcon, Upload } from 'lucide-react'

interface FileUploaderProps {
  onFileChange: (file: File | null) => void
}

export default function FileUploader({ onFileChange }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0]
    onFileChange(uploadedFile)
  }, [onFileChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center">
        <Upload className="w-12 h-12 mb-3 text-gray-400" />
        <p className="text-gray-500">
          {isDragActive
            ? "Drop the file here"
            : "Drag 'n' drop a PDF or image file here, or click to select a file"}
        </p>
        <div className="flex mt-2 space-x-2">
          <FileIcon className="text-gray-400" />
          <ImageIcon className="text-gray-400" />
        </div>
      </div>
    </div>
  )
}

