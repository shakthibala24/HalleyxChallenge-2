<template>
  <div class="min-h-screen bg-gray-100">

    <!-- Top Header -->
    <header class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-semibold text-gray-800">Customer Orders</h1>
          <p class="text-sm text-gray-500">View and manage customer orders and details</p>
        </div>
        <button
  @click="$router.push('/configure')"
  class="bg-[#54bd95] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3da87d]">
  + Configure Dashboard
</button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-6 mt-4">
        <RouterLink
          to="/dashboard"
          class="text-sm font-medium pb-2 border-b-2"
          :class="$route.path === '/dashboard'
            ? 'border-[#54bd95] text-[#54bd95]'
            : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          📊 Dashboard
        </RouterLink>
        <RouterLink
          to="/orders"
          class="text-sm font-medium pb-2 border-b-2"
          :class="$route.path === '/orders'
            ? 'border-[#54bd95] text-[#54bd95]'
            : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          📋 Table
        </RouterLink>
      </div>
    </header>

    <!-- Page Content -->
    <main class="p-6">
      <RouterView />
    </main>

  </div>
</template>