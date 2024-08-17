<template>
  <div
    role="alert"
    class="fixed top-20 left-1/2 transform -translate-x-1/2 rounded-xl border border-gray-100 bg-white p-4 shadow-md flex items-start gap-4 w-11/12 sm:w-1/2 max-w-sm z-50"
  >
    <span class="text-green-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="h-6 w-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </span>

    <div class="flex-1">
      <strong class="block font-medium text-gray-900">
        {{ messageTitle }}
      </strong>
      <p class="mt-1 text-sm text-gray-700">{{ message }}</p>
    </div>

    <button
      @click="$emit('dismiss')"
      class="text-gray-500 transition hover:text-gray-600"
    >
      <span class="sr-only">Dismiss popup</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="h-6 w-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    messageTitle: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
/* Responsive Styles */
@media (max-width: 640px) {
  .fixed {
    top: 10%;
  }
}
</style>
