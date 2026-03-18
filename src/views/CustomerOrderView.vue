<template>
  <div>

    <!-- Loading Overlay -->
    <LoadingOverlay :show="isLoading" :text="loadingText" />

    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
      <h2 class="text-lg font-semibold text-gray-700">Customer Orders</h2>
      <button
        @click="openCreateForm"
        class="bg-[#54bd95] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3da87d] w-full sm:w-auto"
      >
        + Create Order
      </button>
    </div>

    <!-- Table - Desktop & Tablet -->
    <div class="hidden sm:block">
      <SkeletonLoader v-if="isTableLoading" type="table" :rows="5" />
      <div v-else class="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table class="w-full text-sm min-w-[800px]">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-4 py-3 text-gray-600 font-medium">Order ID</th>
              <th class="text-left px-4 py-3 text-gray-600 font-medium">Customer Name</th>
              <th class="text-left px-4 py-3 text-gray-600 font-medium">Product</th>
              <th class="text-left px-4 py-3 text-gray-600 font-medium">Qty</th>
              <th class="text-left px-4 py-3 text-gray-600 font-medium">Unit Price</th>
              <th class="text-left px-4 py-3 text-gray-600 font-medium">Total</th>
              <th class="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
              <th class="text-left px-4 py-3 text-gray-600 font-medium">Created By</th>
              <th class="text-left px-4 py-3 text-gray-600 font-medium"></th>
            </tr>
          </thead>
          <TransitionGroup name="list" tag="tbody">
            <tr v-if="orderStore.orders.length === 0" key="empty">
              <td colspan="9" class="text-center py-16 text-gray-400">
                <div class="flex flex-col items-center gap-2">
                  <span class="text-4xl">📋</span>
                  <p class="text-sm">No orders found</p>
                  <p class="text-xs text-gray-300">Click "Create Order" to add your first order</p>
                </div>
              </td>
            </tr>
            <tr
              v-for="order in orderStore.orders"
              :key="order.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
            >
              <td class="px-4 py-3 text-gray-700">{{ order.id }}</td>
              <td class="px-4 py-3 text-gray-700">{{ order.firstName }} {{ order.lastName }}</td>
              <td class="px-4 py-3 text-gray-700">{{ order.product }}</td>
              <td class="px-4 py-3 text-gray-700">{{ order.quantity }}</td>
              <td class="px-4 py-3 text-gray-700">${{ order.unitPrice }}</td>
              <td class="px-4 py-3 text-gray-700">${{ order.totalAmount }}</td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-yellow-100 text-yellow-700': order.status === 'Pending',
                    'bg-blue-100 text-blue-700': order.status === 'In progress',
                    'bg-green-100 text-green-700': order.status === 'Completed'
                  }"
                >{{ order.status }}</span>
              </td>
              <td class="px-4 py-3 text-gray-700">{{ order.createdBy }}</td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button @click="openEditForm(order)" class="text-gray-400 hover:text-blue-500 transition-colors duration-200">✏️</button>
                  <button @click="deleteOrder(order.id)" class="text-gray-400 hover:text-red-500 transition-colors duration-200">🗑️</button>
                </div>
              </td>
            </tr>
          </TransitionGroup>
        </table>
      </div>
    </div>

    <!-- Mobile Card View -->
    <div class="sm:hidden">
      <SkeletonLoader v-if="isTableLoading" type="cards" :rows="3" />
      <TransitionGroup v-else name="list" tag="div" class="space-y-3">
        <div v-if="orderStore.orders.length === 0" key="empty-mobile"
          class="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-400">
          <p class="text-4xl mb-2">📋</p>
          <p class="text-sm">No orders found</p>
        </div>
        <div
          v-for="order in orderStore.orders"
          :key="order.id"
          class="order-card bg-white rounded-lg border border-gray-200 p-4"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <p class="font-semibold text-gray-800 text-sm">{{ order.firstName }} {{ order.lastName }}</p>
              <p class="text-xs text-gray-400">{{ order.id }}</p>
            </div>
            <span
              class="px-2 py-1 rounded-full text-xs font-medium"
              :class="{
                'bg-yellow-100 text-yellow-700': order.status === 'Pending',
                'bg-blue-100 text-blue-700': order.status === 'In progress',
                'bg-green-100 text-green-700': order.status === 'Completed'
              }"
            >{{ order.status }}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
            <div><span class="text-gray-400">Product:</span> {{ order.product }}</div>
            <div><span class="text-gray-400">Qty:</span> {{ order.quantity }}</div>
            <div><span class="text-gray-400">Unit Price:</span> ${{ order.unitPrice }}</div>
            <div><span class="text-gray-400">Total:</span> ${{ order.totalAmount }}</div>
            <div class="col-span-2"><span class="text-gray-400">Created by:</span> {{ order.createdBy }}</div>
          </div>
          <div class="flex justify-end gap-2 border-t border-gray-100 pt-2">
            <button @click="openEditForm(order)"
              class="text-xs text-blue-500 border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors duration-200">✏️ Edit</button>
            <button @click="deleteOrder(order.id)"
              class="text-xs text-red-500 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors duration-200">🗑️ Delete</button>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Create/Edit Modal -->
    <Transition name="fade">
      <div v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center z-50 p-4 overflow-y-auto">
        <Transition name="modal">
          <div class="bg-white rounded-xl w-full max-w-2xl shadow-xl my-4">

            <!-- Modal Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 class="text-base font-semibold text-gray-800">
                {{ isEditing ? 'Edit Order' : 'Create Order' }}
              </h3>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-xl transition-colors duration-200">✕</button>
            </div>

            <!-- Modal Body -->
            <div class="px-6 py-4 space-y-6">
              <!-- Customer Information -->
              <div>
                <h4 class="text-sm font-semibold text-gray-700 mb-3">Customer Information</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="text-xs text-gray-600 mb-1 block">First Name *</label>
                    <input v-model="form.firstName" type="text"
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200"
                      :class="{ 'border-red-400': errors.firstName }"
                    />
                    <p v-if="errors.firstName" class="text-red-500 text-xs mt-1">Please fill the field</p>
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 mb-1 block">Last Name *</label>
                    <input v-model="form.lastName" type="text"
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200"
                      :class="{ 'border-red-400': errors.lastName }"
                    />
                    <p v-if="errors.lastName" class="text-red-500 text-xs mt-1">Please fill the field</p>
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 mb-1 block">Email ID *</label>
                    <input v-model="form.email" type="text"
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200"
                      :class="{ 'border-red-400': errors.email }"
                    />
                    <p v-if="errors.email" class="text-red-500 text-xs mt-1">Please fill the field</p>
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 mb-1 block">Phone Number *</label>
                    <input v-model="form.phone" type="text"
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200"
                      :class="{ 'border-red-400': errors.phone }"
                    />
                    <p v-if="errors.phone" class="text-red-500 text-xs mt-1">Please fill the field</p>
                  </div>
                  <div class="col-span-1 sm:col-span-2">
                    <label class="text-xs text-gray-600 mb-1 block">Street Address *</label>
                    <input v-model="form.street" type="text"
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200"
                      :class="{ 'border-red-400': errors.street }"
                    />
                    <p v-if="errors.street" class="text-red-500 text-xs mt-1">Please fill the field</p>
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 mb-1 block">City *</label>
                    <input v-model="form.city" type="text"
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200"
                      :class="{ 'border-red-400': errors.city }"
                    />
                    <p v-if="errors.city" class="text-red-500 text-xs mt-1">Please fill the field</p>
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 mb-1 block">State / Province *</label>
                    <input v-model="form.state" type="text"
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200"
                      :class="{ 'border-red-400': errors.state }"
                    />
                    <p v-if="errors.state" class="text-red-500 text-xs mt-1">Please fill the field</p>
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 mb-1 block">Postal Code *</label>
                    <input v-model="form.postalCode" type="text"
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200"
                      :class="{ 'border-red-400': errors.postalCode }"
                    />
                    <p v-if="errors.postalCode" class="text-red-500 text-xs mt-1">Please fill the field</p>
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 mb-1 block">Country *</label>
                    <select v-model="form.country"
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200"
                      :class="{ 'border-red-400': errors.country }"
                    >
                      <option value="">Select Country</option>
                      <option>United States</option>
                      <option>Canada</option>
                      <option>Australia</option>
                      <option>Singapore</option>
                      <option>Hong Kong</option>
                    </select>
                    <p v-if="errors.country" class="text-red-500 text-xs mt-1">Please fill the field</p>
                  </div>
                </div>
              </div>

              <!-- Order Information -->
              <div>
                <h4 class="text-sm font-semibold text-gray-700 mb-3">Order Information</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="col-span-1 sm:col-span-2">
                    <label class="text-xs text-gray-600 mb-1 block">Choose Product *</label>
                    <select v-model="form.product"
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200"
                      :class="{ 'border-red-400': errors.product }"
                    >
                      <option value="">Select Product</option>
                      <option>Fiber Internet 300 Mbps</option>
                      <option>5G Unlimited Mobile Plan</option>
                      <option>Fiber Internet 1 Gbps</option>
                      <option>Business Internet 500 Mbps</option>
                      <option>VoIP Corporate Package</option>
                    </select>
                    <p v-if="errors.product" class="text-red-500 text-xs mt-1">Please fill the field</p>
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 mb-1 block">Quantity *</label>
                    <input v-model.number="form.quantity" type="number" min="1"
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 mb-1 block">Unit Price *</label>
                    <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden"
                      :class="{ 'border-red-400': errors.unitPrice }"
                    >
                      <span class="px-3 py-2 bg-gray-50 text-gray-500 text-sm border-r border-gray-300">$</span>
                      <input v-model.number="form.unitPrice" type="number" min="0"
                        class="w-full px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>
                    <p v-if="errors.unitPrice" class="text-red-500 text-xs mt-1">Please fill the field</p>
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 mb-1 block">Total Amount</label>
                    <div class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600">
                      ${{ totalAmount }}
                    </div>
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 mb-1 block">Status *</label>
                    <select v-model="form.status"
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200"
                    >
                      <option>Pending</option>
                      <option>In progress</option>
                      <option>Completed</option>
                    </select>
                  </div>
                  <div class="col-span-1 sm:col-span-2">
                    <label class="text-xs text-gray-600 mb-1 block">Created By *</label>
                    <select v-model="form.createdBy"
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200"
                    >
                      <option>Mr. Michael Harris</option>
                      <option>Mr. Ryan Cooper</option>
                      <option>Ms. Olivia Carter</option>
                      <option>Mr. Lucas Martin</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button @click="closeModal"
                class="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >Cancel</button>
              <button @click="submitForm" :disabled="isSubmitting"
                class="px-4 py-2 text-sm text-white bg-[#54bd95] rounded-lg hover:bg-[#3da87d] transition-colors duration-200 flex items-center gap-2 disabled:opacity-70"
              >
                <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full spin inline-block"></span>
                <span>{{ isSubmitting ? 'Saving...' : 'Submit' }}</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal -->
    <Transition name="fade">
      <div v-if="showDeleteModal"
        class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
        <Transition name="modal">
          <div class="bg-white rounded-xl w-full max-w-sm shadow-xl p-6">
            <h3 class="text-base font-semibold text-gray-800 mb-2">Delete Order</h3>
            <p class="text-sm text-gray-500 mb-6">Are you sure you want to delete this order?</p>
            <div class="flex justify-end gap-3">
              <button @click="showDeleteModal = false"
                class="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >Cancel</button>
              <button @click="confirmDelete"
                class="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-200"
              >Delete</button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="toastVisible"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
        <div class="flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium"
          :class="{
            'bg-[#54bd95]': toastType === 'success',
            'bg-red-500': toastType === 'error',
          }"
        >
          <span>{{ toastType === 'success' ? '✅' : '🗑️' }}</span>
          <span>{{ toastMessage }}</span>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useOrderStore } from '../stores/useOrderStore'
