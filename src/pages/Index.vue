<template>
  <q-page class="column justify-center items-center">
    <img class="col-1 q-ma-xs" alt="MicroIoT logo" src="statics/app-logo-128x128.png">
    <h3 class="col-8 q-ma-xs ">欢迎进入MicroIoT物联网平台</h3>
    <h6 class="q-ma-xs text-primary cursor-pointer" @click="$router.push({ path: '/home/device' })">{{$store.getters.getCurrentUser.string}}</h6>
  </q-page>
</template>

<script>
export default {
  name: 'home'
}
</script>
