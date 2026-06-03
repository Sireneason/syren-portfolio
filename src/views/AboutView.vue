<template>
  <div class="min-h-screen bg-gray-50 pb-20 md:pb-8">
    <header class="md:hidden bg-white border-b h-12 flex items-center justify-center font-medium">关于我</header>
    <div class="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      <div class="bg-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-center gap-6">
        <img src="https://picsum.photos/seed/avatar/200" class="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover ring-4 ring-gray-100" />
        <div class="text-center md:text-left">
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Alex Designer</h1>
          <p class="text-gray-500 mt-1">资深 UI/UX 设计师 / 独立开发者</p>
          <div class="flex gap-2 mt-3 justify-center md:justify-start">
            <span class="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">电商设计</span>
            <span class="px-3 py-1 bg-green-50 text-green-600 text-xs rounded-full">前端开发</span>
            <span class="px-3 py-1 bg-purple-50 text-purple-600 text-xs rounded-full">3D视觉</span>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <section class="bg-white p-5 rounded-2xl shadow-sm">
          <h2 class="font-bold mb-3 text-gray-800 flex items-center gap-2"><span>📝</span> 个人简介</h2>
          <p class="text-sm text-gray-600 leading-relaxed">拥有 5 年互联网产品设计经验，专注于电商转化链路优化与移动端交互创新。热衷于将复杂的业务逻辑转化为极简的用户体验。</p>
        </section>
        <section class="bg-white p-5 rounded-2xl shadow-sm">
          <h2 class="font-bold mb-4 text-gray-800 flex items-center gap-2"><span>🛠</span> 专业技能</h2>
          <div class="space-y-3">
            <div v-for="skill in [{name: 'UI/UX Design', val: 95}, {name: 'Vue.js', val: 85}, {name: 'Prototyping', val: 90}]" :key="skill.name">
              <div class="flex justify-between text-xs mb-1 font-medium text-gray-600"><span>{{ skill.name }}</span><span>{{ skill.val }}%</span></div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" :style="{width: skill.val + '%'}"></div></div>
            </div>
          </div>
        </section>
      </div>

      <section class="bg-white p-5 rounded-2xl shadow-sm">
        <h2 class="font-bold mb-4 text-gray-800 flex items-center gap-2"><span>💼</span> 工作经历</h2>
        <div class="border-l-2 border-blue-500 pl-5 space-y-6 relative">
          <div class="absolute -left-[5px] top-1 w-2 h-2 bg-blue-500 rounded-full"></div>
          <div class="absolute -left-[5px] top-[73px] w-2 h-2 bg-blue-500 rounded-full"></div>
          <div>
            <div class="text-sm font-bold text-gray-800">某一线大厂 · 高级体验设计师</div>
            <div class="text-xs text-gray-400 mb-1">2021 - 至今</div>
            <p class="text-xs text-gray-500">负责核心电商链路改版，主导设计系统搭建。</p>
          </div>
          <div>
            <div class="text-sm font-bold text-gray-800">某明星创业公司 · UI 负责人</div>
            <div class="text-xs text-gray-400 mb-1">2018 - 2021</div>
            <p class="text-xs text-gray-500">从0到1搭建产品视觉规范，带领团队完成App上线。</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>