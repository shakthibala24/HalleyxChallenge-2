import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useOrderStore = defineStore('orders', () => {
  // localStorage-ல இருந்து load பண்ணு
  const saved = localStorage.getItem('halleyx-orders')
  const orders = ref(saved ? JSON.parse(saved) : [])

  // orders மாறும்போது localStorage-ல save பண்ணு
  watch(orders, (val) => {
    localStorage.setItem('halleyx-orders', JSON.stringify(val))
  }, { deep: true })

  function addOrder(order) {
    const id = 'ORD-' + String(orders.value.length + 1).padStart(4, '0')
    orders.value.push({
      ...order,
      id,
      orderDate: new Date().toLocaleDateString()
    })
  }

  function updateOrder(id, updated) {
    const index = orders.value.findIndex(o => o.id === id)
    if (index !== -1) orders.value[index] = { ...updated, id }
  }

  function deleteOrder(id) {
    orders.value = orders.value.filter(o => o.id !== id)
  }

  return { orders, addOrder, updateOrder, deleteOrder }
})