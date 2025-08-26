<script setup>
import socketManager from "../socketManager.js" 
import { computed, ref, watch } from "vue" 

const socket = socketManager.getInstance() 

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

// ローカル状態として管理(編集用)
const localGenre = ref(props.chat.genre)
const localImportance = ref(props.chat.importance)

// 他のユーザーからの更新を受信したときにローカル状態を更新
watch(() => props.chat.genre, (newGenre) => {
  localGenre.value = newGenre
})

watch(() => props.chat.importance, (newImportance) => {
  localImportance.value = newImportance
})

// ジャンルや重要度に変更がされているのかを判定
const hasChanges = computed(() => {
  return localGenre.value !== props.chat.genre || localImportance.value !== props.chat.importance
})

// ジャンルや重要度の変更を保存する
const saveChanges = () => {
  const updateData = {
    id: props.chat.id,
    genre: localGenre.value,
    importance: localImportance.value,
  }
  console.log(props.chat.importance)
  console.log(localGenre.value)
  socket.emit("updateMessageEvent", updateData)
}

// ジャンルや重要度の変更のキャンセル
const cancelChanges = () => {
  localGenre.value = props.chat.genre
  localImportance.value = props.chat.importance
}

// フォームのボタンに適切な重要度のクラスを付与する
const importanceClass = computed(() => {
  switch (localImportance.value) { 
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
const formattedDate = new Date(props.chat.date).toLocaleString("ja-JP", {
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit"
});
</script>

<template>
  <div class="message-wrap" :class="importanceClass">
    <p class="sender">{{ chat.sender }}</p>
    <p class="message">{{ chat.message }}</p>
    <details>
      <summary>{{ formattedDate }}</summary>

      <div>
        <label>表示ジャンル：</label>
        <select v-model="localGenre" class="select-box">
          <option :value="0">全体</option>
          <option :value="1">あいさつ</option>
          <option :value="2">シフト</option>
          <option :value="3">業務連絡</option>
          <option :value="4">雑談</option>
        </select>
      </div>

      <div>
        <label>重要度：</label>
        <select v-model="localImportance" class="select-box">
          <option :value="0">完了</option>
          <option :value="1">低</option>
          <option :value="2">中</option>
          <option :value="3">高</option>
        </select>
      </div>

      <div class="button-group" v-if="hasChanges">
        <button @click="saveChanges" class="save-button">変更を保存</button>
        <button @click="cancelChanges" class="cancel-button">キャンセル</button>
      </div>
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
.select-box {
  padding: 8px;
  margin-left: 8px;
  border: 1px solid #888;
  border-radius: 4px;
  background-color: white;
}
.button-group {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
.save-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
.save-button:hover {
  background-color: #45a049;
}
.cancel-button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
.cancel-button:hover {
  background-color: #da190b;
}
</style>