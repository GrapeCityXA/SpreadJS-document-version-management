function formatDate (format, time) {
  const date = time || new Date()
  const map = {
    y: date.getFullYear(),
    M: date.getMonth() + 1,
    d: date.getDate(),
    H: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  }
  for (const i in map) {
    if (Object.prototype.hasOwnProperty.call(map, i)) {
      if (map[i] < 10) {
        map[i] = '0' + map[i]
      }
    }
  }
  format = format || 'yyyy-MM-dd HH:mm:ss'
  const reg = /y+|M+|d+|H+|m+|s+/g
  const regY = /y/
  format = format.replace(reg, function (v) {
    let old = v
    if (regY.test(v)) {
      const y = '' + map.y
      const len = 4 - v.length
      old = y.substr(len)
    } else {
      const key = v.substr(0, 1)
      old = map[key]
    }
    return old
  })
  return format
}

function stringToDate (dateStr) {
  const t = Date.parse(dateStr)
  if (!isNaN(t)) {
    return new Date(Date.parse(dateStr.replace(/-/g, '/')))
  }
  return new Date()
}

export {
  formatDate,
  stringToDate
}
