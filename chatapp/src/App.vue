<script setup>
import { provide, ref } from "vue"

// #region reactive state
const userName = ref("")
const employeeNumber = ref("")
// #endregion

// #region global variable
provide("userName", userName)
provide("employeeNumber", employeeNumber)
// #endregion
</script>

<template>
  <router-view />
</template>

<style scoped>
</style>
