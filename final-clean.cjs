const fs = require('fs');
const path = require('path');

const projectDir = __dirname;

// 1. 清洗 JSON 文件 (package.json, assets.json)
function cleanJson(filePath) {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, 'utf-8');
  // 使用正则替换键名和字符串值中的空格
  const cleaned = raw.replace(/"([^"]+)"\s*:\s*"([^"]*)"/g, (match, key, value) => {
    return `"${key.trim()}": "${value.trim()}"`;
  }).replace(/"([^"]+)"\s*:/g, (match, key) => {
    return `"${key.trim()}":`;
  });
  
  try {
    const obj = JSON.parse(cleaned);
    fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf-8');
    console.log(`✅ ${path.basename(filePath)} 已清洗并格式化！`);
  } catch (e) {
    console.log(`❌ ${path.basename(filePath)} 清洗失败:`, e.message);
  }
}

cleanJson(path.join(projectDir, 'package.json'));
cleanJson(path.join(projectDir, 'public/assets.json'));

// 2. 清洗 HomeView.vue 中的常见幽灵空格
const vuePath = path.join(projectDir, 'src/views/HomeView.vue');
if (fs.existsSync(vuePath)) {
  let vueCode = fs.readFileSync(vuePath, 'utf-8');
  
  // 修复 TS 语法中的空格
  vueCode = vueCode.replace(/=\s*>/g, '=>'); // () = >  => () =>
  vueCode = vueCode.replace(/&\s*&/g, '&&'); // & & => &&
  vueCode = vueCode.replace(/<\s*script\s+lang\s*=\s*"ts\s*"\s*>/g, '<script setup lang="ts">');
  vueCode = vueCode.replace(/<\s*\/\s*script\s*>/g, '</script>');
  vueCode = vueCode.replace(/<\s*template\s*>/g, '<template>');
  vueCode = vueCode.replace(/<\s*\/\s*template\s*>/g, '</template>');
  
  // 修复 HTML 属性中的空格： class= "xxx " => class="xxx"
  vueCode = vueCode.replace(/(\w[\w-]*)\s*=\s*"([^"]*)\s*"/g, (match, attr, value) => {
    return `${attr}="${value.trim()}"`;
  });
  vueCode = vueCode.replace(/(\w[\w-]*)\s*=\s*'([^']*)\s*'/g, (match, attr, value) => {
    return `${attr}='${value.trim()}'`;
  });
  
  // 修复变量名中间的空格 (如 realBan ners -> realBanners)
  vueCode = vueCode.replace(/realBan\s+ners/g, 'realBanners');
  vueCode = vueCode.replace(/nextT\s+ick/g, 'nextTick');
  vueCode = vueCode.replace(/handle\s+Scroll/g, 'handleScroll');
  vueCode = vueCode.replace(/b\s+ehavior/g, 'behavior');
  vueCode = vueCode.replace(/du\s+ration/g, 'duration');
  vueCode = vueCode.replace(/pas\s+sive/g, 'passive');
  vueCode = vueCode.replace(/hiden/g, 'hidden'); // 修复之前的拼写错误
  
  fs.writeFileSync(vuePath, vueCode, 'utf-8');
  console.log('✅ HomeView.vue 已清洗幽灵空格！');
}

console.log('\n🎉 终极清洗完成！现在可以安全地推送到 GitHub 了！');