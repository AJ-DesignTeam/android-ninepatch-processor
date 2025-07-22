/**
 * 预览渲染器
 * 用于渲染.9图的拉伸预览效果
 */

/**
 * 预览渲染器类
 */
export class PreviewRenderer {
  /**
   * 渲染.9图预览
   * @param {NinePatchInfo} ninePatchInfo - .9图信息
   * @param {number} targetWidth - 目标宽度
   * @param {number} targetHeight - 目标高度
   * @param {HTMLCanvasElement} canvas - 目标画布
   * @returns {HTMLCanvasElement} 渲染后的画布
   */
  static renderPreview(ninePatchInfo, targetWidth, targetHeight, canvas) {
    if (!ninePatchInfo.isValid) {
      return this.renderError(canvas, '无效的.9图格式');
    }

    const ctx = canvas.getContext('2d');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    
    // 清空画布
    ctx.clearRect(0, 0, targetWidth, targetHeight);
    
    try {
      // 获取原始图片数据（去除边缘）
      const cleanImageData = this.getCleanImageData(ninePatchInfo);
      
      // 渲染九宫格
      this.renderNineGrid(ctx, cleanImageData, ninePatchInfo, targetWidth, targetHeight);
      
      return canvas;
    } catch (error) {
      console.error('渲染预览失败:', error);
      return this.renderError(canvas, '渲染失败: ' + error.message);
    }
  }

  /**
   * 渲染带文本的预览
   * @param {NinePatchInfo} ninePatchInfo - .9图信息
   * @param {string} text - 文本内容
   * @param {HTMLCanvasElement} canvas - 目标画布
   * @returns {HTMLCanvasElement} 渲染后的画布
   */
  static renderWithText(ninePatchInfo, text, canvas) {
    if (!ninePatchInfo.isValid) {
      return this.renderError(canvas, '无效的.9图格式');
    }

    const ctx = canvas.getContext('2d');
    
    // 计算文本尺寸
    ctx.font = '14px Arial';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = 16; // 估算文本高度
    
    // 计算所需的画布尺寸
    const padding = ninePatchInfo.paddingBox;
    const minWidth = textWidth + padding.left + padding.right + 20;
    const fixedHeight = 128; // 固定高度为128px
    
    // 渲染背景
    this.renderPreview(ninePatchInfo, minWidth, fixedHeight, canvas);
    
    // 渲染文本
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    const textX = padding.left + 10;
    const textY = padding.top + 5;
    ctx.fillText(text, textX, textY);
    
    return canvas;
  }

  /**
   * 显示拉伸区域
   * @param {NinePatchInfo} ninePatchInfo - .9图信息
   * @param {HTMLCanvasElement} canvas - 目标画布
   * @returns {HTMLCanvasElement} 渲染后的画布
   */
  static showStretchRegions(ninePatchInfo, canvas) {
    const { width, height } = ninePatchInfo.imageData;
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    
    // 绘制原始图片
    ctx.putImageData(ninePatchInfo.imageData, 0, 0);
    
    // 高亮拉伸区域
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
    
    // 高亮水平拉伸区域
    ninePatchInfo.stretchRegionsX.forEach(region => {
      for (let y = 1; y < height - 1; y++) {
        ctx.fillRect(region.start + 1, y, region.end - region.start + 1, 1);
      }
    });
    
    // 高亮垂直拉伸区域
    ninePatchInfo.stretchRegionsY.forEach(region => {
      for (let x = 1; x < width - 1; x++) {
        ctx.fillRect(x, region.start + 1, 1, region.end - region.start + 1);
      }
    });
    
    // 高亮内容区域
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    const content = ninePatchInfo.contentRegion;
    ctx.strokeRect(content.left + 1, content.top + 1, 
                  content.right - content.left, content.bottom - content.top);
    
    return canvas;
  }

  /**
   * 获取清理后的图片数据（去除边缘）
   * @param {NinePatchInfo} ninePatchInfo - .9图信息
   * @returns {ImageData} 清理后的图片数据
   */
  static getCleanImageData(ninePatchInfo) {
    const { width, height, data } = ninePatchInfo.imageData;
    const cleanWidth = width - 2;
    const cleanHeight = height - 2;
    
    // 创建临时画布
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = cleanWidth;
    tempCanvas.height = cleanHeight;
    const tempCtx = tempCanvas.getContext('2d');
    
    const cleanImageData = tempCtx.createImageData(cleanWidth, cleanHeight);
    const cleanData = cleanImageData.data;
    
    // 复制像素数据（跳过边缘）
    for (let y = 0; y < cleanHeight; y++) {
      for (let x = 0; x < cleanWidth; x++) {
        const oldIndex = ((y + 1) * width + (x + 1)) * 4;
        const newIndex = (y * cleanWidth + x) * 4;
        
        cleanData[newIndex] = data[oldIndex];         // R
        cleanData[newIndex + 1] = data[oldIndex + 1]; // G
        cleanData[newIndex + 2] = data[oldIndex + 2]; // B
        cleanData[newIndex + 3] = data[oldIndex + 3]; // A
      }
    }
    
    return cleanImageData;
  }

