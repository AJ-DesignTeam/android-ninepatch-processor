import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { PreviewRenderer } from '../lib/previewRenderer.js'

export function PreviewPanel({ ninePatchInfo }) {
  const [previewText, setPreviewText] = useState('Hello World!')
  const [previewWidth, setPreviewWidth] = useState(132)
  const [previewHeight, setPreviewHeight] = useState(128)
  
  const stretchCanvasRef = useRef(null)
  const previewCanvasRef = useRef(null)
  const textCanvasRef = useRef(null)

  // 更新预览
  useEffect(() => {
    if (!ninePatchInfo || !ninePatchInfo.isValid) return

    try {
      // 渲染拉伸区域预览
      if (stretchCanvasRef.current) {
        PreviewRenderer.showStretchRegions(ninePatchInfo, stretchCanvasRef.current)
      }

      // 渲染尺寸预览
      if (previewCanvasRef.current) {
        PreviewRenderer.renderPreview(ninePatchInfo, previewWidth, previewHeight, previewCanvasRef.current)
      }

      // 渲染文本预览
      if (textCanvasRef.current && previewText) {
        PreviewRenderer.renderWithText(ninePatchInfo, previewText, textCanvasRef.current)
      }
    } catch (error) {
      console.error('更新预览失败:', error)
    }
  }, [ninePatchInfo, previewWidth, previewHeight, previewText])

  if (!ninePatchInfo) {
    return (
      <div className="text-center text-gray-500 py-8">
        请先上传.9图文件
      </div>
    )
  }

  if (!ninePatchInfo.isValid) {
    return (
      <div className="text-center text-red-500 py-8">
        .9图格式无效，请检查文件格式
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 拉伸区域显示 */}
      <Card>
        <CardHeader>
          <CardTitle>拉伸区域标记</CardTitle>
          <CardDescription>
            红色区域为可拉伸区域，绿色虚线为内容区域
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
            <canvas
              ref={stretchCanvasRef}
              className="border border-gray-200 rounded-lg max-w-full h-auto"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        </CardContent>
      </Card>

      {/* 尺寸预览 */}
      <Card>
        <CardHeader>
          <CardTitle>尺寸预览</CardTitle>
          <CardDescription>
            调整尺寸查看拉伸效果
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">宽度: {previewWidth}px</Label>
              <Slider
                id="width"
                min={50}
                max={500}
                step={10}
                value={[previewWidth]}
                onValueChange={(value) => setPreviewWidth(value[0])}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">高度: {previewHeight}px</Label>
              <Slider
                id="height"
                min={30}
                max={300}
                step={5}
                value={[previewHeight]}
                onValueChange={(value) => setPreviewHeight(value[0])}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
            <canvas
              ref={previewCanvasRef}
              className="border border-gray-200 rounded-lg"
            />
          </div>
          
          <div className="flex justify-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setPreviewWidth(150)
                setPreviewHeight(80)
              }}
            >
              小尺寸
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setPreviewWidth(250)
                setPreviewHeight(120)
              }}
            >
              中尺寸
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setPreviewWidth(350)
                setPreviewHeight(160)
              }}
            >
              大尺寸
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 文本预览 */}
      <Card>
        <CardHeader>
          <CardTitle>文本预览</CardTitle>
          <CardDescription>
            输入文本查看.9图作为背景的效果
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <div>
            <Label htmlFor="previewText">预览文本</Label>
            <Textarea
              id="previewText"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              placeholder="输入要预览的文本内容..."
              rows={3}
              className="mt-2"
            />
          </div>
          
          <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
            <canvas
              ref={textCanvasRef}
              className="border border-gray-200 rounded-lg"
            />
          </div>
          
          <div className="flex justify-center space-x-2 flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setPreviewText('Hello World!')}
            >
              示例1
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setPreviewText('这是一个很长的文本内容，用来测试.9图的拉伸效果。')}
            >
              示例2
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setPreviewText('按钮')}
            >
              示例3
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