import LoadingOverlay from '../components/common/LoadingOverlay.vue'
import SkeletonLoader from '../components/common/SkeletonLoader.vue'
import { useLoading } from '../composables/useLoading'

const orderStore = useOrderStore()
const { isLoading, loadingText, withLoading } = useLoading()

const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const deleteId = ref(null)
const isTableLoading = ref(true)

// Page load skeleton
setTimeout(() => { isTableLoading.value = false }, 800)

// Toast
const toastVisible = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

function showToast(msg, type = 'success') {
  toastMessage.value = msg
  toastType.value = type
  toastVisible.value = true
  setTimeout(() => { toastVisible.value = false }, 3000)
}

const defaultForm = () => ({
  firstName: '', lastName: '', email: '', phone: '',
  street: '', city: '', state: '', postalCode: '', country: '',
  product: '', quantity: 1, unitPrice: 0,
  status: 'Pending', createdBy: 'Mr. Michael Harris'
})

const form = ref(defaultForm())
const errors = ref({})
const totalAmount = computed(() => form.value.quantity * form.value.unitPrice)

function openCreateForm() {
  form.value = defaultForm()
  errors.value = {}
  isEditing.value = false
  showModal.value = true
}

function openEditForm(order) {
  form.value = { ...order }
  errors.value = {}
  isEditing.value = true
  showModal.value = true
}

