<template>
  <div>
    <h2>hello world</h2>
    <p>name:{{name}}</p>
    <button @click="handleChange">click</button>
    <img :src="smallImg" alt="小于10kb的图片" />
    <img :src="bigImg" alt="大于于10kb的图片" />
  </div>
</template>

<script setup lang="ts">
import smallImg from './images/lt10.png'
import bigImg from './images/gt10kb.png'
import './app.css'
import './app.less'
import {ref} from 'vue'
console.log('NODE_ENV', process.env.NODE_ENV)
console.log('BASE_ENV', process.env.BASE_ENV)
let name = ref('guocheng')
const handleChange = ()=>{
  name.value += '~'
}
</script>

<style scoped>

</style>
