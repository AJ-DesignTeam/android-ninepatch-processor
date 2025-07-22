import { useCallback, useRef } from 'react'
import { Upload, FileImage } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'

export function FileUploader({ onFileSelect, isProcessing, className = "" }) {
  const fileInputRef = useRef(null)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        onFileSelect(file)
      } else {
        alert('请选择图片文件')
      }
    }
  }, [onFileSelect])

  const handleFileInputChange = useCallback((e) => {
    const file = e.target.files[0]
    if (file) {
      onFileSelect(file)
    }
  }, [onFileSelect])

  const handleClick = useCallback(() => {
    if (!isProcessing) {
      fileInputRef.current?.click()
    }
  }, [isProcessing])

  return (
    <div
      className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpg,image/jpeg"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isProcessing}
      />
      
      <div className="flex flex-col items-center space-y-4">
        {isProcessing ? (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        ) : (
          <Upload className="h-12 w-12 text-gray-400" />
        )}
        
        <div>
          <p className="text-lg font-medium text-gray-900 mb-2">
            {isProcessing ? '正在处理文件...' : '拖拽文件到此处或点击选择'}
          </p>
          <p className="text-sm text-gray-600">
            支持 PNG 格式，最大 10MB
          </p>
        </div>
        
        {!isProcessing && (
          <Button variant="outline" className="mt-4">
            <FileImage className="h-4 w-4 mr-2" />
            选择文件
          </Button>
        )}
      </div>
    </div>
  )
}

