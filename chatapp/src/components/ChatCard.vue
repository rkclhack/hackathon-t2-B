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
  <div class="border rounded-lg p-4 mb-4 bg-white shadow">
  <div :class="{highImportant : chat.importance === 3, middleImportant : chat.importance === 2, lowImportant : chat.importance === 1, done : chat.importance === 0}">
    名前：{{ chat.sender }}<br>
    {{chat.message}}<br>
    時刻：{{ new Date(chat.date).toLocaleString() }}
  </div>
  </div>
</template>

<style scoped>
.highImportant {
  background-color: #ffe5e5; /* 薄い赤色の背景 */
}
.middleImportant {
  background-color: #fff5e5; /* 薄いオレンジ色の背景 */
}
.lowImportant {
  background-color: #e5ffe5; /* 薄い緑色の背景 */
}
.done {
  background-color: #f0f0f0; /* 薄い灰色の背景 */
}
</style>