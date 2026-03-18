<template>
  <div class="flex flex-col h-full">

    <!-- Configure Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <button @click="goBack"
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 text-gray-500">
          ←
        </button>
        <div>
          <h2 class="text-base font-semibold text-gray-800">Configure dashboard</h2>
          <p class="text-xs text-gray-400">Configure your dashboard to start viewing analytics</p>
        </div>
      </div>
      <div class="flex gap-2">
        <button @click="goBack"
          class="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          Cancel
        </button>
        <button @click="saveDashboard"
          class="px-4 py-2 text-sm text-white bg-[#54bd95] rounded-lg hover:bg-[#3da87d] transition-all duration-200 hover:shadow-lg hover:shadow-green-200 flex items-center gap-2">
          <span v-if="isSaving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full spin"></span>
          <span>{{ isSaving ? 'Saving...' : 'Save Configuration' }}</span>
        </button>
      </div>
    </div>

    <!-- Show data for -->
    <div class="flex items-center gap-3 mb-4">
      <span class="text-sm text-gray-500">Show data for</span>
      <select v-model="dashboardStore.dateFilter"
        class="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-[#54bd95] transition-colors bg-white">
        <option>All time</option>
        <option>Today</option>
        <option>Last 7 Days</option>
        <option>Last 30 Days</option>
        <option>Last 90 Days</option>
      </select>
    </div>

    <!-- Main Content -->
    <div class="flex gap-4 flex-1">

      <!-- Left Sidebar — Widget Library -->
      <div class="w-52 flex-shrink-0">
        <div class="bg-white rounded-xl border border-gray-200 p-3">
          <p class="text-xs font-semibold text-gray-500 mb-3 px-1">Widget library</p>
          <p class="text-xs text-gray-400 mb-3 px-1">Drag and drop your widget</p>

          <!-- Charts Accordion -->
          <div class="mb-2">
            <button @click="toggleSection('charts')"
              class="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <span class="text-xs font-semibold text-gray-700">Charts</span>
              <span class="text-gray-400 text-xs transition-transform duration-200"
                :class="{ 'rotate-180': openSections.charts }">▼</span>
            </button>
            <Transition name="accordion">
              <div v-if="openSections.charts" class="pl-2 space-y-1 mt-1">
                <div v-for="chart in chartWidgets" :key="chart.type"
                  draggable="true"
                  @dragstart="onDragStart($event, chart)"
                  class="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-[#54bd95] transition-all duration-200 group">
                  <span class="text-base">{{ chart.icon }}</span>
                  <span class="text-xs font-medium text-gray-700 group-hover:text-white transition-colors">{{ chart.label }}</span>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Tables Accordion -->
          <div class="mb-2">
            <button @click="toggleSection('tables')"
              class="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <span class="text-xs font-semibold text-gray-700">Tables</span>
              <span class="text-gray-400 text-xs transition-transform duration-200"
                :class="{ 'rotate-180': openSections.tables }">▼</span>
            </button>
            <Transition name="accordion">
              <div v-if="openSections.tables" class="pl-2 space-y-1 mt-1">
                <div
                  draggable="true"
                  @dragstart="onDragStart($event, { type: 'table', label: 'Table', icon: '📋' })"
                  class="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-[#54bd95] transition-all duration-200 group">
                  <span class="text-base">📋</span>
                  <span class="text-xs font-medium text-gray-700 group-hover:text-white transition-colors">Table</span>
                </div>
              </div>
            </Transition>
          </div>

          <!-- KPIs Accordion -->
          <div>
            <button @click="toggleSection('kpis')"
              class="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <span class="text-xs font-semibold text-gray-700">KPIs</span>
              <span class="text-gray-400 text-xs transition-transform duration-200"
                :class="{ 'rotate-180': openSections.kpis }">▼</span>
            </button>
            <Transition name="accordion">
              <div v-if="openSections.kpis" class="pl-2 space-y-1 mt-1">
                <div
                  draggable="true"
                  @dragstart="onDragStart($event, { type: 'kpi', label: 'KPI Value', icon: '🔢' })"
                  class="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-[#54bd95] transition-all duration-200 group">
                  <span class="text-base">🔢</span>
                  <span class="text-xs font-medium text-gray-700 group-hover:text-white transition-colors">KPI Value</span>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Canvas Area -->
      <div class="flex-1 relative">
        <div
          class="min-h-96 bg-white rounded-xl border-2 border-dashed border-gray-200 p-4 transition-all duration-200"
          :class="{ 'border-[#54bd95] bg-[#54bd95] bg-opacity-5': isDragOver }"
          @dragover.prevent="isDragOver = true"
          @dragleave="isDragOver = false"
          @drop.prevent="onDrop"
        >
          <!-- Empty Canvas -->
          <Transition name="fade">
            <div v-if="dashboardStore.widgets.length === 0"
              class="flex flex-col items-center justify-center py-20 text-gray-300">
              <span class="text-5xl mb-3">📊</span>
              <p class="text-sm">Drag and drop your widgets here</p>
            </div>
          </Transition>

          <!-- Widgets Grid -->
          <div class="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-3">
            <TransitionGroup name="widget">
              <div
                v-for="widget in dashboardStore.widgets"
                :key="widget.id"
                :class="getWidgetColSpan(widget)"
                class="relative group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden widget-card"
              >
                <!-- Widget Hover Actions -->
                <div class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  <button @click="openSettings(widget)"
                    class="w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-[#54bd95] hover:text-white hover:border-[#54bd95] transition-all duration-200 shadow-sm text-xs">
                    ⚙️
                  </button>
                  <button @click="deleteWidget(widget.id)"
                    class="w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 shadow-sm text-xs">
                    🗑️
                  </button>
                </div>

                <!-- Widget Content Preview -->
                <div class="p-3">
                  <p class="text-xs font-semibold text-gray-700 mb-2">{{ widget.title }}</p>

                  <!-- KPI Preview -->
                  <div v-if="widget.type === 'kpi'" class="text-center py-3">
                    <p class="text-2xl font-bold text-[#54bd95]">0</p>
                    <p class="text-xs text-gray-400">{{ widget.config.metric || 'Not configured' }}</p>
                  </div>

                  <!-- Chart Preview -->
                  <div v-else-if="['bar','line','area','scatter'].includes(widget.type)"
                    class="h-32 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div class="text-center">
                      <span class="text-2xl">{{ getWidgetIcon(widget.type) }}</span>
                      <p class="text-xs text-gray-500 mt-1 font-medium">{{ getWidgetLabel(widget.type) }}</p>
                    </div>
                  </div>

                  <!-- Pie Preview -->
                  <div v-else-if="widget.type === 'pie'"
                    class="h-32 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div class="text-center">
                      <span class="text-2xl">🥧</span>
                      <p class="text-xs text-gray-500 mt-1 font-medium">Pie Chart</p>
                    </div>
                  </div>

                  <!-- Table Preview -->
                  <div v-else-if="widget.type === 'table'"
                    class="h-32 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div class="text-center">
                      <span class="text-2xl">📋</span>
                      <p class="text-xs text-gray-500 mt-1 font-medium">Table Widget</p>
                    </div>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>

    </div>

    <!-- Settings Panel -->
    <Transition name="slide">
      <div v-if="showSettings && selectedWidget"
        class="fixed top-0 right-0 h-full w-80 bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col">

        <!-- Panel Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h3 class="text-sm font-semibold text-gray-800">Widget configuration</h3>
          <button @click="showSettings = false"
            class="text-gray-400 hover:text-gray-600 transition-colors duration-200 text-xl">✕</button>
        </div>

        <!-- Panel Body -->
        <div class="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          <!-- Widget Title -->
          <div>
            <label class="text-xs text-gray-600 mb-1 block">Widget title</label>
            <input v-model="selectedWidget.title" type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200"
            />
          </div>

          <!-- Widget Type (readonly) -->
          <div>
            <label class="text-xs text-gray-600 mb-1 block">Widget type</label>
            <div class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 capitalize">
              {{ getWidgetLabel(selectedWidget.type) }}
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="text-xs text-gray-600 mb-1 block">Description</label>
            <textarea v-model="selectedWidget.description" rows="2"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200 resize-none"
            ></textarea>
          </div>

          <!-- Widget Size -->
          <div>
            <p class="text-xs font-semibold text-gray-700 mb-2">Widget size</p>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs text-gray-600 mb-1 block">Width (Columns)</label>
                <input v-model.number="selectedWidget.config.width" type="number" min="1" max="12"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200"
                />
              </div>
              <div>
                <label class="text-xs text-gray-600 mb-1 block">Height (Rows)</label>
                <input v-model.number="selectedWidget.config.height" type="number" min="1"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200"
                />
              </div>
            </div>
          </div>

          <!-- KPI Settings -->
          <div v-if="selectedWidget.type === 'kpi'" class="space-y-3">
            <p class="text-xs font-semibold text-gray-700">Data setting</p>
            <div>
              <label class="text-xs text-gray-600 mb-1 block">Select metric</label>
              <select v-model="selectedWidget.config.metric"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200">
                <option value="">Choose metric</option>
                <option>Total amount</option>
                <option>Unit price</option>
                <option>Quantity</option>
                <option>Status</option>
                <option>Product</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-gray-600 mb-1 block">Aggregation</label>
              <select v-model="selectedWidget.config.aggregation"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200">
                <option>Sum</option>
                <option>Average</option>
                <option>Count</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-gray-600 mb-1 block">Data format</label>
              <select v-model="selectedWidget.config.dataFormat"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200">
                <option>Number</option>
                <option>Currency</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-gray-600 mb-1 block">Decimal Precision</label>
              <input v-model.number="selectedWidget.config.decimalPrecision" type="number" min="0"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200"
              />
            </div>
          </div>

          <!-- Chart Settings -->
          <div v-if="['bar','line','area','scatter'].includes(selectedWidget.type)" class="space-y-3">
            <p class="text-xs font-semibold text-gray-700">Data setting</p>
            <div>
              <label class="text-xs text-gray-600 mb-1 block">Choose X-Axis data</label>
              <select v-model="selectedWidget.config.xAxis"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200">
                <option value="">Choose X-Axis</option>
                <option>Product</option>
                <option>Status</option>
                <option>Created by</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-gray-600 mb-1 block">Choose Y-Axis data</label>
              <select v-model="selectedWidget.config.yAxis"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200">
                <option value="">Choose Y-Axis</option>
                <option>Total amount</option>
                <option>Unit price</option>
                <option>Quantity</option>
              </select>
            </div>
            <p class="text-xs font-semibold text-gray-700 pt-1">Styling</p>
            <div>
              <label class="text-xs text-gray-600 mb-1 block">Chart color</label>
              <div class="flex gap-2 items-center">
                <input type="color" v-model="selectedWidget.config.chartColor"
                  class="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-1"
                />
                <input type="text" v-model="selectedWidget.config.chartColor"
                  class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <input type="checkbox" v-model="selectedWidget.config.showDataLabel"
                class="w-4 h-4 accent-[#54bd95]" id="showDataLabel"
              />
              <label for="showDataLabel" class="text-xs text-gray-600">Show data label</label>
            </div>
          </div>

          <!-- Pie Chart Settings -->
          <div v-if="selectedWidget.type === 'pie'" class="space-y-3">
            <p class="text-xs font-semibold text-gray-700">Data setting</p>
            <div>
              <label class="text-xs text-gray-600 mb-1 block">Choose chart data</label>
              <select v-model="selectedWidget.config.chartData"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200">
                <option value="">Choose data</option>
                <option>Product</option>
                <option>Status</option>
                <option>Created by</option>
                <option>Quantity</option>
                <option>Total amount</option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <input type="checkbox" v-model="selectedWidget.config.showLegend"
                class="w-4 h-4 accent-[#54bd95]" id="showLegend"
              />
              <label for="showLegend" class="text-xs text-gray-600">Show legend</label>
            </div>
          </div>

          <!-- Table Settings -->
          <div v-if="selectedWidget.type === 'table'" class="space-y-3">
            <p class="text-xs font-semibold text-gray-700">Data setting</p>
            <div>
              <label class="text-xs text-gray-600 mb-1 block">Choose columns</label>
              <div class="space-y-1 border border-gray-200 rounded-lg p-3">
                <label v-for="col in tableColumns" :key="col"
                  class="flex items-center gap-2 cursor-pointer hover:bg-[#e8f7f2] rounded px-1 py-0.5">
                  <input type="checkbox"
                    :checked="selectedWidget.config.columns.includes(col)"
                    @change="toggleColumn(col)"
                    class="w-4 h-4 accent-[#54bd95]"
                  />
                  <span class="text-xs text-gray-600">{{ col }}</span>
                </label>
              </div>
            </div>
            <div>
              <label class="text-xs text-gray-600 mb-1 block">Sort by</label>
              <select v-model="selectedWidget.config.sortBy"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200">
                <option value="">None</option>
                <option>Ascending</option>
                <option>Descending</option>
                <option>Order date</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-gray-600 mb-1 block">Pagination</label>
              <select v-model.number="selectedWidget.config.pagination"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200">
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="15">15</option>
              </select>
            </div>
            <p class="text-xs font-semibold text-gray-700 pt-1">Styling</p>
            <div>
              <label class="text-xs text-gray-600 mb-1 block">Font size</label>
              <input v-model.number="selectedWidget.config.fontSize" type="number" min="12" max="18"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200"
              />
            </div>
            <div>
              <label class="text-xs text-gray-600 mb-1 block">Header background</label>
              <div class="flex gap-2 items-center">
                <input type="color" v-model="selectedWidget.config.headerBg"
                  class="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-1"
                />
                <input type="text" v-model="selectedWidget.config.headerBg"
                  class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#54bd95] transition-colors duration-200"
                />
              </div>
            </div>
          </div>

        </div>

        <!-- Panel Footer -->
        <div class="flex justify-end gap-3 px-5 py-4 border-t border-gray-200">
          <button @click="showSettings = false"
            class="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            Cancel
          </button>
          <button @click="applySettings"
            class="px-4 py-2 text-sm text-white bg-[#54bd95] rounded-lg hover:bg-[#3da87d] transition-colors duration-200">
            Add
          </button>
        </div>
      </div>
    </Transition>

    <!-- Settings Backdrop -->
    <Transition name="fade">
      <div v-if="showSettings"
        class="fixed inset-0 bg-black bg-opacity-20 z-40"
        @click="showSettings = false">
      </div>
    </Transition>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toastVisible" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
        <div class="flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium bg-[#54bd95]">
          ✅ {{ toastMessage }}
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '../stores/useDashboardStore'

