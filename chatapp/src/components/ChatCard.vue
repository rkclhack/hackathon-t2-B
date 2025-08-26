<script setup>
defineProps({
  chat: {
    id: String,
    sender: String,
    date: Number,
    message: String,
    genre: Number,
    importance: Number
  }
})
</script>

<template>
  <div>
    {{ chat }}
  </div>
</template>

<style scoped>
</style>