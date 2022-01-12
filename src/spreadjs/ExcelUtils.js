import { saveAs } from 'file-saver'
import { IO } from '@grapecity/spread-excelio'

export const exportExcel = (
  fileName,
  spread,
  exportOptions = { includeBindingSource: true }
) => {
  if (fileName.substr(-5, 5) !== '.xlsx') {
    fileName += '.xlsx'
  }
  const json = spread.toJSON(exportOptions)
  // {
  //   includeBindingSource: true,
  //   ignoreFormula: false,
  // }
  new IO().save(
    json,
    function (blob) {
      saveAs(blob, fileName)
    },
    function (e) {
      console.log(e)
    }
  )
}

export const exportSsjson = (
  fileName,
  spread,
  exportOptions = {},
  designer
) => {
  const blob = new Blob(
    [
      JSON.stringify(
        getSsjson(
          spread,
          (exportOptions = { includeBindingSource: true }),
          designer
        )
      )
    ],
    { type: 'text/plaincharset=utf-8' }
  )

  if (fileName.substr(-7, 7) !== '.ssjson') {
    fileName += '.ssjson'
  }
  saveAs(blob, fileName)
}

export const getSsjson = (spread, exportOptions = {}, designer) => {
  const ssjson = spread.toJSON(exportOptions)
  if (designer) {
    const designerBindingPathSchema =
      designer.getData('treeNodeFromJson') ||
      designer.getData('updatedTreeNode') ||
      designer.getData('oldTreeNodeFromJson')
    if (designerBindingPathSchema) {
      ssjson.designerBindingPathSchema = JSON.parse(designerBindingPathSchema)
    }
  }
  return ssjson
}

export const importExcel = (file, spread, designer) => {
  const excelIo = new IO()
  excelIo.open(
    file,
    function (json) {
      spread.fromJSON(json, {})
      designer.refresh()
    },
    function (e) {
      console.error(e.errorMessage)
    }
  )
}

export const importSsjson = (file, spread, designer) => {
  const reader = new FileReader()
  reader.readAsText(file, 'UTF-8')
  // 读取成功触发onload事件
  reader.onload = function (evt) {
    const fileString = evt.target.result
    const jsonObj = JSON.parse(fileString)
    // console.log(jsonObj)
    if (jsonObj.designerBindingPathSchema) {
      designer.setData('treeNodeFromJson', JSON.stringify(jsonObj.designerBindingPathSchema))
      designer.setData('oldTreeNodeFromJson', JSON.stringify(jsonObj.designerBindingPathSchema))
    }
    spread.fromJSON(jsonObj)
    designer.refresh()
  }
  // 读取失败触发onerror
  reader.onerror = function (e) {
    console.log(e)
  }
}
