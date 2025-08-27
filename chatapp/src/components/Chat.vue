<script setup>
import { inject, ref, reactive, onMounted, computed } from "vue"
import socketManager from '../socketManager.js'
import ChatCard from "./ChatCard.vue"

// #region global state
const userName = inject("userName")
// #endregion

// #region local variable
const socket = socketManager.getInstance()
// #endregion

// #region reactive variable
const chatContent = ref("")
const chatList = reactive([])
const selectedGenre = ref(0) // 選択したジャンルを変数にて保存 0:全て表示
const importance = ref(1) // 重要度(0:完了, 1:低, 2:中, 3:高)
// #endregion

// #region lifecycle
//選択されたジャンルに基づいてメッセージをフィルタリング
const filterChatList = computed(() => {
  if (selectedGenre.value === 0) {
    return chatList
  }
  return chatList.filter(chat => chat.genre === selectedGenre.value)
})

onMounted(() => {
  registerSocketEvent()
})
// #endregion

/**
 * @typedef {Object} chatData チャット送受信のオブジェクト
 * @property {string} id UUID
 * @property {string} sender 送信者
 * @property {number} date 送信した日時(ミリ秒として)
 * @property {string} message 送信メッセージ
 * @property {number} genre ジャンル
 * @property {number} importance 重要度
 */

// #region browser event handler
// 投稿メッセージをサーバに送信する
const onPublish = () => {
  /** @type {chatData} */
  const data = {
    id: self.crypto.randomUUID(),
    sender: userName.value,
    date: Date.now(),
    message: chatContent.value,
    genre: selectedGenre.value,
    importance: importance.value,
  }
  socket.emit("publishEvent", data)
  // 入力欄を初期化
  chatContent.value = ""
}

// 重要度の変更
const toggleImportance = () => {
  importance.value = (importance.value + 1) % 4
}

// フォームのボタンに適切な重要度のクラスを付与する
const importanceClass = computed(() => {
  switch (importance.value) {
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

// フォームのボタンに適切な重要度のテキストを付与する
const importanceText = computed(() => {
  switch (importance.value) {
    case 3:
      return "重要度:高"
    case 2:
      return "重要度:中"
    case 1:
      return "重要度:低"
    case 0:
      return "重要度:完了"
    default:
      return "重要度:?"
  }
})
// #endregion

// #region socket event handler
// サーバから受信した投稿メッセージを画面上に表示する
/**
 * @param {chatData} data 受け取ったチャット
 */
const onReceivePublish = (data) => {
  chatList.unshift(data)
}

// サーバーから受信した過去のメッセージを画面上に表示する
/**
 * @param {Array.<chatData>} messages 受け取ったチャットたち
 */
const onLoadMessages = (messages) => {
  // 既存のチャットリストをクリア
  chatList.length = 0
  messages.forEach((data) => {
    chatList.unshift(data)
  })
}

// メッセージ更新イベントの受信
const onMessageUpdated = (updateData) => {
  const messageIndex = chatList.findIndex(chat => chat.id === updateData.id)
  if (messageIndex !== -1) {
    chatList[messageIndex].genre = updateData.genre
    chatList[messageIndex].importance = updateData.importance
  }
}
// #endregion

// #region local methods
// イベント登録をまとめる
const registerSocketEvent = () => {
    // 過去のメッセージ履歴を受け取ったら実行
  socket.on("loadMessages", (messages) => {
    onLoadMessages(messages)
  })

  // 投稿イベントを受け取ったら実行
  socket.on("publishEvent", (data) => {
    onReceivePublish(data)
  })

  // メッセージ更新イベントを受け取ったら実行
  socket.on("messageUpdatedEvent", (data) => {
    onMessageUpdated(data)
  })
}
// #endregion
</script>

<template>
  <div class="mx-auto my-16 px-4">
    <h1 class="text-h3 font-weight-medium">Vue.js Chat チャットルーム</h1>
    <div class="mt-10">
      <p class="userName">ログインユーザ：{{ userName }}さん</p>
      <router-link to="/" class="link">
        <button type="button" class="button-normal button-exit">退室する</button>
      </router-link>

      <div class="mt-5">
        <label for="genre-select">表示ジャンル：</label>
        <select id="genre-select" v-model="selectedGenre" class="genre-select">
          <option :value="0">全体</option>
          <option :value="1">あいさつ</option>
          <option :value="2">シフト</option>
          <option :value="3">業務連絡</option>
          <option :value="4">雑談</option>
        </select>
      </div>
      <div class="mt-5" v-if="filterChatList.length !== 0">
        <ul>
          <li class="item mt-4" v-for="(chat) in filterChatList" :key="chat.id">
            <ChatCard :chat="chat" />
          </li>
        </ul>
      </div>
    </div>
    <div class="message-form">
      <button class="button-normal" :class="importanceClass" @click="toggleImportance">{{ importanceText }}</button>
      <textarea variant="outlined" placeholder="投稿文を入力してください" rows="4" v-model="chatContent"></textarea>
      <button class="button-normal" @click="onPublish">投稿</button>
    </div>
  </div>
</template>

<style scoped>
.link {
  text-decoration: none;
}

.area {
  width: 500px;
  border: 1px solid #000;
  margin-top: 8px;
}

.item {
  display: block;
}

.util-ml-8px {
  margin-left: 8px;
}

.button-exit {
  color: #000;
  margin-top: 8px;
}

.genre-select {
  padding: 8px;
  margin-left: 8px;
  border: 1px solid #888;
  border-radius: 4px;
  background-color: white;
}

.userName {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-form {
  width: 100%;
  height: 80px;
  left: 0;
  bottom: 0;
  position: fixed;
  background: white;
  display: flex;
  gap: 8px;
  padding: 8px;
}

.message-form textarea {
  width: 100%;
  border: 1px solid #000;
}
</style>
