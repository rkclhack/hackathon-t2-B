<script setup>
import { inject, onMounted, onUnmounted ,ref } from "vue"
import { useRouter } from "vue-router"
import socketManager from "../socketManager.js"
import "./login.css"

const socket = socketManager.getInstance()
// #region global state
const userName = inject("userName")
// #endregion

// #region local variable
const router = useRouter()
// #endregion

// #region reactive variable
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

  socket.emit("loginEvent", {
    employeeNumber: inputEmployeeNumber.value,
    password: inputPassword.value
  })
}
  onMounted(() => { 
    socket.on("loginSuccess", onLoginSuccess)
    socket.on("loginFailed", onLoginFailed)
  })

  const onLoginSuccess = (data) => {
   if (userName) userName.value = data.userName
   router.push({ name: "chat" })
 }

 const onLoginFailed = (msg) => {
   alert(msg)
 }

 onUnmounted(() => {
   socket.off("loginSuccess", onLoginSuccess)
   socket.off("loginFailed", onLoginFailed)
 })
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

      <p style="margin-top: 12px;">
        <router-link :to="{ name: 'register' }">新規登録</router-link>
      </p>

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
