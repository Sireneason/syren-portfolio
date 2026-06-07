import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const inputDir = './public/media/images';
let totalOriginal = 0;
let totalWebp = 0;
let processedCount = 0;

async function convertToWebp(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
            await convertToWebp(fullPath);
        } else if (entry.isFile() && /\.(png|jpg|jpeg)$/i.test(entry.name)) {
            try {
                const originalSize = (await fs.stat(fullPath)).size;
                totalOriginal += originalSize;
                
                // 生成 WebP 文件名（保持原名）
                const webpPath = fullPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
                
                // 转换配置：质量 90%，几乎无损
                await sharp(fullPath)
                    .webp({ 
                        quality: 90,        // 90% 质量，肉眼几乎无区别
                        effort: 6,          // 压缩努力程度（0-6，6最慢但体积最小）
                        lossless: false     // false = 有损但体积小；true = 无损但体积稍大
                    })
                    .toFile(webpPath);
                
                const webpSize = (await fs.stat(webpPath)).size;
                totalWebp += webpSize;
                processedCount++;
                
                const reduction = ((1 - webpSize / originalSize) * 100).toFixed(1);
                console.log(`✅ ${processedCount}. ${path.relative('./', fullPath)}`);
                console.log(`   ${(originalSize / 1024).toFixed(1)} KB → ${(webpSize / 1024).toFixed(1)} KB (减少 ${reduction}%)`);
                
                // ⚠️ 可选：删除原 PNG 文件（取消注释以启用）
                // await fs.unlink(fullPath);
                // console.log(`   🗑️ 已删除原文件`);
                
            } catch (err) {
                console.error(`❌ 处理失败 ${fullPath}:`, err.message);
            }
        }
    }
}

console.log('🚀 开始批量转换为 WebP...\n');
convertToWebp(inputDir).then(() => {
    console.log('\n🎉 转换完成！');
    console.log(`📊 统计：`);
    console.log(`   处理图片：${processedCount} 张`);
    console.log(`   原始大小：${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   WebP 大小：${(totalWebp / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   节省空间：${((1 - totalWebp / totalOriginal) * 100).toFixed(1)}%`);
    console.log(`\n⚠️ 注意：原 PNG 文件已保留，请检查 WebP 效果后再手动删除`);
});