<script setup>
import { inject } from "vue" 

// #region global state
// const userName = inject("userName")
// const employeeNumber = inject("employeeNumber")
const selectedGenre = inject("selectedGenre")
const props = defineProps({
  userName: String,
  employeeNumber: String
})
// #endregion
</script>

<template>
  <header>
    <div class="header-title">
      <h1>スマート<wbr>報連相</h1>
    </div>
    <div>
      <select id="genre-select" v-model="selectedGenre" class="genre-select">
        <option :value="0">全体</option>
        <option :value="1">あいさつ</option>
        <option :value="2">シフト</option>
        <option :value="3">業務連絡</option>
        <option :value="4">雑談</option>
      </select>
    </div>
    <div class="header-user">
      <details>
        <summary>{{ props.userName }}さん</summary>
        <div class="header-menu">
          <p>社員番号: {{ props.employeeNumber }}</p>
          <router-link to="/" class="link">
            <button type="button" class="button-normal button-exit">退室する</button>
          </router-link>
        </div>
      </details>
    </div>
  </header>
</template>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: rgb(255 255 255 / 33%);
  backdrop-filter: blur(7px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: -2px 0 5px rgba(0,0,0,0.2);
}

.header-title h1 {
  word-break: keep-all;
  font-size: 20px;
}

.genre-select {
  padding: 8px;
  margin-left: 8px;
  border: 1px solid #888;
  border-radius: 4px;
  background-color: white;
}

summary {
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 54px;
}

details > .header-menu {
  position: fixed;
  top: 80px;
  right: 0;
  width: 200px;
  height: 100px;
  background: white;
  box-shadow: -2px 0 5px rgba(0,0,0,0.2);
  display: none; /* デフォルト非表示 */
  border-radius: 8px;
  padding: 8px;
  box-sizing: border-box;
}

/* open状態のときだけ表示 */
details[open] > .header-menu {
  display: block;
}
</style>