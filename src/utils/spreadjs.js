import GC from '@grapecity/spread-sheets'

/*
  执行表单保护，并缓存保护状态
*/
function protectWorkbook (spread, isProtect, protectStatus) {
  const sheets = spread.sheets
  spread.options.newTabVisible = !isProtect
  spread.suspendPaint()
  if (isProtect) {
    protectStatus = []
    sheets.forEach(sheet => {
      sheet.options.isProtected = true
      // 先判断并更改默认样式的锁定状态
      const sheetProtectStatus = {
        name: sheet.name(),
        defaultLocked: true,
        cellsLockedStatus: []
      }
      const defaultStyle = sheet.getDefaultStyle()
      sheetProtectStatus.defaultLocked = defaultStyle.locked
      if (!sheetProtectStatus.defaultLocked) {
        defaultStyle.locked = true
        sheet.setDefaultStyle(defaultStyle)
      }
      // 再按单元格进行遍历
      const cells = sheetProtectStatus.cellsLockedStatus
      const rowNum = sheet.getRowCount()
      const colNum = sheet.getColumnCount()
      for (let r = 0; r < rowNum; r++) {
        for (let c = 0; c < colNum; c++) {
          const isCellLocked = sheet.getCell(r, c).locked()
          if (!isCellLocked) {
            cells.push({
              row: r,
              col: c,
              locked: isCellLocked
            })
            sheet.getCell(r, c).locked(true)
          }
        }
      }
      protectStatus.push(sheetProtectStatus)
    })
  } else {
    clearDiffTags(spread)
    sheets.forEach(sheet => {
      sheet.options.isProtected = false
    })
    if (protectStatus) {
      protectStatus.forEach(status => {
        const sheet = spread.getSheetFromName(status.name)
        if (!status.defaultLocked) {
          const defaultStyle = sheet.getDefaultStyle()
          defaultStyle.locked = status.defaultLocked
          sheet.setDefaultStyle(defaultStyle)
        }
        const cells = status.cellsLockedStatus
        if (cells && cells.length > 0) {
          cells.forEach(cell => {
            sheet.getCell(cell.row, cell.col).locked(cell.locked)
          })
        }
      })
    }
    protectStatus = []
  }
  spread.resumePaint()
  return protectStatus
}

/*
  显示执行命令的Diff (his模块)
*/
function showCmdDiff (spread, cmds, diffColor) {
  const ranges = []
  if (cmds && cmds.length > 0) {
    // 收集diff区域
    for (let i = 0; i < cmds.length; i++) {
      const cmd = cmds[i]
      switch (cmd.cmd) {
        case 'editCell':
          console.log('editCell')
          ranges.push({
            sheetName: cmd.sheetName,
            ranges: [new GC.Spread.Sheets.Range(cmd.row, cmd.col, 1, 1)]
          })
          break
        case 'dragDrop':
          console.log('dragDrop')
          ranges.push({
            sheetName: cmd.sheetName,
            ranges: [
              new GC.Spread.Sheets.Range(cmd.fromRow, cmd.fromColumn, cmd.rowCount, cmd.columnCount),
              new GC.Spread.Sheets.Range(cmd.toRow, cmd.toColumn, cmd.rowCount, cmd.columnCount)
            ]
          })
          break
        case 'fill':
          console.log('fill')
          ranges.push({
            sheetName: cmd.sheetName,
            ranges: [
              new GC.Spread.Sheets.Range(cmd.fillRange.row, cmd.fillRange.col, cmd.fillRange.rowCount, cmd.fillRange.colCount)
            ]
          })
          break
        case 'clipboardPaste':
          console.log('clipboardPaste')
          ranges.push({
            sheetName: cmd.sheetName,
            ranges: cmd.pastedRanges.map((range) => {
              return new GC.Spread.Sheets.Range(range.row, range.col, range.rowCount, range.colCount)
            })
          })
          break
      }
    }
    // 开始标记diff, 覆盖全局自定义单元格
    /*
      注意此处用了tag，有覆盖原tag的风险，正式环境不可用
    */
    spread.suspendPaint()
    // 清除所有tag
    clearDiffTags(spread)
    // 设置tag
    ranges.forEach(range => {
      const sheet = spread.getSheetFromName(range.sheetName)
      range.ranges.forEach(r => {
        for (let i = r.row; i < r.row + r.rowCount; i++) {
          for (let j = r.col; j < r.col + r.colCount; j++) {
            sheet.setTag(i, j, {
              originalBackColor: diffColor
            })
          }
        }
      })
    })
    spread.resumePaint()
  } else {
    /*
      注意此处用了tag，有覆盖原tag的风险，正式环境不可用
    */
    spread.suspendPaint()
    // 清除所有tag
    clearDiffTags(spread)
    spread.resumePaint()
  }
  return ranges
}

