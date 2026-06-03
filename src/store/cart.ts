import { reactive, computed } from 'vue'

export interface CartItem {
  id: string
  title: string
  cover: string
  price: number
  sku: string
  quantity: number
  selected: boolean
}

const state = reactive({ items: [] as CartItem[] })

export const useCart = () => {
  const addItem = (item: Omit<CartItem, 'quantity' | 'selected'>) => {
    const existing = state.items.find(i => i.id === item.id && i.sku === item.sku)
    if (existing) existing.quantity++
    else state.items.push({ ...item, quantity: 1, selected: true })
  }

  const removeItem = (index: number) => state.items.splice(index, 1)
  
  const updateQuantity = (index: number, delta: number) => {
    const item = state.items[index]
    if (item.quantity + delta > 0) item.quantity += delta
  }

  const toggleSelect = (index: number) => state.items[index].selected = !state.items[index].selected
  const toggleSelectAll = () => {
    const allSelected = state.items.every(i => i.selected)
    state.items.forEach(i => i.selected = !allSelected)
  }

  const totalPrice = computed(() => 
    state.items.filter(i => i.selected).reduce((sum, i) => sum + i.price * i.quantity, 0)
  )
  
  const selectedCount = computed(() => state.items.filter(i => i.selected).reduce((sum, i) => sum + i.quantity, 0))

  return { state, addItem, removeItem, updateQuantity, toggleSelect, toggleSelectAll, totalPrice, selectedCount }
}