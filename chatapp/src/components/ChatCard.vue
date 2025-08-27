<script setup>
import { computed } from "vue"
const props = defineProps({
  chat: {
    id: String,
    sender: String,
    date: Number,
    message: String,
    genre: Number,
    importance: Number
  }
})

// フォームのボタンに適切な重要度のクラスを付与する
const importanceClass = computed(() => {
  switch (props.chat.importance) {
    case 3:
      return "highImportant"
    case 2:
      return "middleImportant"
    case 1:
      return "lowImportant"
    case 0:
      return "done"
    default:
      return ""
  }
})

// 日付を見やすい形式に変換
const formattedDate = computed(() => {
  return new Date(props.chat.date).toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
})
</script>

<template>
  <div class="message-wrap" :class="importanceClass">
    <p class="sender">{{ chat.sender }}</p>
    <p class="message">{{ chat.message }}</p>
    <details>
      <summary>{{ formattedDate }}</summary>
      <p>ジャンル: {{ chat.genre }}</p>
      <p>重要度: {{ chat.importance }}</p>
      <p>ID: {{ chat.id }}</p>
    </details>
  </div>
</template>

<style scoped>
.message-wrap {
  max-width: 700px;
  border-radius: 8px;
  padding: 8px;
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
.message-wrap summary {
  color: #6d6d6d;
  font-size: 12px;
}
</style>