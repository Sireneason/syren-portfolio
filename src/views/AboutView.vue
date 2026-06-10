<template>
  <div class="min-h-screen bg-gray-50 pb-20 md:pb-8">
    <header class="md:hidden bg-white border-b h-12 flex items-center justify-center font-medium">关于我</header>
    <div class="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      
      <!-- 头部信息 -->
      <div class="bg-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-center gap-6">
        <img src="https://picsum.photos/seed/avatar/200" class="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover ring-4 ring-gray-100" />
        <div class="text-center md:text-left">
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900">ch@fascinate.online</h1>
          <p class="text-gray-500 mt-1">AIGC设计师 / 独立开发者</p>
          <div class="flex gap-2 mt-3 justify-center md:justify-start">
            <span class="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">电商设计</span>
            <span class="px-3 py-1 bg-green-50 text-green-600 text-xs rounded-full">视觉设计</span>
            <span class="px-3 py-1 bg-purple-50 text-purple-600 text-xs rounded-full">AI应用</span>
          </div>
        </div>
      </div>

      <!-- 简介与技能 -->
      <div class="grid md:grid-cols-2 gap-6">
        <section class="bg-white p-5 rounded-2xl shadow-sm">
          <h2 class="font-bold mb-3 text-gray-800 flex items-center gap-2"><span></span> 个人简介</h2>
          <p class="text-sm text-gray-600 leading-relaxed">毕业于四川美术学院美术学系，3年视觉设计经验，擅长AI图像视觉内容制作，自2023年开始钻研AI，历任UI设计师，IP画师，电商设计组长，拥有丰富的实战经验，掌握多种AI及平面、3D工具，热衷于将工作中的大部分任务自动化或半自动化以提高个人及团队效率。</p>
        </section>
        <section class="bg-white p-5 rounded-2xl shadow-sm">
          <h2 class="font-bold mb-4 text-gray-800 flex items-center gap-2"><span>🛠</span> 专业技能</h2>
          <div class="space-y-3">
            <div v-for="skill in [{name: 'Photoshop/Illustrator', val: 75}, {name: 'StableDiffusion', val: 80}, {name: 'ComfyUI', val: 90}, {name: 'Coze', val: 70}, {name: 'Blender', val: 60}, {name: 'Python', val: 60}, {name: 'Vibe Coding', val: 90}]" :key="skill.name">
              <div class="flex justify-between text-xs mb-1 font-medium text-gray-600"><span>{{ skill.name }}</span><span>{{ skill.val }}%</span></div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" :style="{width: skill.val + '%'}"></div></div>
            </div>
          </div>
        </section>
      </div>

      <!-- 🎯 工作经历 (已重构为 Flex 布局，支持无限添加) -->
      <section class="bg-white p-5 rounded-2xl shadow-sm">
        <h2 class="font-bold mb-4 text-gray-800 flex items-center gap-2"><span>💼</span> 工作经历</h2>
        
        <div class="space-y-6">
          
          <!-- 经历 1 -->
          <div class="flex gap-4">
            <div class="flex flex-col items-center">
              <div class="w-3 h-3 bg-blue-500 rounded-full shrink-0 mt-1.5"></div>
              <div class="w-0.5 bg-blue-500 flex-1 mt-1"></div>
            </div>
            <div class="flex-1 pb-2">
              <div class="text-sm font-bold text-gray-800">广州元宙动漫 · IP画师</div>
              <p class="text-xs text-gray-500 leading-relaxed">负责使用AI工具进行IP创作；使用StableDiffusion及Midjourney高效输出IP卡面图像，并手绘修复AI生成中的错误和缺漏；训练对应的IP角色模型以提高二次产出效率，周度产出图像约30-40张。</p>
            </div>
          </div>

          <!-- 经历 2 -->
          <div class="flex gap-4">
            <div class="flex flex-col items-center">
              <div class="w-3 h-3 bg-blue-500 rounded-full shrink-0 mt-1.5"></div>
              <div class="w-0.5 bg-blue-500 flex-1 mt-1"></div>
            </div>
            <div class="flex-1 pb-2">
              <div class="text-sm font-bold text-gray-800">广州奋达电子商务 · 电商设计组长</div>
              <p class="text-xs text-gray-500 leading-relaxed">参与搭建产品视觉规范，负责AI工作流管理，优化和人员培训；负责产品摄影批量背景替换，带领6人团队完成周度约60套详情页的设计并根据反馈调整设计方向；及时跟进并引入新技术，将AI接入不同的任务场景。</p>
            </div>
          </div>

          <!-- 🎯 经历 3 (新增，请修改下方的文字为你的真实信息) -->
          <div class="flex gap-4">
            <div class="flex flex-col items-center">
              <div class="w-3 h-3 bg-blue-500 rounded-full shrink-0 mt-1.5"></div>
              <!-- 最后一段不需要向下的连线，所以这里留空 -->
            </div>
            <div class="flex-1">
              <div class="text-sm font-bold text-gray-800">自由职业 / 独立开发者</div>

              <p class="text-xs text-gray-500 leading-relaxed">完成多个应用的开发，包括大批量自动化商品搬运工具，自定义图像处理工具，详情页违规预检测工具，ERP管理系统，数字人直播系统，探索 AI 自动化工作流，承接电商视觉设计与 AIGC 相关项目。</p>
            </div>
          </div>

        </div>
      </section>
      
    </div>
  </div>
</template>