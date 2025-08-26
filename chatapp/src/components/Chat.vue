<script setup>
import { inject, ref, reactive, onMounted } from "vue"
import socketManager from '../socketManager.js'

// #region global state
const userName = inject("userName")
// #endregion

// #region local variable
const socket = socketManager.getInstance()
// #endregion

// #region reactive variable
const chatContent = ref("")
const chatList = reactive([])
// #endregion

// #region lifecycle
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
    genre: 1, // とりあえずデフォルト値を入れておきます
    importance: 1 // 上記同様
  }
  socket.emit("publishEvent", data)
  // 入力欄を初期化
  chatContent.value = ""
}

// 退室メッセージをサーバに送信する
const onExit = () => {
  socket.emit("exitEvent", userName.value + "さんが退室しました")
}

const onKeyDown = (e) => {
  if((e.key === "Enter" || e.code === "Enter") && chatContent.value.replace(/\s/g, "").length > 0){
    e.preventDefault()
    onPublish()
  }
}

// #endregion

// #region socket event handler

// サーバから受信した投稿メッセージを画面上に表示する
/**
 * @param {chatData} data 受け取ったチャット
 */
const onReceivePublish = (data) => {
  chatList.unshift("日時: " + new Date(data.date).toLocaleString())
  chatList.unshift(data.sender + "さん: " + data.message)
}
// #endregion

// #region local methods
// イベント登録をまとめる
const registerSocketEvent = () => {
  // 投稿イベントを受け取ったら実行
  socket.on("publishEvent", (data) => {
    onReceivePublish(data)
  })
}
// #endregion
</script>

<template>
  <div class="mx-auto my-5 px-4">
    <h1 class="text-h3 font-weight-medium">Vue.js Chat チャットルーム</h1>
    <div class="mt-10">
      <p>ログインユーザ：{{ userName }}さん</p>
      <textarea variant="outlined" placeholder="投稿文を入力してください" rows="4" class="area" v-model="chatContent" @keydown="onKeyDown"></textarea>
      <div class="mt-5">
        <button class="button-normal" @click="onPublish">投稿</button>
      </div>
      <div class="mt-5" v-if="chatList.length !== 0">
        <ul>
          <li class="item mt-4" v-for="(chat, i) in chatList" :key="i">{{ chat }}</li>
        </ul>
      </div>
    </div>
    <router-link to="/" class="link">
      <button type="button" class="button-normal button-exit">退室する</button>
    </router-link>
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
</style>
