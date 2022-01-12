<template>
  <el-tabs stretch v-model="activeName" @tab-click="handleClick" >
    <el-tab-pane label="历史" name="history">
      <el-empty v-if="!hisList || hisList.length===0" description="没有修改历史"></el-empty>
      <el-table :data="hisList" style="width: 100%" :show-header="false" highlight-current-row @current-change="hisSelectChanged" >
        <el-table-column prop="key" label="Key" width="290">
          <template #default="scope">
            <span style="font-weight: bold;">第{{ scope.row.key }}版</span>
            <button
              :id="recoverHisBtnId(scope.row.key)"
              style="margin-left: 174px;"
              @click="recoverHis(scope.row.key)">还 原</button>
            <br>
            <span>{{ scope.row.vTime }}</span><br>
            <span>{{ scope.row.userName }}</span>
            <span style="margin-left: 10px">{{ scope.row.desc }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="版本" name="version">
      <el-empty v-if="!versionList || versionList.length===0" description="没有版本信息"></el-empty>
      <el-table :data="versionList" style="width: 100%" :show-header="false" highlight-current-row @current-change="versionSelectChanged" >
        <el-table-column prop="key" label="Key" width="290">
          <template #default="scope">
            <span>{{ scope.row.vTime }}</span>
            <button :id="recoverVersionBtnId(scope.row.key)" style="margin-left: 90px;" @click="recoverVersion(scope.row.key)">还 原</button>
            <br>
            <span>{{ scope.row.userName }}</span>
            <span style="margin-left: 10px">{{ scope.row.desc }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { getDocumentByKey } from '../../requests'
import { toRaw } from '@vue/reactivity'
import { showCmdDiff, showAllDiff } from '../../utils/spreadjs'

export default {
  name: 'Version',
  data () {
    return {
      hisList: [],
      versionList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      activeName: 'history'
    }
  },
  props: ['workbook'],
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    hisSelectChanged (selection) {
      console.log('his: ', selection)
      console.log('hisList: ', this.hisList)
      const hisList = toRaw(this.hisList)
      const hisSel = toRaw(selection)
      const diff = hisList[0].key - hisSel.key
      const cmds = []
      for (let i = 0; i < diff; i++) {
        cmds.push(hisList[i].cmd)
      }
      showCmdDiff(this.workbook, cmds, 'red')
    },
    versionSelectChanged (selection) {
      console.log('version：', selection)
      // TODO 显示版本Diff
      showAllDiff(this.workbook, selection.docJson, 'blue')
    },
    recoverHisBtnId (key) {
      return 'recoverHisBtn' + key
    },
    recoverVersionBtnId (key) {
      return 'recoverVersionBtn' + key
    },
    recoverHis (key) {
      console.log('recoverHis ' + key)
      const his = this.hisList[this.hisList.length - key]
      const workbook = toRaw(this.workbook)
      workbook.fromJSON(his.docJson, {}, 'inner')
      this.$emit('closeHistoryAside')
    },
    recoverVersion (key) {
      console.log('recoverVersion ' + key)
      const version = this.versionList[this.versionList.length - key]
      const workbook = toRaw(this.workbook)
      workbook.fromJSON(version.docJson, {}, 'inner')
      this.$emit('closeHistoryAside')
    }
  },
  mounted () {
    // TODO
    const key = this.$route.query.key
    getDocumentByKey(key).then((doc) => {
      this.hisList = doc.hises
      this.versionList = doc.versions
    })
  }
}
</script>

<style scoped>
.el-table {
  min-width: 100%;
  display: inline-block;
  overflow-y: auto;
  overflow:auto;
  max-height: calc(100vh - 120px);
}
</style>
