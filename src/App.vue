<template>
  <div>
    <home-view></home-view>
    <router-view></router-view>
  </div>
</template>

<script>
import HomeView from '../src/views/HomeView.vue';
export default {
  components: {HomeView},
  name: 'App',
}
</script>