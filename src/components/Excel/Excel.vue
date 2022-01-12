<template>
  <el-container style="border: 1px solid #eee">
    <el-header style="font-size: 16px; background-color: white; line-height:60px;">
      <el-link :underline="false" icon="el-icon-arrow-left" @click="clickLink">返回列表</el-link>
      <el-link :underline="false" icon="el-icon-document" @click="openEditFileName" style="margin-left: 50px; font-size: 16px;">{{ fileName }}</el-link>
      <el-link icon="el-icon-paperclip" @click="showHistory" style="margin-left: 50px;">
        <span v-if="isShowHistoryAside">关闭修改记录</span>
        <span v-else>打开修改记录</span>
      </el-link>
      <el-dropdown style="float: right; vertial">
        <i class="el-icon-setting" style="margin-right: 15px; line-height:60px;"></i>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>查看修改历史</el-dropdown-item>
            <el-dropdown-item>查看版本</el-dropdown-item>
            <el-dropdown-item>导出到本地Excel表格(.xlsx)</el-dropdown-item>
          </el-dropdown-menu>
        </template>
        <el-tooltip class="item" effect="light" content="Bottom Right 提示文字" placement="bottom-end">
          <span>Kevin</span>
        </el-tooltip>
      </el-dropdown>
    </el-header>
    <el-container>
      <el-main>
        <SpreadSheets v-on:designerInitialized="designerInitialized" />
      </el-main>
      <el-aside ref="versionAside" v-if="isShowHistoryAside" el-aside width="300px">
        <Version :workbook="workbook" v-on:closeHistoryAside="closeHistoryAside" />
      </el-aside>
    </el-container>
  </el-container>
</template>

<script>
import SpreadSheets from './SpreadSheets.vue'
import Version from './Version.vue'
import { useRouter } from 'vue-router'
import { getDocumentByKey, updateDocument } from '../../requests'
import { formatDate } from '../../utils/date'
import { protectWorkbook, isShowDiffPaint } from '../../utils/spreadjs'

export default {
  name: 'Excel',
  components: {
    SpreadSheets, Version
  },
  methods: {
    openEditFileName (e) {
      e.preventDefault()
      this.$prompt('请输入文件名', '修改文件名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: this.fileName
      }).then(({ value }) => {
        // 修改名称不计入版本
        getDocumentByKey(this.key).then((doc) => {
          doc.fileName = value
          updateDocument(doc).then((res) => {
            this.fileName = value
            this.$message({
              type: 'success',
              message: '修改成功，文件名改为: ' + value
            })
          })
        })
      }).catch((error) => {
        // ElMessage.error('创建失败')
        console.log('重命名失败：', error)
      })
    },
    showHistory (e) {
      e.preventDefault()
      this.isShowHistoryAside = !this.isShowHistoryAside
      const designer = this.designer
      this.$nextTick(function () {
        // 加保护
        const spread = designer.getWorkbook()
        this.protectStatus = []
        this.protectStatus = protectWorkbook(spread, this.isShowHistoryAside, this.protectStatus)
        designer.refresh()
      })
      isShowDiffPaint(this.isShowHistoryAside)
    },
    designerInitialized (designer) {
      this.designer = designer
      const workbook = designer.getWorkbook()
      this.workbook = workbook
      console.log('Excel.vue, designerInitialized, const workbook = this.workbook ', workbook)
      const key = this.$route.query.key
      this.key = key
      const fileName = this.$route.query.fileName
      this.fileName = fileName
      // const oper = this.$route.query.oper
      getDocumentByKey(key).then((doc) => {
        if (!doc.versions || doc.versions.length === 0) {
          // 用栈的形式，从头部推入
          doc.versions = []
          const info = {
            key: 1,
            vTime: formatDate(),
            userName: 'Kevin',
            desc: '创建新文档',
            docJson: workbook.toJSON({}, 'inner')
          }
          doc.versions.unshift(info)
          doc.hises = []
          doc.hises.unshift(info)
          updateDocument(doc).then((res) => {
            console.log(res)
          })
        } else {
          const json = doc.hises[0]?.docJson
          workbook.fromJSON(json, {}, 'inner')
        }
      })
    },
    closeHistoryAside () {
      this.isShowHistoryAside = false
      this.protectStatus = protectWorkbook(this.designer.getWorkbook(), false, this.protectStatus)
      this.designer.refresh()
    }
  },
  data () {
    return {
      isShowHistoryAside: false,
      fileName: null,
      key: 0,
      workbook: null
    }
  },
  setup () {
    const router = useRouter()
    function clickLink (event) {
      event.preventDefault()
      console.log(event)
      router.push('/MainList')
    }

    return {
      clickLink
    }
  }
}
</script>

<style scoped>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  /* padding: 0px 20px 0px 12px; */
}

.el-main {
  padding: 0;
}

.el-aside {
  margin-left: 20px;
}
</style>
