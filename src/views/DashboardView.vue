<template>
  <div>

    <!-- Empty State (widgets இல்லாம) -->
    <Transition name="fade">
      <div v-if="!dashboardStore.isSaved && dashboardStore.widgets.length === 0"
        class="flex flex-col items-center justify-center py-24 px-4">
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center max-w-md w-full">
          <div class="w-16 h-16 bg-[#54bd95] bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl">📊</span>
          </div>
          <h3 class="text-gray-800 font-semibold text-lg mb-2">No widgets configured</h3>
          <p class="text-gray-400 text-sm mb-6">Click "Configure Dashboard" to start building your dashboard</p>
          <button
            @click="goToConfigure"
            class="bg-[#54bd95] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#3da87d] transition-all duration-200 hover:shadow-lg hover:shadow-green-200"
          >
            + Configure Dashboard
          </button>
        </div>
      </div>
    </Transition>

    <!-- Dashboard Widgets (saved ஆனதும்) -->
    <Transition name="page">
      <div v-if="dashboardStore.isSaved && dashboardStore.widgets.length > 0">

        <!-- Date Filter -->
        <div class="flex items-center gap-3 mb-6">
          <span class="text-sm text-gray-500 font-medium">Show data for</span>
          <select
            v-model="dashboardStore.dateFilter"
            class="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-[#54bd95] transition-colors duration-200 bg-white"
          >
            <option>All time</option>
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </select>
        </div>

        <!-- Widgets Grid -->
        <div class="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4">
          <TransitionGroup name="widget">
            <div
              v-for="widget in dashboardStore.widgets"
              :key="widget.id"
              :class="getWidgetClass(widget)"
              class="bg-white rounded-xl border border-gray-200 shadow-sm hover-card overflow-hidden"
            >
              <!-- Widget Header -->
              <div class="px-4 pt-4 pb-2 flex items-center justify-between">
                <h3 class="text-sm font-semibold text-gray-700">{{ widget.title }}</h3>
              </div>

              <!-- Widget Content -->
              <div class="px-4 pb-4">
                <!-- KPI Widget -->
                <div v-if="widget.type === 'kpi'" class="text-center py-2">
                  <p class="text-3xl font-bold text-[#54bd95]">{{ getKpiValue(widget) }}</p>
                  <p class="text-xs text-gray-400 mt-1">{{ widget.config.metric }}</p>
                </div>

                <!-- Chart Widgets -->
                <div v-else-if="['bar','line','area','scatter'].includes(widget.type)">
                  <apexchart
                    :type="getChartType(widget.type)"
                    :options="getChartOptions(widget)"
                    :series="getChartSeries(widget)"
                    height="200"
                  />
                </div>

                <!-- Pie Chart -->
                <div v-else-if="widget.type === 'pie'">
                  <apexchart
                    type="pie"
                    :options="getPieOptions(widget)"
                    :series="getPieSeries(widget)"
                    height="200"
                  />
                </div>

                <!-- Table Widget -->
                <div v-else-if="widget.type === 'table'" class="overflow-x-auto">
                  <table class="w-full text-xs">
                    <thead>
                      <tr :style="`background: ${widget.config.headerBg || '#54bd95'}`">
                        <th v-for="col in widget.config.columns" :key="col"
                          class="text-left px-3 py-2 text-white font-medium">{{ col }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="getTableRows(widget).length === 0">
                        <td :colspan="widget.config.columns.length" class="text-center py-4 text-gray-400">No data</td>
                      </tr>
                      <tr v-for="(row, i) in getTableRows(widget)" :key="i"
                        class="border-b border-gray-100 hover:bg-gray-50">
                        <td v-for="col in widget.config.columns" :key="col"
                          class="px-3 py-2 text-gray-600">{{ row[col] || '-' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>

      </div>
    </Transition>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useDashboardStore } from '../stores/useDashboardStore'
import { useOrderStore } from '../stores/useOrderStore'


const router = useRouter()
const dashboardStore = useDashboardStore()
const orderStore = useOrderStore()

function goToConfigure() {
  router.push('/configure')
}

function getWidgetClass(widget) {
  const w = widget.config?.width || 6
  if (w >= 12) return 'col-span-4 md:col-span-8 lg:col-span-12'
  if (w >= 8) return 'col-span-4 md:col-span-8 lg:col-span-8'
  if (w >= 6) return 'col-span-4 md:col-span-8 lg:col-span-6'
  if (w >= 4) return 'col-span-4 md:col-span-4 lg:col-span-4'
  if (w >= 3) return 'col-span-4 md:col-span-4 lg:col-span-3'
  return 'col-span-4 md:col-span-4 lg:col-span-4'
}

function getKpiValue(widget) {
  const { metric, aggregation, decimalPrecision, dataFormat } = widget.config
  const orders = orderStore.orders
  if (!metric || orders.length === 0) return '0'

  let values = orders.map(o => {
    if (metric === 'Total amount') return Number(o.totalAmount) || 0
    if (metric === 'Unit price') return Number(o.unitPrice) || 0
    if (metric === 'Quantity') return Number(o.quantity) || 0
    return 1
  })

  let result = 0
  if (aggregation === 'Sum') result = values.reduce((a, b) => a + b, 0)
  else if (aggregation === 'Average') result = values.reduce((a, b) => a + b, 0) / values.length
  else result = orders.length

  result = Number(result.toFixed(decimalPrecision || 0))
  if (dataFormat === 'Currency') return '$' + result.toLocaleString()
  return result.toLocaleString()
}

function getChartType(type) {
  if (type === 'bar') return 'bar'
  if (type === 'line') return 'line'
  if (type === 'area') return 'area'
  if (type === 'scatter') return 'scatter'
  return 'bar'
}

function getChartOptions(widget) {
  return {
    chart: { toolbar: { show: false }, background: 'transparent' },
    colors: [widget.config.chartColor || '#54bd95'],
    xaxis: { categories: getXAxisData(widget) },
    dataLabels: { enabled: widget.config.showDataLabel || false },
    stroke: { curve: 'smooth', width: 2 },
    fill: { opacity: widget.type === 'area' ? 0.3 : 1 },
    grid: { borderColor: '#f1f1f1' },
    tooltip: { theme: 'light' }
  }
}

function getChartSeries(widget) {
  return [{
    name: widget.config.yAxis || 'Value',
    data: getYAxisData(widget)
  }]
}

function getXAxisData(widget) {
  const field = widget.config.xAxis
  if (!field) return []
  return orderStore.orders.map(o => {
    if (field === 'Product') return o.product
    if (field === 'Status') return o.status
    if (field === 'Created by') return o.createdBy
    return o[field] || ''
  })
}

function getYAxisData(widget) {
  const field = widget.config.yAxis
  if (!field) return []
  return orderStore.orders.map(o => {
    if (field === 'Total amount') return Number(o.totalAmount) || 0
    if (field === 'Unit price') return Number(o.unitPrice) || 0
    if (field === 'Quantity') return Number(o.quantity) || 0
    return 1
  })
}

function getPieOptions(widget) {
  const field = widget.config.chartData
  const labels = field ? [...new Set(orderStore.orders.map(o => o[field === 'Product' ? 'product' : field === 'Status' ? 'status' : 'createdBy'] || 'Unknown'))] : []
  return {
    chart: { toolbar: { show: false } },
    labels,
    legend: { show: widget.config.showLegend !== false },
    colors: ['#54bd95', '#3da87d', '#f59e0b', '#3b82f6', '#ef4444'],
    tooltip: { theme: 'light' }
  }
}

function getPieSeries(widget) {
  const field = widget.config.chartData
  if (!field || orderStore.orders.length === 0) return [1]
  const key = field === 'Product' ? 'product' : field === 'Status' ? 'status' : 'createdBy'
  const counts = {}
  orderStore.orders.forEach(o => {
    const val = o[key] || 'Unknown'
    counts[val] = (counts[val] || 0) + 1
  })
  return Object.values(counts)
}

function getTableRows(widget) {
  const cols = widget.config.columns || []
  if (cols.length === 0) return []
  const colMap = {
    'Order ID': 'id', 'Customer name': 'firstName', 'Email id': 'email',
    'Phone number': 'phone', 'Product': 'product', 'Quantity': 'quantity',
    'Unit price': 'unitPrice', 'Total amount': 'totalAmount',
    'Status': 'status', 'Created by': 'createdBy'
  }
  let rows = orderStore.orders.map(o => {
    const row = {}
    cols.forEach(col => { row[col] = o[colMap[col]] || '-' })
    return row
  })
  const pagination = widget.config.pagination || 10
  return rows.slice(0, pagination)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.page-enter-active { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
.page-leave-active { transition: all 0.3s ease; }
.page-enter-from { opacity: 0; transform: translateY(20px); }
.page-leave-to { opacity: 0; }

.widget-enter-active { transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
.widget-leave-active { transition: all 0.3s ease; }
.widget-enter-from { opacity: 0; transform: scale(0.85) translateY(20px); }
.widget-leave-to { opacity: 0; transform: scale(0.85); }

.hover-card { transition: all 0.25s ease; }
.hover-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
</style>