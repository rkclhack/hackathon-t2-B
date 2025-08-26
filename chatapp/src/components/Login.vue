<script setup>
import { inject, ref } from "vue"
import { useRouter } from "vue-router"
import socketManager from "../socketManager.js"
import "./login.css"

// #region global state
const userName = inject("userName")
const employeeNumber = inject("employeeNumber")
// #endregion

// #region local variable
const router = useRouter()
const socket = socketManager.getInstance()
// #endregion

// #region reactive variable
const inputUserName = ref("")
const inputEmployeeNumber = ref("")
const inputPassword = ref("")
// #endregion

// #region browser event handler
// 入室メッセージをクライアントに送信する
const onEnter = () => {
  // ユーザー名が入力されているかチェック
  if (!inputEmployeeNumber.value.trim()) {
    alert("社員番号を入力してください。")
    return
  }
  if (!inputPassword.value.trim()) {
    alert("パスワードを入力してください。")
    return
  }
  // 入室情報を送信(既存のチャットを要求)
  socket.emit("loginEvent")
  // 全体で使用するnameに入力されたユーザー名を格納
  if (userName) userName.value = inputEmployeeNumber.value
  // チャット画面へ遷移
  router.push({ name: "chat" })
}
// #endregion
</script>

<template>
  <div class="login-container">
    <h1 class="login-title">Vue.js Chat サンプル</h1>

    <div class="login-form">
      <label class="login-label">社員番号</label>
      <input type="text" class="login-input" v-model="inputEmployeeNumber" />

      <label class="login-label">パスワード</label>
      <input type="password" class="login-input" v-model="inputPassword" />

      <button type="button" class="login-button" @click="onEnter">
        入室する
      </button>
    </div>
  </div>
</template>

<style scoped>
/*
.user-name-text {
  width: 200px;
  border: 1px solid #888;
  margin-bottom: 16px;
}*/
</style>
