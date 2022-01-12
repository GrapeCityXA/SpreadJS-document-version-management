<template>
  <div style="height:100%;">
    <!-- <div id="popContainer" class="popContainer"></div> -->
    <div id="gc-designer-container" ref="ssDesigner" style="height:100%; width:100%; text-align: left;"></div>
  </div>
</template>

<script>

import { defineComponent, onMounted, ref } from 'vue'
import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css'
import '@grapecity/spread-sheets-designer/styles/gc.spread.sheets.designer.min.css'
import '@grapecity/spread-sheets-resources-zh'
import '@grapecity/spread-sheets-designer-resources-cn'
import GC from '@grapecity/spread-sheets'
import '@grapecity/spread-sheets-designer'
import { getDocumentByKey, updateDocument } from '../../requests'
import { formatDate } from '../../utils/date'
import { useRoute } from 'vue-router'

window.GC = GC
GC.Spread.Common.CultureManager.culture('zh-cn')

export default defineComponent({
  name: 'SpreadSheets',
  props: {
  },
  setup (props, { emit }) {
    const ssDesigner = ref(null)
    const addVersion = (key, workbook, versionDesc, docJson) => {
      getDocumentByKey(key).then((doc) => {
        // 用栈的形式，从头部推入
        doc.versions.unshift({
          key: doc.versions.length + 1,
          vTime: formatDate(),
          userName: 'Kevin',
          desc: versionDesc,
          docJson
        })
        updateDocument(doc).then((res) => {
          console.log(res)
        })
      })
    }
    const exportVersion = function (key, workbook, docJson) {
      console.log('导出操作')
      addVersion(key, workbook, '导出一份文档到本地', docJson)
    }
    const importVersion = function (key, workbook) {
      console.log('导入操作')
      addVersion(key, workbook, '从本地导入一份文档')
    }
    onMounted(() => {
      /*
        这部分禁用“新建页签”
      */
      const fileMenuPanelTemplate = GC.Spread.Sheets.Designer.getTemplate(GC.Spread.Sheets.Designer.TemplateNames.FileMenuPanelTemplate)
      const pageList = fileMenuPanelTemplate.content[0].children[0].children[1].children
      if (pageList[0]?.visibleWhen === 'activeCategory_main=New') {
        pageList.splice(0, 1)
      }
      const itemList = fileMenuPanelTemplate.content[0].children[0].children[0].children[0].children[1].items
      if (itemList[0]?.value === 'New') {
        itemList.splice(0, 1)
      }
      GC.Spread.Sheets.Designer.registerTemplate(GC.Spread.Sheets.Designer.TemplateNames.FileMenuPanelTemplate, fileMenuPanelTemplate)

      // 初始化SpreadJS
      const designer = new GC.Spread.Sheets.Designer.Designer(ssDesigner.value)
      const oldToJSON = GC.Spread.Sheets.Workbook.prototype.toJSON
      const route = useRoute()
      const key = route.query.key
      const newToJSON = function () {
        const result = oldToJSON.apply(this, arguments)
        if (arguments[1] === 'inner') {
          return result
        }
        // TODO 在这里执行版本导出操作
        exportVersion(key, this, result)
        return result
      }
      GC.Spread.Sheets.Workbook.prototype.toJSON = newToJSON
      const oldFromJSON = GC.Spread.Sheets.Workbook.prototype.fromJSON
      const newFromJSON = function () {
        const result = oldFromJSON.apply(this, arguments)
        if (arguments[2] === 'inner') {
          return result
        }
        // TODO 在这里执行版本导入操作
        importVersion(key, this)
        return result
      }
      GC.Spread.Sheets.Workbook.prototype.fromJSON = newFromJSON
      emit('designerInitialized', designer)

      const spread = designer.getWorkbook()
      const cmds = [
        'editCell',
        'dragDrop',
        'fill',
        'clipboardPaste',
        'resizeRow',
        'resizeColumn',
        'gc.spread.contextMenu',
        'Designer'
      ]
      // 同步命令
      spread.commandManager().addListener('anyscLicenser', function () {
        let isEdited = false
        const hisItem = {
          vTime: formatDate(),
          userName: 'Kevin',
          docJson: spread.toJSON({}, 'inner'),
          cmd: null
        }
        for (let i = 0; i < arguments.length; i++) {
          const cmd = arguments[i].command
          // if (cmd.clipboardText) {
          //   cmd.fromSheet = null
          //   cmd.fromRanges = null
          // }
          console.log('触发命令：', arguments)
          if (cmd && cmd.cmd) {
            const cmdName = cmd.cmd
            isEdited = cmds.some((item) => {
              return item === cmdName || cmdName.startsWith(item)
            })
            if (isEdited) {
              hisItem.cmd = cmd
            }
          }
        }
        if (isEdited) {
          getDocumentByKey(key).then((doc) => {
            // 用栈的形式，从头部推入
            hisItem.key = doc.hises.length + 1
            doc.hises.unshift(hisItem)
            updateDocument(doc).then((res) => {
              console.log(res)
            })
          })
        }
      })
    })
    return {
      ssDesigner
    }
  }
})
</script>

<style scoped>
.popContainer {
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 100;
}
</style>
