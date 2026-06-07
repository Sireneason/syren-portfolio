const fs = require('fs');
const path = './public/assets.json';

console.log('🔧 正在读取 assets.json...');
const data = JSON.parse(fs.readFileSync(path, 'utf-8'));

let updateCount = 0;

// 遍历所有商品数据，替换图片后缀
data.forEach(item => {
  // 替换封面图
  if (item.cover) {
    item.cover = item.cover.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    updateCount++;
  }
  // 替换 Banner 图
  if (item.bannerImg) {
    item.bannerImg = item.bannerImg.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    updateCount++;
  }
  // 替换主图数组
  if (Array.isArray(item.mainMedia)) {
    item.mainMedia = item.mainMedia.map(img => img.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
    updateCount += item.mainMedia.length;
  }
  // 替换详情图数组
  if (Array.isArray(item.detailMedia)) {
    item.detailMedia = item.detailMedia.map(img => img.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
    updateCount += item.detailMedia.length;
  }
});

// 保存修改后的文件
fs.writeFileSync(path, JSON.stringify(data, null, 2));

console.log(`✅ 修复完成！共更新了 ${updateCount} 个图片路径为 .webp 格式。`);
console.log(' 现在请重启你的本地开发服务器 (npm run dev) 查看效果。');