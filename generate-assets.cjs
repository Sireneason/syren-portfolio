const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public/media/images');
const videosDir = path.join(__dirname, 'public/media/videos');
const outputPath = path.join(__dirname, 'public/assets.json');

const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const videoExts = ['.mp4', '.webm', '.mov'];

let assets = [];
console.log('🔍 开始扫描媒体文件夹...\n');

// ==========================================
// 🎯 新增功能 1：读取旧数据以保留分类和标题
// ==========================================
let oldDataMap = new Map();
if (fs.existsSync(outputPath)) {
  try {
    const oldData = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    // 兼容旧文件中键名可能带有空格的情况
    oldData.forEach(item => {
      const getId = (obj) => {
        const key = Object.keys(obj).find(k => k.trim() === 'id');
        return key ? String(obj[key]).trim() : '';
      };
      const getCategory = (obj) => {
        const key = Object.keys(obj).find(k => k.trim() === 'category');
        return key ? String(obj[key]).trim() : 'general';
      };
      const getTitle = (obj) => {
        const key = Object.keys(obj).find(k => k.trim() === 'title');
        return key ? String(obj[key]).trim() : '';
      };

      const id = getId(item);
      // 从 id 中提取文件夹名 (例如 img-aloeveragel -> aloeveragel)
      const folderName = id.replace(/^img-|^vid-/, '').trim();
      
      if (folderName) {
        oldDataMap.set(folderName, {
          category: getCategory(item),
          title: getTitle(item)
        });
      }
    });
    console.log(`📚 已加载历史数据，将保留 ${oldDataMap.size} 个商品的分类/标题设置。\n`);
  } catch (e) {
    console.log('⚠️ 读取旧 assets.json 失败，将使用默认分类和标题。\n');
  }
}

// ==========================================
//  核心扫描逻辑
// ==========================================

// 处理图片
if (fs.existsSync(imagesDir)) {
  const folders = fs.readdirSync(imagesDir).filter(f => fs.statSync(path.join(imagesDir, f)).isDirectory());
  
  folders.forEach(folder => {
    const folderPath = path.join(imagesDir, folder);
    // 🎯 新增功能 2：自然排序 (解决 detail-10 排在 detail-2 前面的问题)
    const files = fs.readdirSync(folderPath)
      .filter(f => imageExts.includes(path.extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })); 
      
    if (files.length === 0) return;

    let cover = '';
    let bannerImg = ''; 
    let mainMedia = [];
    let detailMedia = [];

    const coverFile = files.find(f => f.toLowerCase().startsWith('cover'));
    cover = `/media/images/${folder}/${coverFile || files[0]}`;
    
    const bannerFile = files.find(f => f.toLowerCase().startsWith('banner'));
    if (bannerFile) {
      bannerImg = `/media/images/${folder}/${bannerFile}`;
    }

    files.forEach(f => {
      const filePath = `/media/images/${folder}/${f}`;
      if (filePath === cover || filePath === bannerImg) return; 
      
      if (f.toLowerCase().includes('detail')) {
        detailMedia.push(filePath);
      } else {
        mainMedia.push(filePath);
      }
    });

    if (mainMedia.length === 0) mainMedia.push(cover);

    //  智能保留分类和标题
    const history = oldDataMap.get(folder) || {};
    // 如果历史数据中有分类（且不是默认的 general），则保留；否则使用 general
    // 如果历史数据中有标题（且不是默认的文件夹名），则保留；否则使用文件夹名
    const finalCategory = (history.category && history.category !== 'general') ? history.category : 'general';
    const finalTitle = (history.title && history.title !== folder) ? history.title : folder;

    const assetObj = {
      id: `img-${folder}`,
      category: finalCategory, 
      type: 'image',
      cover: cover,
      title: finalTitle, 
      mainMedia: mainMedia,
      detailMedia: detailMedia
    };

    if (bannerImg) assetObj.bannerImg = bannerImg;
    assets.push(assetObj);
    console.log(`✅ [图片] 扫描完成: ${folder} (共 ${files.length} 张图)`);
  });
} else {
  console.log('⚠️ 未找到 public/media/images 文件夹，已跳过图片扫描。');
}

// 处理视频
if (fs.existsSync(videosDir)) {
  const folders = fs.readdirSync(videosDir).filter(f => fs.statSync(path.join(videosDir, f)).isDirectory());
  folders.forEach(folder => {
    const folderPath = path.join(videosDir, folder);
    // 🎯 视频文件也应用自然排序
    const files = fs.readdirSync(folderPath).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
    
    const videoFile = files.find(f => videoExts.includes(path.extname(f).toLowerCase()));
    const coverFile = files.find(f => imageExts.includes(path.extname(f).toLowerCase()));

    if (!videoFile) return;

    //  智能保留分类和标题 (视频)
    const history = oldDataMap.get(folder) || {};
    const finalCategory = (history.category && history.category !== 'general') ? history.category : 'general';
    const finalTitle = (history.title && history.title !== folder) ? history.title : folder;

    assets.push({
      id: `vid-${folder}`,
      category: finalCategory, 
      type: 'video',
      cover: coverFile ? `/media/videos/${folder}/${coverFile}` : '',
      videoSrc: `/media/videos/${folder}/${videoFile}`,
      title: finalTitle, 
      mainMedia: coverFile ? [`/media/videos/${folder}/${coverFile}`] : [],
      detailMedia: []
    });
    console.log(`✅ [视频] 扫描完成: ${folder}`);
  });
}

// 写入文件
fs.writeFileSync(outputPath, JSON.stringify(assets, null, 2), 'utf-8');
console.log(`\n🎉 大功告成！已成功生成 public/assets.json，共收录 ${assets.length} 个商品。`);
console.log(' 提示：您可以在 assets.json 中手动修改 category (分类) 和 title (标题)，再次运行脚本时会自动保留您的修改。');