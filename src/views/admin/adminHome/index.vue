<template>
  <div v-if="roleId === 1">
    <admin-index></admin-index>
  </div>
</template>
<script>
  import {
    mapActions,
    mapGetters
  } from 'vuex'
  import adminIndex from './adminIndex'
  export default {
    name: 'adminHome',
    components: {
      adminIndex
    },
    data() {
      return {
        roleId: 0
      }
    },
    computed: {
      ...mapGetters([
        'adminInfo',
        'isLogin'
      ])
    },
    created() {
      if (this.adminInfo) {
        this.roleId = this.adminInfo.roleId
      }
    },
    mounted() {
      if (this.adminInfo) {
        this.roleId = this.adminInfo.roleId
      }
    },
    methods: {
      ...mapActions([
      ])
    }
  }
</script>


