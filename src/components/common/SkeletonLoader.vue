<template>
  <!-- Table Skeleton -->
  <div v-if="type === 'table'" class="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div class="bg-gray-50 border-b border-gray-200 px-4 py-3 flex gap-6">
      <div v-for="i in 6" :key="i" class="skeleton h-4 rounded" :style="`width: ${60 + i * 15}px`"></div>
    </div>
    <div v-for="i in rows" :key="i"
      class="px-4 py-3 border-b border-gray-100 flex gap-6 items-center"
      :style="`animation-delay: ${i * 0.05}s`">
      <div class="skeleton h-4 w-16 rounded"></div>
      <div class="skeleton h-4 w-28 rounded"></div>
      <div class="skeleton h-4 w-36 rounded"></div>
      <div class="skeleton h-4 w-10 rounded"></div>
      <div class="skeleton h-4 w-16 rounded"></div>
      <div class="skeleton h-6 w-20 rounded-full"></div>
      <div class="skeleton h-4 w-24 rounded"></div>
    </div>
  </div>

  <!-- Cards Skeleton (Mobile) -->
  <div v-if="type === 'cards'" class="space-y-3">
    <div v-for="i in rows" :key="i"
      class="bg-white rounded-lg border border-gray-200 p-4 space-y-3"
      :style="`animation-delay: ${i * 0.05}s`">
      <div class="flex justify-between items-start">
        <div class="space-y-2">
          <div class="skeleton h-4 w-32 rounded"></div>
          <div class="skeleton h-3 w-20 rounded"></div>
        </div>
        <div class="skeleton h-6 w-20 rounded-full"></div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div class="skeleton h-3 rounded"></div>
        <div class="skeleton h-3 rounded"></div>
        <div class="skeleton h-3 rounded"></div>
        <div class="skeleton h-3 rounded"></div>
      </div>
    </div>
  </div>

  <!-- KPI Skeleton -->
  <div v-if="type === 'kpi'"
    class="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
    <div class="skeleton h-4 w-28 rounded"></div>
    <div class="skeleton h-9 w-36 rounded"></div>
    <div class="skeleton h-3 w-20 rounded"></div>
  </div>

  <!-- Chart Skeleton -->
  <div v-if="type === 'chart'"
    class="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
    <div class="skeleton h-4 w-32 rounded"></div>
    <div class="skeleton h-48 w-full rounded-lg"></div>
    <div class="flex gap-3 justify-center">
      <div class="skeleton h-3 w-16 rounded"></div>
      <div class="skeleton h-3 w-16 rounded"></div>
      <div class="skeleton h-3 w-16 rounded"></div>
    </div>
  </div>

  <!-- Dashboard Grid Skeleton -->
  <div v-if="type === 'dashboard'" class="space-y-4">
    <!-- KPI Row -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i"
        class="bg-white rounded-xl border border-gray-200 p-5 space-y-3"
        :style="`animation-delay: ${i * 0.08}s`">
        <div class="skeleton h-3 w-24 rounded"></div>
        <div class="skeleton h-8 w-28 rounded"></div>
      </div>
    </div>
    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div v-for="i in 2" :key="i"
        class="bg-white rounded-xl border border-gray-200 p-5 space-y-3"
        :style="`animation-delay: ${(i + 4) * 0.08}s`">
        <div class="skeleton h-4 w-32 rounded"></div>
        <div class="skeleton h-44 w-full rounded-lg"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'table' },
  rows: { type: Number, default: 5 }
})
</script>

<style scoped>
.skeleton {
  background: linear-gradient(90deg,
    #f0f0f0 25%,
    #e4e4e4 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>