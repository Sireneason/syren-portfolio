const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'public/media');
const imagesDir = path.join(baseDir, 'images');
const videosDir = path.join(baseDir, 'videos');
const galleryDir = path.join(baseDir, 'gallery');
const outputPath = path.join(__dirname, 'public/assets.json');

const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const videoExts = ['.mp4', '.webm', '.mov'];

let assets = [];

console.log('🔍 开始扫描媒体文件夹...\n');

// ==========================================
// 1. 读取旧数据以保留分类和标题
// ==========================================
let oldDataMap = new Map();
if (fs.existsSync(outputPath)) {
  try {
    const oldData = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
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
      const folderName = id.replace(/^img-|^vid-|^gallery-/, '').trim();
      
      if (folderName) {
        oldDataMap.set(folderName, {
          category: getCategory(item),
          title: getTitle(item)
        });
      }
    });
    console.log(`📚 已加载历史数据，将保留 ${oldDataMap.size} 个项目的设置。\n`);
  } catch (e) {
    console.log('⚠️ 读取旧 assets.json 失败，将使用默认设置。\n');
  }
}

// ==========================================
// 2. 扫描图片 (Images)
// ==========================================
if (fs.existsSync(imagesDir)) {
  const folders = fs.readdirSync(imagesDir).filter(f => fs.statSync(path.join(imagesDir, f)).isDirectory());
  folders.forEach(folder => {
    const folderPath = path.join(imagesDir, folder);
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
    if (bannerFile) bannerImg = `/media/images/${folder}/${bannerFile}`;

    files.forEach(f => {
      const filePath = `/media/images/${folder}/${f}`;
      if (filePath === cover || filePath === bannerImg) return; 
      if (f.toLowerCase().includes('detail')) detailMedia.push(filePath);
      else mainMedia.push(filePath);
    });

    if (mainMedia.length === 0) mainMedia.push(cover);

    const history = oldDataMap.get(folder) || {};
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
    console.log(`✅ [图片] 扫描完成: ${folder} (共 ${files.length} 张)`);
  });
}

// ==========================================
// 3. 扫描视频 (Videos) - 修复：支持根目录文件
// ==========================================
if (fs.existsSync(videosDir)) {
  const items = fs.readdirSync(videosDir);
  
  // A. 扫描直接放在 videos 根目录的视频文件
  const rootVideos = items.filter(f => {
    const isFile = fs.statSync(path.join(videosDir, f)).isFile();
    return isFile && videoExts.includes(path.extname(f).toLowerCase());
  });

  rootVideos.forEach(file => {
    const fileNameWithoutExt = file.replace(/\.[^/.]+$/, "");
    const videoPath = `/media/videos/${file}`;
    
    const history = oldDataMap.get(fileNameWithoutExt) || {};
    const finalCategory = (history.category && history.category !== 'general') ? history.category : 'general';
    const finalTitle = (history.title && history.title !== fileNameWithoutExt) ? history.title : fileNameWithoutExt;

    assets.push({
      id: `vid-${fileNameWithoutExt}`,
      category: finalCategory, 
      type: 'video',
      cover: '', // 无封面
      videoSrc: videoPath,
      title: finalTitle, 
      mainMedia: [],
      detailMedia: []
    });
    console.log(`✅ [视频] 扫描完成 (根目录): ${file}`);
  });

  // B. 扫描子文件夹中的视频
  const folders = items.filter(f => fs.statSync(path.join(videosDir, f)).isDirectory());
  folders.forEach(folder => {
    const folderPath = path.join(videosDir, folder);
    const files = fs.readdirSync(folderPath).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
    const videoFile = files.find(f => videoExts.includes(path.extname(f).toLowerCase()));

    if (!videoFile) return;

    const history = oldDataMap.get(folder) || {};
    const finalCategory = (history.category && history.category !== 'general') ? history.category : 'general';
    const finalTitle = (history.title && history.title !== folder) ? history.title : folder;

    assets.push({
      id: `vid-${folder}`,
      category: finalCategory, 
      type: 'video',
      cover: '',
      videoSrc: `/media/videos/${folder}/${videoFile}`,
      title: finalTitle, 
      mainMedia: [],
      detailMedia: []
    });
    console.log(`✅ [视频] 扫描完成 (子文件夹): ${folder}`);
  });
}

// ==========================================
// 4. 扫描画廊 (Gallery)
// ==========================================
if (fs.existsSync(galleryDir)) {
  const files = fs.readdirSync(galleryDir)
    .filter(f => imageExts.includes(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  if (files.length > 0) {
    const galleryMedia = files.map(f => `/media/gallery/${f}`);
    
    assets.push({
      id: 'gallery-collection',
      category: 'gallery',
      type: 'gallery',
      title: 'Visual Gallery',
      cover: galleryMedia[0],
      mainMedia: galleryMedia,
      detailMedia: []
    });
    console.log(`✅ [画廊] 扫描完成: 共 ${files.length} 张图片`);
  }
}

// ==========================================
// 5. 写入文件
// ==========================================
fs.writeFileSync(outputPath, JSON.stringify(assets, null, 2), 'utf-8');
console.log(`\n🎉 大功告成！已成功生成 public/assets.json，共收录 ${assets.length} 个项目。`);