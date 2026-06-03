<script setup lang="ts">
import { ref } from 'vue'
import { useCart } from '../store/cart'
import { useRouter } from 'vue-router'

const router = useRouter()
const { state, removeItem, updateQuantity, toggleSelect, toggleSelectAll, totalPrice, selectedCount } = useCart()

const showPayment = ref(false)
const handleCheckout = () => {
  if (selectedCount.value > 0) showPayment.value = true
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20 md:pb-8">
    <header class="md:hidden sticky top-0 bg-white border-b h-12 flex items-center justify-center font-medium z-10">购物车 ({{ state.items.length }})</header>
    
    <div v-if="state.items.length === 0" class="text-center py-20 text-gray-400 max-w-3xl mx-auto">
      <div class="text-5xl mb-4">🛒</div>
      <p class="text-lg mb-4">购物车空空如也，去逛逛吧</p>
      <button @click="router.push('/')" class="px-8 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">去首页</button>
    </div>

    <div v-else class="p-3 md:p-6 space-y-3 max-w-3xl mx-auto">
      <div class="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs text-gray-400 font-medium border-b">
        <div class="col-span-5 flex items-center gap-2"><input type="checkbox" :checked="state.items.length > 0 && state.items.every(i => i.selected)" @change="toggleSelectAll" class="w-4 h-4 accent-red-500" /> 商品信息</div>
        <div class="col-span-2 text-center">单价</div>
        <div class="col-span-2 text-center">数量</div>
        <div class="col-span-2 text-center">小计</div>
        <div class="col-span-1 text-center">操作</div>
      </div>

      <div v-for="(item, index) in state.items" :key="index" class="bg-white p-3 md:p-4 rounded-xl flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center relative shadow-sm">
        <!-- 移动端布局 -->
        <div class="md:hidden flex gap-3">
          <input type="checkbox" :checked="item.selected" @change="toggleSelect(index)" class="mt-5 w-5 h-5 accent-red-500 shrink-0" />
          <img :src="item.cover" class="w-24 h-24 object-cover rounded-lg" />
          <div class="flex-1 flex flex-col justify-between min-w-0">
            <h3 class="text-sm line-clamp-2 font-medium">{{ item.title }}</h3>
            <div class="text-xs text-gray-400 mt-1">{{ item.sku }}</div>
            <div class="flex items-center justify-between mt-2">
              <span class="text-red-500 font-bold">¥{{ item.price }}</span>
              <div class="flex items-center border rounded-full bg-gray-50">
                <button @click="updateQuantity(index, -1)" class="w-6 h-6 text-gray-500 text-xs hover:bg-gray-200 rounded-l-full">-</button>
                <span class="w-8 text-center text-xs font-medium">{{ item.quantity }}</span>
                <button @click="updateQuantity(index, 1)" class="w-6 h-6 text-gray-500 text-xs hover:bg-gray-200 rounded-r-full">+</button>
              </div>
            </div>
          </div>
          <button @click="removeItem(index)" class="absolute top-2 right-2 text-gray-300 hover:text-red-500 text-sm w-6 h-6 flex items-center justify-center">✕</button>
        </div>

        <!-- PC端布局 -->
        <div class="hidden md:contents">
          <div class="col-span-5 flex items-center gap-3">
            <input type="checkbox" :checked="item.selected" @change="toggleSelect(index)" class="w-4 h-4 accent-red-500 shrink-0" />
            <img :src="item.cover" class="w-16 h-16 object-cover rounded-lg" />
            <div class="min-w-0">
              <h3 class="text-sm line-clamp-2 font-medium">{{ item.title }}</h3>
              <div class="text-xs text-gray-400 mt-1">{{ item.sku }}</div>
            </div>
          </div>
          <div class="col-span-2 text-center text-sm text-gray-600">¥{{ item.price }}</div>
          <div class="col-span-2 flex justify-center">
            <div class="flex items-center border rounded-full bg-gray-50">
              <button @click="updateQuantity(index, -1)" class="w-7 h-7 text-gray-500 text-xs hover:bg-gray-200 rounded-l-full">-</button>
              <span class="w-8 text-center text-xs font-medium">{{ item.quantity }}</span>
              <button @click="updateQuantity(index, 1)" class="w-7 h-7 text-gray-500 text-xs hover:bg-gray-200 rounded-r-full">+</button>
            </div>
          </div>
          <div class="col-span-2 text-center text-red-500 font-bold text-sm">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
          <div class="col-span-1 text-center">
            <button @click="removeItem(index)" class="text-gray-400 hover:text-red-500 text-xs">删除</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部结算栏 -->
    <div v-if="state.items.length > 0" class="fixed bottom-14 md:bottom-0 left-0 right-0 bg-white border-t h-14 md:h-16 flex items-center px-4 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div class="max-w-3xl mx-auto w-full flex items-center">
        <label class="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" :checked="state.items.length > 0 && state.items.every(i => i.selected)" @change="toggleSelectAll" class="w-5 h-5 accent-red-500" /> 全选
        </label>
        <div class="flex-1 text-right mr-4">
          <span class="text-xs md:text-sm text-gray-500">已选 {{ selectedCount }} 件，合计:</span>
          <span class="text-lg md:text-xl text-red-500 font-bold ml-1">¥{{ totalPrice.toFixed(2) }}</span>
        </div>
        <button @click="handleCheckout" class="bg-red-500 hover:bg-red-600 text-white px-6 md:px-8 py-2 md:py-2.5 rounded-full text-sm font-medium transition-colors" :disabled="selectedCount === 0" :class="{'opacity-50 cursor-not-allowed': selectedCount === 0}">
          结算 ({{ selectedCount }})
        </button>
      </div>
    </div>

    <!-- 💳 模拟支付弹窗 -->
    <div v-if="showPayment" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="showPayment = false">
      <div class="bg-white w-full max-w-sm rounded-2xl p-6 text-center space-y-4 shadow-2xl animate-slide-up">
        <div class="text-5xl">💳</div>
        <h3 class="text-xl font-bold">模拟收银台</h3>
        <p class="text-sm text-gray-500">需支付: <span class="text-red-500 font-bold text-lg">¥{{ totalPrice.toFixed(2) }}</span></p>
        <p class="text-xs text-gray-400 bg-gray-50 py-2 rounded-lg">该示例商品不可付款，感谢您的支持！</p>
        <button @click="showPayment = false" class="w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-full text-sm font-medium transition-colors">我知道了</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.animate-slide-up { animation: slideUp 0.3s ease-out; }
</style>