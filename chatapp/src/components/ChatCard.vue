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
    <p class="sender">{{ chat.sender }}</p><br>
    <p class="message">{{ chat.message }}</p><br>
    <p class="date">{{ new Date(chat.date).toLocaleString() }}</p>
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
.sender {
  font-weight: bold;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.message {
  white-space: pre-wrap; /* 改行を保持 */
  word-wrap: break-word; /* 長い単語を折り返す */
}
</style>