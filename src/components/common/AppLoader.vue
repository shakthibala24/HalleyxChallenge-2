<template>
  <!-- Full Page Loader -->
  <div v-if="type === 'page'"
    class="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-[999]">
    <div class="flex flex-col items-center gap-4">
      <!-- Logo Spinner -->
      <div class="relative w-16 h-16">
        <div class="absolute inset-0 rounded-full border-4 border-gray-100"></div>
        <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-[#54bd95] spin"></div>
        <div class="absolute inset-2 rounded-full border-4 border-transparent border-t-[#3da87d] spin" style="animation-duration: 0.6s"></div>
      </div>
      <p class="text-sm text-gray-500 font-medium animate-pulse">{{ message || 'Loading...' }}</p>
    </div>
  </div>

  <!-- Inline Spinner -->
  <div v-else-if="type === 'spinner'"
    class="flex items-center justify-center p-8">
    <div class="relative w-10 h-10">
      <div class="absolute inset-0 rounded-full border-3 border-gray-100"></div>
      <div class="absolute inset-0 rounded-full border-3 border-transparent border-t-[#54bd95] spin"></div>
    </div>
  </div>

  <!-- Skeleton Table -->
  <div v-else-if="type === 'table'" class="space-y-3">
    <div v-for="i in (rows || 5)" :key="i"
      class="flex gap-4 px-4 py-3 bg-white rounded-lg border border-gray-100">
      <div class="skeleton h-4 w-24 rounded"></div>
      <div class="skeleton h-4 w-32 rounded"></div>
      <div class="skeleton h-4 w-40 rounded"></div>
      <div class="skeleton h-4 w-20 rounded"></div>
      <div class="skeleton h-4 w-20 rounded"></div>
      <div class="skeleton h-4 w-16 rounded"></div>
      <div class="skeleton h-4 w-20 rounded"></div>
    </div>
  </div>

  <!-- Skeleton Cards (Mobile) -->
  <div v-else-if="type === 'cards'" class="space-y-3">
    <div v-for="i in (rows || 3)" :key="i"
      class="bg-white rounded-lg border border-gray-100 p-4 space-y-3">
      <div class="flex justify-between">
        <div class="skeleton h-4 w-32 rounded"></div>
        <div class="skeleton h-5 w-16 rounded-full"></div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div class="skeleton h-3 w-full rounded"></div>
        <div class="skeleton h-3 w-full rounded"></div>
        <div class="skeleton h-3 w-full rounded"></div>
        <div class="skeleton h-3 w-full rounded"></div>
      </div>
    </div>
  </div>

  <!-- Skeleton Widget (Dashboard) -->
  <div v-else-if="type === 'widget'"
    class="bg-white rounded-xl border border-gray-100 p-4 space-y-3 h-full">
    <div class="skeleton h-4 w-32 rounded"></div>
    <div class="skeleton h-24 w-full rounded-lg"></div>
    <div class="flex gap-2">
      <div class="skeleton h-3 w-16 rounded"></div>
      <div class="skeleton h-3 w-20 rounded"></div>
    </div>
  </div>

  <!-- Skeleton KPI -->
  <div v-else-if="type === 'kpi'"
    class="bg-white rounded-xl border border-gray-100 p-4 space-y-2">
    <div class="skeleton h-3 w-24 rounded"></div>
    <div class="skeleton h-8 w-32 rounded"></div>
    <div class="skeleton h-3 w-16 rounded"></div>
  </div>

  <!-- Dots Loader -->
  <div v-else-if="type === 'dots'"
    class="flex items-center justify-center gap-2 p-4">
    <div v-for="i in 3" :key="i"
      class="w-2 h-2 rounded-full bg-[#54bd95]"
      :style="{ animation: `dotBounce 1.2s ease-in-out ${(i-1) * 0.2}s infinite` }">
    </div>
  </div>

  <!-- Button Loader -->
  <span v-else-if="type === 'button'"
    class="flex items-center gap-2">
    <svg class="spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
    {{ message || 'Loading...' }}
  </span>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'spinner'
  },
  message: String,
  rows: Number
})
</script>

<style scoped>
@keyframes dotBounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

.border-3 {
  border-width: 3px;
}
</style>