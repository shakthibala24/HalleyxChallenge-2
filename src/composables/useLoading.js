import { ref } from 'vue'

export function useLoading() {
  const isLoading = ref(false)
  const loadingText = ref('Loading...')

  async function withLoading(fn, text = 'Loading...') {
    loadingText.value = text
    isLoading.value = true
    try {
      await fn()
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, loadingText, withLoading }
}