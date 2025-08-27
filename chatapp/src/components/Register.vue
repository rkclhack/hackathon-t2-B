<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import socketManager from "../socketManager.js"
import "./login.css" // login.css を使用

const socket = socketManager.getInstance()
const router = useRouter()

// reactive variables
const inputUserName = ref("")
const inputEmployeeNumber = ref("")
const inputPassword = ref("")

// browser event handler
const onRegister = () => {
  if (!inputUserName.value.trim()) {
    alert("表示名を入力してください。")
    return
  }
  if (!inputEmployeeNumber.value.trim()) {
    alert("社員番号を入力してください。")
    return
  }
  if (!inputPassword.value.trim()) {
    alert("パスワードを入力してください。")
    return
  }

  socket.emit("registerEvent", {
    userName: inputUserName.value,
    employeeNumber: inputEmployeeNumber.value,
    password: inputPassword.value
  })
}

onMounted(() => {
    socket.on("registerSuccess", () => {
    alert("登録成功！ログインページに移動します。")
    router.push({ name: "login" })
  })

  socket.on("registerFailed", (msg) => {
    alert(msg)
  })
})
</script>

<template>
  <div class="login-container">
    <h1 class="login-title">スマート報連相 新規登録</h1>

    <div class="login-form">
      <label class="login-label">表示名</label>
      <input type="text" class="login-input" v-model="inputUserName" />

      <label class="login-label">社員番号</label>
      <input type="text" class="login-input" v-model="inputEmployeeNumber" />

      <label class="login-label">パスワード</label>
      <input type="password" class="login-input" v-model="inputPassword" />

      <button type="button" class="login-button" @click="onRegister">
        登録する
      </button>

      <p style="margin-top: 12px;">
        すでにアカウントをお持ちですか？
        <router-link :to="{ name: 'login' }">ログインはこちら</router-link>
      </p>
    </div>
  </div>
</template>
