import http from '../utils/http'

/**
 * 获取模板列表
 */
function getDocumentList () {
  return new Promise((resolve, reject) => {
    http('get', '/documents').then(res => {
      resolve(res)
    }, error => {
      console.log('网络异常~', error)
      reject(error)
    })
  })
}

/**
 * 获取模板列表
 */
function getDocumentByKey (key) {
  return new Promise((resolve, reject) => {
    http('get', '/documents/' + key).then(res => {
      resolve(res)
    }, error => {
      console.log('网络异常~', error)
      reject(error)
    })
  })
}

/**
 * 保存模板
 */
const saveDocument = (document) => {
  return new Promise((resolve, reject) => {
    http('post', '/documents', document).then(res => {
      resolve(res)
    }, error => {
      console.log('网络异常~', error)
      reject(error)
    })
  })
}

/**
 * 修改模板
 */
const updateDocument = (document) => {
  return new Promise((resolve, reject) => {
    http('put', '/documents/' + document.key, document).then(res => {
      resolve(res)
    }, error => {
      console.log('网络异常~', error)
      reject(error)
    })
  })
}

/**
 * 删除模板
 */
const deleteDocument = (documentKey) => {
  return new Promise((resolve, reject) => {
    http('delete', '/documents/' + documentKey).then(res => {
      resolve(res)
    }, error => {
      console.log('网络异常~', error)
      reject(error)
    })
  })
}

export {
  getDocumentList,
  getDocumentByKey,
  saveDocument,
  updateDocument,
  deleteDocument
}
