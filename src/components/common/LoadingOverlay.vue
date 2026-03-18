<template>
  <!-- Full Page Loading Overlay -->
  <Transition name="overlay">
    <div v-if="show"
      class="fixed inset-0 z-[9999] flex items-center justify-center"
      style="background: rgba(255,255,255,0.85); backdrop-filter: blur(4px);">
      <div class="flex flex-col items-center gap-4">

        <!-- Spinning Rings -->
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 rounded-full border-4 border-[#54bd95] border-opacity-20"></div>
          <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-[#54bd95] spin-fast"></div>
          <div class="absolute inset-2 rounded-full border-4 border-transparent border-t-[#3da87d] spin-slow"></div>
          <div class="absolute inset-[14px] rounded-full bg-[#54bd95] bg-opacity-10 flex items-center justify-center">
            <span class="text-[#54bd95] text-lg">⚡</span>
          </div>
        </div>

        <!-- Loading Text -->
        <div class="text-center">
          <p class="text-gray-700 font-semibold text-sm">{{ text }}</p>
          <div class="flex gap-1 justify-center mt-2">
            <span class="w-2 h-2 bg-[#54bd95] rounded-full dot1"></span>
            <span class="w-2 h-2 bg-[#54bd95] rounded-full dot2"></span>
            <span class="w-2 h-2 bg-[#54bd95] rounded-full dot3"></span>
          </div>
        </div>

      </div>
    </div>
  </Transition>

  <!-- Top Progress Bar -->
  <Transition name="progress">
    <div v-if="show" class="fixed top-0 left-0 right-0 z-[9999] h-1 overflow-hidden">
      <div class="h-full bg-gradient-to-r from-[#54bd95] via-[#3da87d] to-[#54bd95] progress-slide"></div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
  text: { type: String, default: 'Loading...' }
})
</script>

<style scoped>
/* Overlay fade */
.overlay-enter-active { transition: opacity 0.2s ease; }
.overlay-leave-active { transition: opacity 0.3s ease; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }

/* Progress bar */
.progress-enter-active { transition: opacity 0.2s ease; }
.progress-leave-active { transition: opacity 0.4s ease; }
.progress-enter-from, .progress-leave-to { opacity: 0; }

/* Spinning rings */
.spin-fast {
  animation: spin 0.8s linear infinite;
}
.spin-slow {
  animation: spin 1.4s linear infinite reverse;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Dots bounce */
.dot1 { animation: dotBounce 0.8s infinite ease-in-out 0s; }
.dot2 { animation: dotBounce 0.8s infinite ease-in-out 0.15s; }
.dot3 { animation: dotBounce 0.8s infinite ease-in-out 0.3s; }
@keyframes dotBounce {
  0%, 100% { transform: translateY(0); opacity: 0.5; }
  50% { transform: translateY(-6px); opacity: 1; }
}

/* Progress slide */
.progress-slide {
  animation: progressSlide 1.2s ease-in-out infinite;
  width: 40%;
}
@keyframes progressSlide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}
</style>