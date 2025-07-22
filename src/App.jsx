import { useState, useRef, useCallback } from 'react'
import { Download, FileImage, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'

import { FileUploader } from './components/FileUploader.jsx'
import { PreviewPanel } from './components/PreviewPanel.jsx'
import { ValidationPanel } from './components/ValidationPanel.jsx'
import { NinePatchProcessor } from './lib/ninePatchProcessor.js'
import { PNGParser } from './lib/pngParser.js'
import './App.css'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [ninePatchInfo, setNinePatchInfo] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState('upload')
  
  const originalCanvasRef = useRef(null)

  // 处理文件上传
  const handleFileUpload = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('请选择有效的图片文件')
      return
    }

    setIsProcessing(true)
    setSelectedFile(file)
    setNinePatchInfo(null)

    try {
      // 创建图片元素
      const img = new Image()
      img.onload = async () => {
        try {
          // 解析.9图
          const canvas = originalCanvasRef.current
          const ninePatch = await NinePatchProcessor.parseSourceNinePatch(img, canvas)
          setNinePatchInfo(ninePatch)
          
          // 自动切换到相应标签
          if (ninePatch.isValid) {
            setActiveTab('preview')
          } else {
            setActiveTab('validation')
          }
        } catch (error) {
          console.error('解析.9图失败:', error)
          alert('解析.9图失败: ' + error.message)
        } finally {
          setIsProcessing(false)
        }
      }
      
      img.onerror = () => {
        alert('无法加载图片文件')
        setIsProcessing(false)
      }
      
      img.src = URL.createObjectURL(file)
    } catch (error) {
      console.error('处理文件失败:', error)
      alert('处理文件失败: ' + error.message)
      setIsProcessing(false)
    }
  }, [])

  // 下载编译后的.9图
  const handleDownload = useCallback(async () => {
    if (!ninePatchInfo || !ninePatchInfo.isValid) {
      alert('请先上传有效的.9图文件')
      return
    }

    try {
      // 编译.9图
      const compiled = NinePatchProcessor.compileToAAP(ninePatchInfo)
      
      // 使用编译后的PNG数据（包含npTc chunk）
      const blob = new Blob([compiled.compiledPNG], { type: 'image/png' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = selectedFile.name.replace(/\.(png|jpg|jpeg)$/i, '.9.png')
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('下载失败:', error)
      alert('下载失败: ' + error.message)
    }
  }, [ninePatchInfo, selectedFile])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 头部 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FileImage className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">.9图预处理工具</h1>
                <p className="text-sm text-gray-600">Android NinePatch 图片处理和编译工具</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Zap className="h-3 w-3 mr-1" />
                在线处理
              </Badge>
              {ninePatchInfo && ninePatchInfo.isValid && (
                <Button onClick={handleDownload} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  下载编译后的文件
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <FileImage className="h-4 w-4" />
              <span>上传文件</span>
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={!ninePatchInfo || !ninePatchInfo.isValid}>
              <span>预览效果</span>
            </TabsTrigger>
            <TabsTrigger value="validation" disabled={!ninePatchInfo}>
              <span>格式验证</span>
            </TabsTrigger>
          </TabsList>

          {/* 文件上传标签页 */}
          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>上传.9图文件</CardTitle>
                <CardDescription>
                  支持PNG格式的.9图文件，工具将自动解析拉伸区域标记并进行格式验证
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader 
                  onFileSelect={handleFileUpload}
                  isProcessing={isProcessing}
                />

                {selectedFile && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-sm text-gray-600">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      {ninePatchInfo && (
                        <Badge variant={ninePatchInfo.isValid ? "default" : "destructive"}>
                          {ninePatchInfo.isValid ? "格式正确" : "格式错误"}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 原始图片预览 */}
            {selectedFile && (
              <Card>
                <CardHeader>
                  <CardTitle>原始图片预览</CardTitle>
                  <CardDescription>
                    显示上传的原始.9图文件
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                    <canvas
                      ref={originalCanvasRef}
                      className="border border-gray-200 rounded-lg max-w-full h-auto"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 快速操作 */}
            {ninePatchInfo && (
              <Card>
                <CardHeader>
                  <CardTitle>快速操作</CardTitle>
                  <CardDescription>
                    根据验证结果选择下一步操作
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {ninePatchInfo.isValid ? (
                      <>
                        <Button 
                          onClick={() => setActiveTab('preview')}
                          className="flex-1 min-w-[200px]"
                        >
                          查看预览效果
                        </Button>
                        <Button 
                          onClick={handleDownload}
                          variant="outline"
                          className="flex-1 min-w-[200px]"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          下载编译文件
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={() => setActiveTab('validation')}
                        variant="destructive"
                        className="flex-1 min-w-[200px]"
                      >
                        查看验证结果
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 预览效果标签页 */}
          <TabsContent value="preview">
            <PreviewPanel ninePatchInfo={ninePatchInfo} />
          </TabsContent>

          {/* 格式验证标签页 */}
          <TabsContent value="validation">
            <ValidationPanel ninePatchInfo={ninePatchInfo} />
          </TabsContent>
        </Tabs>

        {/* 使用说明 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
            <CardDescription>
              了解如何使用.9图预处理工具
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-2">什么是.9图？</h4>
                <p className="text-sm text-gray-600">
                  .9图（NinePatch）是Android开发中使用的一种特殊PNG图片格式，
                  通过在图片边缘添加黑色像素标记来定义可拉伸区域和内容区域。
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">如何制作.9图？</h4>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  <li>在图片的顶部和左侧边缘添加黑色像素标记拉伸区域</li>
                  <li>在图片的底部和右侧边缘添加黑色像素标记内容区域</li>
                  <li>四个角必须为透明像素</li>
                  <li>文件名必须以.9.png结尾</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">工具功能</h4>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  <li>自动解析.9图的拉伸区域标记</li>
                  <li>实时预览不同尺寸下的拉伸效果</li>
                  <li>支持文本内容预览</li>
                  <li>格式验证和错误检测</li>
                  <li>编译为Android系统可识别的格式</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default App