const router = useRouter()
const dashboardStore = useDashboardStore()

const isDragOver = ref(false)
const showSettings = ref(false)
const selectedWidget = ref(null)
const isSaving = ref(false)
const toastVisible = ref(false)
const toastMessage = ref('')

const openSections = reactive({ charts: true, tables: true, kpis: true })

const chartWidgets = [
  { type: 'bar', label: 'Bar Chart', icon: '📊' },
  { type: 'line', label: 'Line Chart', icon: '📈' },
  { type: 'pie', label: 'Pie Chart', icon: '🥧' },
  { type: 'area', label: 'Area Chart', icon: '📉' },
  { type: 'scatter', label: 'Scatter Plot', icon: '🔵' },
]

const tableColumns = [
  'Customer ID', 'Customer name', 'Email id', 'Phone number',
  'Address', 'Order ID', 'Order date', 'Product',
  'Quantity', 'Unit price', 'Total amount', 'Status', 'Created by'
]

function toggleSection(section) {
  openSections[section] = !openSections[section]
}

function onDragStart(event, widget) {
  event.dataTransfer.setData('widget', JSON.stringify(widget))
}

function onDrop(event) {
  isDragOver.value = false
  const data = event.dataTransfer.getData('widget')
  if (!data) return
  const widget = JSON.parse(data)
  dashboardStore.addWidget(widget)
}