  /**
   * 渲染九宫格
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   * @param {ImageData} cleanImageData - 清理后的图片数据
   * @param {NinePatchInfo} ninePatchInfo - .9图信息
   * @param {number} targetWidth - 目标宽度
   * @param {number} targetHeight - 目标高度
   */
  static renderNineGrid(ctx, cleanImageData, ninePatchInfo, targetWidth, targetHeight) {
    const sourceWidth = cleanImageData.width;
    const sourceHeight = cleanImageData.height;
    
    // 创建临时画布用于绘制源图片
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sourceWidth;
    tempCanvas.height = sourceHeight;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.putImageData(cleanImageData, 0, 0);
    
    // 计算九宫格区域
    const regions = this.calculateNineGridRegions(
      ninePatchInfo, sourceWidth, sourceHeight, targetWidth, targetHeight
    );
    
    // 渲染每个区域
    regions.forEach(region => {
      if (region.sourceWidth > 0 && region.sourceHeight > 0 && 
          region.targetWidth > 0 && region.targetHeight > 0) {
        ctx.drawImage(
          tempCanvas,
          region.sourceX, region.sourceY, region.sourceWidth, region.sourceHeight,
          region.targetX, region.targetY, region.targetWidth, region.targetHeight
        );
      }
    });
  }

  /**
   * 计算九宫格区域
   * @param {NinePatchInfo} ninePatchInfo - .9图信息
   * @param {number} sourceWidth - 源图片宽度
   * @param {number} sourceHeight - 源图片高度
   * @param {number} targetWidth - 目标宽度
   * @param {number} targetHeight - 目标高度
   * @returns {Array} 区域数组
   */
  static calculateNineGridRegions(ninePatchInfo, sourceWidth, sourceHeight, targetWidth, targetHeight) {
    const regions = [];
    
    // 获取拉伸区域
    const xRegions = this.getRegionBoundaries(ninePatchInfo.stretchRegionsX, sourceWidth);
    const yRegions = this.getRegionBoundaries(ninePatchInfo.stretchRegionsY, sourceHeight);
    
    // 计算目标尺寸分配
    const xTargetSizes = this.calculateTargetSizes(xRegions, targetWidth);
    const yTargetSizes = this.calculateTargetSizes(yRegions, targetHeight);
    
    // 生成九宫格区域
    let targetY = 0;
    for (let row = 0; row < yRegions.length; row++) {
      let targetX = 0;
      for (let col = 0; col < xRegions.length; col++) {
        regions.push({
          sourceX: xRegions[col].start,
          sourceY: yRegions[row].start,
          sourceWidth: xRegions[col].end - xRegions[col].start,
          sourceHeight: yRegions[row].end - yRegions[row].start,
          targetX: targetX,
          targetY: targetY,
          targetWidth: xTargetSizes[col],
          targetHeight: yTargetSizes[row]
        });
        targetX += xTargetSizes[col];
      }
      targetY += yTargetSizes[row];
    }
    
    return regions;
  }

  /**
   * 获取区域边界
   * @param {Array} stretchRegions - 拉伸区域数组
   * @param {number} totalSize - 总尺寸
   * @returns {Array} 区域边界数组
   */
  static getRegionBoundaries(stretchRegions, totalSize) {
    const boundaries = [];
    let currentPos = 0;
    
    stretchRegions.forEach(region => {
      // 添加静态区域（如果存在）
      if (currentPos < region.start) {
        boundaries.push({
          start: currentPos,
          end: region.start,
          stretchable: false
        });
      }
      
      // 添加拉伸区域
      boundaries.push({
        start: region.start,
        end: region.end + 1,
        stretchable: true
      });
      
      currentPos = region.end + 1;
    });
    
    // 添加最后的静态区域（如果存在）
    if (currentPos < totalSize) {
      boundaries.push({
        start: currentPos,
        end: totalSize,
        stretchable: false
      });
    }
    
    return boundaries;
  }

  /**
   * 计算目标尺寸分配
   * @param {Array} regions - 区域数组
   * @param {number} targetSize - 目标总尺寸
   * @returns {Array} 目标尺寸数组
   */
  static calculateTargetSizes(regions, targetSize) {
    const sizes = [];
    let staticSize = 0;
    let stretchableCount = 0;
    
    // 计算静态区域总尺寸和可拉伸区域数量
    regions.forEach(region => {
      const regionSize = region.end - region.start;
      if (region.stretchable) {
        stretchableCount++;
      } else {
        staticSize += regionSize;
      }
    });
    
    // 计算可拉伸区域的可用空间
    const availableSpace = Math.max(0, targetSize - staticSize);
    const stretchableSize = stretchableCount > 0 ? availableSpace / stretchableCount : 0;
    
    // 分配尺寸
    regions.forEach(region => {
      if (region.stretchable) {
        sizes.push(Math.max(1, Math.floor(stretchableSize)));
      } else {
        sizes.push(region.end - region.start);
      }
    });
    
    return sizes;
  }

  /**
   * 渲染错误信息
   * @param {HTMLCanvasElement} canvas - 画布
   * @param {string} message - 错误信息
   * @returns {HTMLCanvasElement} 画布
   */
  static renderError(canvas, message) {
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 100;
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制错误背景
    ctx.fillStyle = '#ffebee';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制边框
    ctx.strokeStyle = '#f44336';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
    
    // 绘制错误文本
    ctx.fillStyle = '#d32f2f';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    
    return canvas;
  }
}