function closeModal() { showModal.value = false }

function validate() {
  const e = {}
  const f = form.value
  if (!f.firstName) e.firstName = true
  if (!f.lastName) e.lastName = true
  if (!f.email) e.email = true
  if (!f.phone) e.phone = true
  if (!f.street) e.street = true
  if (!f.city) e.city = true
  if (!f.state) e.state = true
  if (!f.postalCode) e.postalCode = true
  if (!f.country) e.country = true
  if (!f.product) e.product = true
  if (!f.unitPrice) e.unitPrice = true
  errors.value = e
  return Object.keys(e).length === 0
}

async function submitForm() {
  if (!validate()) return
  isSubmitting.value = true
  await withLoading(async () => {
    await new Promise(r => setTimeout(r, 800))
    const data = { ...form.value, totalAmount: totalAmount.value }
    if (isEditing.value) {
      orderStore.updateOrder(form.value.id, data)
      showToast('Order updated successfully! ✨', 'success')
    } else {
      orderStore.addOrder(data)
      showToast('Order created successfully! 🎉', 'success')
    }
    closeModal()
  }, isEditing.value ? 'Updating order...' : 'Creating order...')
  isSubmitting.value = false
}

function deleteOrder(id) {
  deleteId.value = id
  showDeleteModal.value = true
}

async function confirmDelete() {
  showDeleteModal.value = false
  await withLoading(async () => {
    await new Promise(r => setTimeout(r, 500))
    orderStore.deleteOrder(deleteId.value)
    showToast('Order deleted!', 'error')
  }, 'Deleting order...')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.modal-enter-active { transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.88) translateY(-24px); }

.list-enter-active { transition: all 0.4s ease; }
.list-leave-active { transition: all 0.3s ease; }
.list-enter-from { opacity: 0; transform: translateX(-30px); }
.list-leave-to { opacity: 0; transform: translateX(30px); }

.toast-enter-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(-50%) translateY(30px) scale(0.9); }
.toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(30px); }

.order-card { transition: all 0.25s ease; cursor: pointer; }
.order-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.08); border-color: #54bd95; }

.spin { animation: spin 0.8s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>