function openSettings(widget) {
  selectedWidget.value = { ...widget, config: { ...widget.config } }
  showSettings.value = true
}

function applySettings() {
  if (selectedWidget.value) {
    dashboardStore.updateWidget(selectedWidget.value.id, {
      title: selectedWidget.value.title,
      description: selectedWidget.value.description,
      config: selectedWidget.value.config
    })
  }
  showSettings.value = false
  showToast('Widget updated!')
}

function deleteWidget(id) {
  dashboardStore.removeWidget(id)
}

function toggleColumn(col) {
  const cols = selectedWidget.value.config.columns
  const index = cols.indexOf(col)
  if (index === -1) cols.push(col)
  else cols.splice(index, 1)
}

function getWidgetColSpan(widget) {
  const w = widget.config?.width || 6
  if (w >= 12) return 'col-span-4 md:col-span-8 lg:col-span-12'
  if (w >= 8) return 'col-span-4 md:col-span-8 lg:col-span-8'
  if (w >= 6) return 'col-span-4 md:col-span-8 lg:col-span-6'
  if (w >= 4) return 'col-span-4 md:col-span-4 lg:col-span-4'
  if (w >= 3) return 'col-span-4 md:col-span-4 lg:col-span-3'
  return 'col-span-4 md:col-span-4 lg:col-span-4'
}

