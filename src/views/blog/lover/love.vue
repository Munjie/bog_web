

<template>
  <div style="width: 100%;height: 100%">
    <iframe :src='src' frameborder='0' style="height: 100%;width: 100%" ></iframe>
  </div>

</template>

<script setup>
export default {
  data(){
    return{
      src: ''
    }
  },
  mounted() {
    this.src = '../Love.html'
  }
};
</script>

<style scoped lang="stylus">

</style>
