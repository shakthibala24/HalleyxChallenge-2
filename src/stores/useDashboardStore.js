import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useDashboardStore = defineStore('dashboard', () => {

  // localStorage-ல இருந்து load பண்ணு
  const savedWidgets = localStorage.getItem('halleyx-widgets')
  const savedLayout = localStorage.getItem('halleyx-layout')
  const savedFilter = localStorage.getItem('halleyx-filter')
  const savedIsSaved = localStorage.getItem('halleyx-issaved')

  const widgets = ref(savedWidgets ? JSON.parse(savedWidgets) : [])
  const layout = ref(savedLayout ? JSON.parse(savedLayout) : [])
  const isSaved = ref(savedIsSaved === 'true')
  const dateFilter = ref(savedFilter || 'All time')

  // Auto save — மாறும்போது localStorage-ல store ஆகும்
  watch(widgets, (val) => {
    localStorage.setItem('halleyx-widgets', JSON.stringify(val))
  }, { deep: true })

  watch(layout, (val) => {
    localStorage.setItem('halleyx-layout', JSON.stringify(val))
  }, { deep: true })

  watch(isSaved, (val) => {
    localStorage.setItem('halleyx-issaved', String(val))
  })

  watch(dateFilter, (val) => {
    localStorage.setItem('halleyx-filter', val)
  })

  function addWidget(widget) {
    const id = 'widget-' + Date.now()
    const newWidget = {
      id,
      type: widget.type,
      title: 'Untitled',
      description: '',
      config: getDefaultConfig(widget.type),
    }
    widgets.value.push(newWidget)
    layout.value.push({
      i: id,
      x: 0,
      y: getNextY(),
      w: getDefaultWidth(widget.type),
      h: getDefaultHeight(widget.type),
    })
  }

  function getDefaultConfig(type) {
    if (type === 'kpi') {
      return { metric: '', aggregation: 'Count', dataFormat: 'Number', decimalPrecision: 0 }
    } else if (type === 'pie') {
      return { chartData: '', showLegend: true }
    } else if (type === 'table') {
      return { columns: [], sortBy: '', pagination: 10, applyFilter: false, filters: [], fontSize: 14, headerBg: '#54bd95' }
    } else {
      return { xAxis: '', yAxis: '', chartColor: '#54bd95', showDataLabel: false }
    }
  }

  function getDefaultWidth(type) {
    if (type === 'kpi') return 3
    if (type === 'pie') return 4
    if (type === 'table') return 6
    return 6
  }

  function getDefaultHeight(type) {
    if (type === 'kpi') return 2
    if (type === 'pie') return 4
    if (type === 'table') return 4
    return 4
  }

  function getNextY() {
    if (layout.value.length === 0) return 0
    return Math.max(...layout.value.map(l => l.y + l.h))
  }

  function updateWidget(id, updates) {
    const index = widgets.value.findIndex(w => w.id === id)
    if (index !== -1) {
      widgets.value[index] = { ...widgets.value[index], ...updates }
    }
  }

  function removeWidget(id) {
    widgets.value = widgets.value.filter(w => w.id !== id)
    layout.value = layout.value.filter(l => l.i !== id)
  }

  function saveLayout(newLayout) {
    layout.value = newLayout
  }

  function saveDashboard() {
    isSaved.value = true
  }

  function resetDashboard() {
    widgets.value = []
    layout.value = []
    isSaved.value = false
    localStorage.removeItem('halleyx-widgets')
    localStorage.removeItem('halleyx-layout')
    localStorage.removeItem('halleyx-issaved')
  }

  return {
    widgets, layout, isSaved, dateFilter,
    addWidget, updateWidget, removeWidget,
    saveLayout, saveDashboard, resetDashboard
  }
})
