<template>
  <el-container style="border: 1px solid #eee">
    <Aside />
    <el-container class="is-vertical">
        <Header />
        <Table />
    </el-container>
  </el-container>
</template>

<script>
import Aside from './Aside.vue'
import Header from './Header.vue'
import Table from './Table.vue'
export default {
  name: 'MainList',
  components: {
    Header, Table, Aside
  }
}
</script>