/*
  显示两个workbook之间比对的diff (version模块)
*/
function showAllDiff (nowSpread, docJson, diffColor) {
  const versionDoc = new GC.Spread.Sheets.Workbook()
  versionDoc.fromJSON(docJson)

  nowSpread.suspendPaint()
  // 清除所有tag
  clearDiffTags(nowSpread)
  nowSpread.sheets.forEach(sheet => {
    versionDoc.sheets.forEach(vSheet => {
      if (sheet.name() === vSheet.name()) {
        const rowCount = sheet.getRowCount()
        const colCount = sheet.getColumnCount()
        for (let i = 0; i < rowCount; i++) {
          for (let j = 0; j < colCount; j++) {
            const val = sheet.getValue(i, j)
            const vVal = vSheet.getValue(i, j)
            if (val !== vVal) {
              sheet.setTag(i, j, {
                originalBackColor: diffColor
              })
            }
          }
        }
      }
    })
  })
  nowSpread.resumePaint()
}

/*
  清空 diff tags
*/
function clearDiffTags (spread) {
  // 清除所有tag
  spread.sheets.forEach(sheet => {
    const rowCount = sheet.getRowCount()
    const colCount = sheet.getColumnCount()
    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < colCount; j++) {
        const tag = sheet.getTag(i, j)
        if (tag && tag.originalBackColor) {
          tag.originalBackColor = undefined
          sheet.setTag(i, j, tag)
        }
      }
    }
  })
}

const cellTypes = GC.Spread.Sheets.CellTypes
const originalTextCellTypePaintLogic = cellTypes.Text.prototype.paint
const originalCheckboxCellTypePaintLogic = cellTypes.CheckBox.prototype.paint
const originalButtonCellTypePaintLogic = cellTypes.Button.prototype.paint
const originalHyperlinkCellTypePaintLogic = cellTypes.HyperLink.prototype.paint
const originalComboBoxCellTypePaintLogic = cellTypes.ComboBox.prototype.paint

function isShowDiffPaint (isShow) {
  if (isShow) showDiffPaint()
  else showNormalPaint()
}

/*
  自定义单元格实现diff样式显示
*/
function showDiffPaint () {
  GC.Spread.Sheets.CellTypes.Text.prototype.paint = function (ctx, value, x, y, w, h, style, options) {
    const sheet = options.sheet
    const tag = sheet.getTag(options.row, options.col)
    if (tag && tag.originalBackColor) {
      style.backColor = tag.originalBackColor
    }
    return originalTextCellTypePaintLogic.apply(this, [ctx, value, x, y, w, h, style, options])
  }
  GC.Spread.Sheets.CellTypes.CheckBox.prototype.paint = function (ctx, value, x, y, w, h, style, options) {
    const sheet = options.sheet
    const tag = sheet.getTag(options.row, options.col)
    if (tag && tag.originalBackColor) {
      style.backColor = tag.originalBackColor
    } else {
      style.backColor = undefined
    }
    return originalCheckboxCellTypePaintLogic.apply(this, [ctx, value, x, y, w, h, style, options])
  }
  GC.Spread.Sheets.CellTypes.Button.prototype.paint = function (ctx, value, x, y, w, h, style, options) {
    const sheet = options.sheet
    const tag = sheet.getTag(options.row, options.col)
    if (tag && tag.originalBackColor) {
      style.backColor = tag.originalBackColor
    } else {
      style.backColor = undefined
    }
    return originalButtonCellTypePaintLogic.apply(this, [ctx, value, x, y, w, h, style, options])
  }
  GC.Spread.Sheets.CellTypes.HyperLink.prototype.paint = function (ctx, value, x, y, w, h, style, options) {
    const sheet = options.sheet
    const tag = sheet.getTag(options.row, options.col)
    if (tag && tag.originalBackColor) {
      style.backColor = tag.originalBackColor
    } else {
      style.backColor = undefined
    }
    return originalHyperlinkCellTypePaintLogic.apply(this, [ctx, value, x, y, w, h, style, options])
  }
  GC.Spread.Sheets.CellTypes.ComboBox.prototype.paint = function (ctx, value, x, y, w, h, style, options) {
    const sheet = options.sheet
    const tag = sheet.getTag(options.row, options.col)
    if (tag && tag.originalBackColor) {
      style.backColor = tag.originalBackColor
    } else {
      style.backColor = undefined
    }
    return originalComboBoxCellTypePaintLogic.apply(this, [ctx, value, x, y, w, h, style, options])
  }
}

/*
  恢复原生单元格类型（从diff状态切换回来）
*/
function showNormalPaint () {
  GC.Spread.Sheets.CellTypes.Text.prototype.paint = originalTextCellTypePaintLogic
  GC.Spread.Sheets.CellTypes.CheckBox.prototype.paint = originalCheckboxCellTypePaintLogic
  GC.Spread.Sheets.CellTypes.Button.prototype.paint = originalButtonCellTypePaintLogic
  GC.Spread.Sheets.CellTypes.HyperLink.prototype.paint = originalHyperlinkCellTypePaintLogic
  GC.Spread.Sheets.CellTypes.ComboBox.prototype.paint = originalComboBoxCellTypePaintLogic
}

export {
  protectWorkbook,
  showCmdDiff,
  showAllDiff,
  showDiffPaint,
  showNormalPaint,
  isShowDiffPaint
}
