<!-- home.vue -->
<template>
  <div>
    home
    <div>{{ homeInfo }}</div>
  </div>
</template>


<script>
  export default {
    serverRequest(store) {
      // console.log('dispatch',store)
      return store.dispatch("getHomeInfo");
      // return 'store.dispatch("getHomeInfo")';
    },
    computed: {
      homeInfo() {
        return this.$store.state.homeInfo;
      }
    },
    mounted() {}
  };
</script>