function getWidgetIcon(type) {
  const icons = { bar: '📊', line: '📈', area: '📉', scatter: '🔵', pie: '🥧', table: '📋', kpi: '🔢' }
  return icons[type] || '📊'
}

function getWidgetLabel(type) {
  const labels = {
    bar: 'Bar Chart', line: 'Line Chart', area: 'Area Chart',
    scatter: 'Scatter Plot', pie: 'Pie Chart', table: 'Table', kpi: 'KPI Value'
  }
  return labels[type] || type
}

async function saveDashboard() {
  isSaving.value = true
  await new Promise(r => setTimeout(r, 800))
  dashboardStore.saveDashboard()
  isSaving.value = false
  showToast('Dashboard saved successfully!')
  setTimeout(() => router.push('/dashboard'), 1000)
}

function goBack() {
  router.push('/dashboard')
}

function showToast(msg) {
  toastMessage.value = msg
  toastVisible.value = true
  setTimeout(() => { toastVisible.value = false }, 3000)
}
</script>

<style scoped>
.accordion-enter-active, .accordion-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.accordion-enter-from, .accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
.accordion-enter-to, .accordion-leave-from {
  max-height: 300px;
  opacity: 1;
}

.slide-enter-active { transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from { transform: translateX(100%); opacity: 0; }
.slide-leave-to { transform: translateX(100%); opacity: 0; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.widget-enter-active { transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); }
.widget-leave-active { transition: all 0.3s ease; }
.widget-enter-from { opacity: 0; transform: scale(0.8) translateY(20px); }
.widget-leave-to { opacity: 0; transform: scale(0.8); }

.toast-enter-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(-50%) translateY(30px) scale(0.9); }
.toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(30px); }

.widget-card { transition: all 0.25s ease; }
.widget-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }

.spin { animation: spin 0.8s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>
