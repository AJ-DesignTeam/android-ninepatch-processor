/**
 * PNG文件解析器
 * 用于解析PNG文件结构，提取chunk数据
 */

// PNG文件签名
const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];

/**
 * PNG Chunk结构
 */
class PNGChunk {
  constructor(length, type, data, crc) {
    this.length = length;
    this.type = type;
    this.data = data;
    this.crc = crc;
  }
}

/**
 * PNG解析器类
 */
export class PNGParser {
  /**
   * 解析PNG文件
   * @param {File} file - PNG文件
   * @returns {Promise<Object>} 解析结果
   */
  static async parseFile(file) {
    const buffer = await file.arrayBuffer();
    return this.parseBuffer(buffer);
  }

  /**
   * 解析PNG缓冲区
   * @param {ArrayBuffer} buffer - PNG数据缓冲区
   * @returns {Object} 解析结果
   */
  static parseBuffer(buffer) {
    const view = new DataView(buffer);
    
    // 验证PNG签名
    if (!this.validateSignature(view)) {
      throw new Error('无效的PNG文件格式');
    }

    // 解析所有chunks
    const chunks = this.parseChunks(view);
    
    // 查找关键chunks
    const ihdr = chunks.find(chunk => chunk.type === 'IHDR');
    const npTc = chunks.find(chunk => chunk.type === 'npTc');
    
    if (!ihdr) {
      throw new Error('缺少IHDR chunk');
    }

    // 解析IHDR获取图片信息
    const imageInfo = this.parseIHDR(ihdr.data);

    return {
      imageInfo,
      chunks,
      ninePatchChunk: npTc,
      isNinePatch: !!npTc,
      buffer
    };
  }

  /**
   * 验证PNG文件签名
   * @param {DataView} view - 数据视图
   * @returns {boolean} 是否为有效PNG
   */
  static validateSignature(view) {
    for (let i = 0; i < PNG_SIGNATURE.length; i++) {
      if (view.getUint8(i) !== PNG_SIGNATURE[i]) {
        return false;
      }
    }
    return true;
  }

  /**
   * 解析PNG chunks
   * @param {DataView} view - 数据视图
   * @returns {Array<PNGChunk>} chunks数组
   */
  static parseChunks(view) {
    const chunks = [];
    let offset = 8; // 跳过PNG签名

    while (offset < view.byteLength) {
      // 读取chunk长度
      const length = view.getUint32(offset);
      offset += 4;

      // 读取chunk类型
      const typeBytes = new Uint8Array(view.buffer, offset, 4);
      const type = String.fromCharCode(...typeBytes);
      offset += 4;

      // 读取chunk数据
      const data = new Uint8Array(view.buffer, offset, length);
      offset += length;

      // 读取CRC
      const crc = view.getUint32(offset);
      offset += 4;

      chunks.push(new PNGChunk(length, type, data, crc));

      // 如果遇到IEND chunk，停止解析
      if (type === 'IEND') {
        break;
      }
    }

    return chunks;
  }

  /**
   * 解析IHDR chunk获取图片信息
   * @param {Uint8Array} data - IHDR数据
   * @returns {Object} 图片信息
   */
  static parseIHDR(data) {
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    
    return {
      width: view.getUint32(0),
      height: view.getUint32(4),
      bitDepth: view.getUint8(8),
      colorType: view.getUint8(9),
      compressionMethod: view.getUint8(10),
      filterMethod: view.getUint8(11),
      interlaceMethod: view.getUint8(12)
    };
  }

  /**
   * 创建新的PNG文件
   * @param {Uint8Array} imageData - 图片数据
   * @param {Array<PNGChunk>} chunks - chunks数组
   * @returns {Uint8Array} 新的PNG文件数据
   */
  static createPNG(imageData, chunks) {
    const buffers = [];
    
    // 添加PNG签名
    buffers.push(new Uint8Array(PNG_SIGNATURE));
    
    // 添加所有chunks
    chunks.forEach(chunk => {
      // 长度
      const lengthBuffer = new ArrayBuffer(4);
      new DataView(lengthBuffer).setUint32(0, chunk.length);
      buffers.push(new Uint8Array(lengthBuffer));
      
      // 类型
      const typeBuffer = new TextEncoder().encode(chunk.type);
      buffers.push(typeBuffer);
      
      // 数据
      buffers.push(chunk.data);
      
      // CRC
      const crcBuffer = new ArrayBuffer(4);
      new DataView(crcBuffer).setUint32(0, chunk.crc);
      buffers.push(new Uint8Array(crcBuffer));
    });

    // 合并所有缓冲区
    const totalLength = buffers.reduce((sum, buf) => sum + buf.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    
    buffers.forEach(buf => {
      result.set(buf, offset);
      offset += buf.length;
    });

    return result;
  }

  /**
   * 计算CRC32校验码
   * @param {Uint8Array} data - 数据
   * @returns {number} CRC32值
   */
  static calculateCRC32(data) {
    // 简化的CRC32实现
    let crc = 0xFFFFFFFF;
    
    for (let i = 0; i < data.length; i++) {
      crc ^= data[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
      }
    }
    
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }
}

