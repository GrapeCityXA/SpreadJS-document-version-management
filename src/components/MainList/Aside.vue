<template>
  <el-aside width="270px" style="background-color: rgb(238, 241, 246)">
    <div class="logoDiv">
      <img src="../../assets/logo_spjs.png" class="logo" alt="logo" />
    </div>
    <div class="buttonDiv">
      <el-row :justify="center">
        <el-col><el-button type="primary" icon="el-icon-plus" class="button" v-on:click="newDocument">新建表格</el-button></el-col>
      </el-row>
      <el-row :justify="center">
        <el-col>
          <el-button icon="el-icon-upload2" class="button" v-on:click="importLocalDocument">导入本地Excel</el-button>
          <input type="file" id="importFile" style="display: none;" @change="importFileChanged"/>
        </el-col>
      </el-row>
    </div>
  </el-aside>
</template>

<script>
import { saveDocument } from '../../requests'
import { ElMessage } from 'element-plus'
import { formatDate } from '../../utils/date'
import * as Excel from '@grapecity/spread-excelio'

export default {
  name: 'Aside',
  methods: {
    newDocument () {
      // TODO 创建doc
      console.log('创建doc')
      const fileName = '新建文档'
      const doc = {
        fileName,
        userName: 'Kevin',
        createTime: formatDate()
      }
      saveDocument(doc).then((res) => {
        // TODO 跳转
        ElMessage.success('创建成功，跳转中...')
        console.log(res)
        this.$router.push({ path: '/excel', query: { key: res.key, oper: 'new', fileName } })
      }).catch((error) => {
        // 提示
        ElMessage.error('创建失败')
        console.log(error)
      })
    },
    importLocalDocument () {
      // TODO 导入本地doc
      console.log('导入本地doc')
      document.getElementById('importFile').click()
    },
    importFileChanged () {
      const file = document.getElementById('importFile').files[0]
      const fileName = file.name
      const excelIo = new Excel.IO()
      excelIo.open(
        file,
        (json) => {
          const info = {
            key: 1,
            vTime: formatDate(),
            userName: 'Kevin',
            desc: '导入本地文档 ' + fileName,
            docJson: json
          }
          const doc = {
            fileName: fileName,
            userName: 'Kevin',
            createTime: formatDate(),
            versions: [info],
            hises: [info]
          }
          saveDocument(doc).then((res) => {
            // TODO 跳转
            ElMessage.success('导入成功，跳转中...')
            console.log(res)
            this.$router.push({ path: '/excel', query: { key: res.key, oper: 'import', fileName } })
          }).catch((error) => {
            // 提示
            ElMessage.error('导入失败')
            console.log(error)
          })
        }
      )
    }
  }
}
</script>

<style>
.el-aside {
  color: #333;
  max-height: 100%;
}

.logoDiv {
  width: 100%;
  text-align: center;
  height: 80px;
}

.logo {
  height: 50px;
  margin-top: 10px;
}

.buttonDiv {
  width: 100%;
  text-align: center;
}

.button {
  width: 180px;
  margin: 10px 0px;
}
</style>
