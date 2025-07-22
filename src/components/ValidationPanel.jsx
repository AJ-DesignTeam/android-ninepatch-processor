import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Progress } from '@/components/ui/progress.jsx'

export function ValidationPanel({ ninePatchInfo }) {
  if (!ninePatchInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>格式验证</CardTitle>
          <CardDescription>
            请先上传.9图文件进行验证
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <Info className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>等待文件上传...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const validationScore = calculateValidationScore(ninePatchInfo)
  const recommendations = getRecommendations(ninePatchInfo)

  return (
    <div className="space-y-6">
      {/* 验证结果概览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {ninePatchInfo.isValid ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <span>格式验证结果</span>
          </CardTitle>
          <CardDescription>
            检查.9图格式是否符合Android规范
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant={ninePatchInfo.isValid ? "default" : "destructive"}>
            {ninePatchInfo.isValid ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {ninePatchInfo.isValid ? 
                ".9图格式验证通过，可以正常使用" : 
                `发现 ${ninePatchInfo.errors.length} 个格式问题，请修复后重新上传`
              }
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">验证得分</span>
            <Badge variant={validationScore >= 80 ? "default" : validationScore >= 60 ? "secondary" : "destructive"}>
              {validationScore}/100
            </Badge>
          </div>
          <Progress value={validationScore} className="w-full" />
        </CardContent>
      </Card>

      {/* 错误详情 */}
      {ninePatchInfo.errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span>发现的问题</span>
            </CardTitle>
            <CardDescription>
              以下问题需要修复才能正常使用
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ninePatchInfo.errors.map((error, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-red-800 font-medium">{error}</p>
                    <p className="text-xs text-red-600 mt-1">
                      {getErrorSolution(error)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 详细信息 */}
      <Card>
        <CardHeader>
          <CardTitle>详细信息</CardTitle>
          <CardDescription>
            .9图的结构和属性信息
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 基本信息 */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">基本信息</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">图片尺寸:</span>
                  <span>{ninePatchInfo.imageData.width} × {ninePatchInfo.imageData.height}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">内容区域:</span>
                  <span>
                    {ninePatchInfo.imageData.width - 2} × {ninePatchInfo.imageData.height - 2}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">格式状态:</span>
                  <Badge variant={ninePatchInfo.isValid ? "default" : "destructive"}>
                    {ninePatchInfo.isValid ? "有效" : "无效"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* 拉伸区域信息 */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">拉伸区域</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">水平拉伸区域:</span>
                  <span>{ninePatchInfo.stretchRegionsX.length} 个</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">垂直拉伸区域:</span>
                  <span>{ninePatchInfo.stretchRegionsY.length} 个</span>
                </div>
                {ninePatchInfo.stretchRegionsX.length > 0 && (
                  <div className="text-xs text-gray-500">
                    水平: {ninePatchInfo.stretchRegionsX.map(r => `${r.start}-${r.end}`).join(', ')}
                  </div>
                )}
                {ninePatchInfo.stretchRegionsY.length > 0 && (
                  <div className="text-xs text-gray-500">
                    垂直: {ninePatchInfo.stretchRegionsY.map(r => `${r.start}-${r.end}`).join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* 内容区域和Padding */}
          {ninePatchInfo.contentRegion && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">内容区域和Padding</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-gray-600">左</div>
                  <div className="font-medium">{ninePatchInfo.contentRegion.left}px</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-gray-600">上</div>
                  <div className="font-medium">{ninePatchInfo.contentRegion.top}px</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-gray-600">右</div>
                  <div className="font-medium">{ninePatchInfo.contentRegion.right}px</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-gray-600">下</div>
                  <div className="font-medium">{ninePatchInfo.contentRegion.bottom}px</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 建议和提示 */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-blue-600" />
              <span>优化建议</span>
            </CardTitle>
            <CardDescription>
              以下建议可以帮助您创建更好的.9图
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// 计算验证得分
function calculateValidationScore(ninePatchInfo) {
  let score = 0
  
  // 基础格式检查 (40分)
  if (ninePatchInfo.stretchRegionsX.length > 0) score += 20
  if (ninePatchInfo.stretchRegionsY.length > 0) score += 20
  
  // 错误扣分 (每个错误扣10分)
  score -= ninePatchInfo.errors.length * 10
  
  // 内容区域检查 (20分)
  if (ninePatchInfo.contentRegion) score += 20
  
  // 拉伸区域合理性 (20分)
  if (ninePatchInfo.stretchRegionsX.length <= 3 && ninePatchInfo.stretchRegionsY.length <= 3) {
    score += 20
  }
  
  return Math.max(0, Math.min(100, score))
}

// 获取错误解决方案
function getErrorSolution(error) {
  const solutions = {
    '缺少水平拉伸区域标记（顶部边缘）': '在图片顶部边缘添加黑色像素标记水平拉伸区域',
    '缺少垂直拉伸区域标记（左侧边缘）': '在图片左侧边缘添加黑色像素标记垂直拉伸区域',
    '图片尺寸太小，至少需要3x3像素': '增加图片尺寸，确保至少为3x3像素',
    '左上角必须为透明像素': '将图片左上角像素设置为透明',
    '右上角必须为透明像素': '将图片右上角像素设置为透明',
    '左下角必须为透明像素': '将图片左下角像素设置为透明',
    '右下角必须为透明像素': '将图片右下角像素设置为透明'
  }
  
  return solutions[error] || '请检查.9图制作规范'
}

// 获取优化建议
function getRecommendations(ninePatchInfo) {
  const recommendations = []
  
  if (ninePatchInfo.stretchRegionsX.length > 3) {
    recommendations.push('水平拉伸区域过多，建议简化为1-3个区域以提高性能')
  }
  
  if (ninePatchInfo.stretchRegionsY.length > 3) {
    recommendations.push('垂直拉伸区域过多，建议简化为1-3个区域以提高性能')
  }
  
  if (ninePatchInfo.imageData.width > 100 || ninePatchInfo.imageData.height > 100) {
    recommendations.push('图片尺寸较大，建议优化图片大小以减少内存占用')
  }
  
  if (ninePatchInfo.stretchRegionsX.length === 0 || ninePatchInfo.stretchRegionsY.length === 0) {
    recommendations.push('建议同时定义水平和垂直拉伸区域以获得最佳效果')
  }
  
  return recommendations
}

