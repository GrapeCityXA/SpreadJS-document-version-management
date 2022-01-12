<template>
  <el-main>
    <el-table :data="tableData" stripe="true" height="100%">
      <el-table-column label="文档名称">
        <template #default="scope">
          <el-link type="primary" :underline="false" icon="el-icon-document" @click="clickLink($event, scope.row.key, scope.row.fileName)">
            <span style="margin-left: 10px">{{ scope.row.fileName }}</span>
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="来自用户" width="350">
        <template #default="scope">
          <i class="el-icon-user"></i>
          <span style="margin-left: 10px">{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="查看时间" width="250">
        <template #default="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-main>
</template>

<script>
import { useRouter } from 'vue-router'
import { getDocumentList } from '../../requests'

export default {
  name: 'Table',
  data () {
    return {
      tableData: []
    }
  },
  mounted () {
    getDocumentList().then((documents) => {
      this.tableData = documents
    })
  },
  setup () {
    const router = useRouter()
    function clickLink (event, key, fileName) {
      event.preventDefault()
      console.log(arguments)
      router.push({ path: '/excel', query: { key: key, oper: 'open', fileName } })
    }

    return {
      clickLink
    }
  }
}
</script>
