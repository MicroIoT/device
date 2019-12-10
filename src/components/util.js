import store from '../store'
import { stomp } from './stomp'

export function getTypeInfo (dataType) {
  let info = ''
  if (dataType.type === 'Enum') {
    info = dataType.enumType
  } else if (dataType.type === 'String') {
    let min = dataType.min
    let max = dataType.max
    let mininfo, maxinfo
    if (min !== null) {
      mininfo = '最小长度:' + min
    }
    if (max !== null) {
      maxinfo = ' 最大长度:' + max
    }
    info = mininfo + maxinfo
  } else if (dataType.type === 'DateTime') {
    info = '日期格式：' + dataType.format
  } else if (dataType.type === 'Array') {
    info = dataType.dataType.type + '\n' + getTypeInfo(dataType.dataType)
  }
  return info
}
export function formatDate (date, simple) {
  var now = new Date()
  var day = now.getDate()
  var month = now.getMonth() + 1
  var year = now.getFullYear()
  var alarmMonth = parseInt(date.substr(5, 2))
  var alarmDay = parseInt(date.substr(8, 2))
  var alarmYear = parseInt(date.substr(0, 4))
  var alarmHMS = date.substr(11, 8)

  var alarmTime = alarmYear + '' + alarmMonth + '' + alarmDay
  var time = year + '' + month + '' + day
  if (time === alarmTime) {
    return alarmHMS
  } else {
    if (simple) {
      return alarmMonth + '月' + alarmDay + '日'
    } else {
      return alarmMonth + '月' + alarmDay + '日' + ' ' + alarmHMS
    }
  }
}
export function initSystem () {
  stomp.connect()
  store.commit('initAttribute')
  store.commit('initAction')
  store.commit('initAlarm')
}
export function toDataInfo (info) {
  let value = info.value
  let type = info.type
  let result
  if (type === 'Struct' || type === 'Choice') {
    result = { 'structValue': getStruct(value) }
  } else if (type === 'Array') {
    result = { 'arrayValue': getArray(value) }
  } else {
    result = { 'value': value }
  }
  return result
}
function getStruct (value) {
  let result = {}
  for (var key in value) {
    let info = value[key]
    let type = info.type
    let v = info.value
    if (type === 'Struct' || type === 'Choice') {
      result[key] = { 'structValue': getStruct(v) }
    } else if (type === 'Array') {
      result[key] = { 'arrayValue': getArray(v) }
    } else {
      result[key] = { 'value': v }
    }
  }
  return result
}
function getArray (value) {
  let arrayResult = []
  let result
  value.forEach((item, index, array) => {
    let type = item.type
    let v = item.value
    if (type === 'Struct' || type === 'Choice') {
      result = { 'structValue': getStruct(v) }
    } else if (type === 'Array') {
      result = { 'arrayValue': getArray(v) }
    } else {
      result = { 'value': v }
    }
    arrayResult.push(result)
  })
  return arrayResult
}
export function toDataValue (name, infoValue, dataType) {
  let dataValue = {}
  let result
  let string
  let key = Object.keys(infoValue)[0]
  if (key === 'structValue') {
    result = convertStruct(infoValue[key], dataType.attTypes)
    string = null
  } else if (key === 'arrayValue') {
    result = convertArray(infoValue[key], dataType.dataType)
    string = null
  } else if (key === 'value') {
    result = infoValue[key]
    string = result
  }
  dataValue[name] = { 'type': dataType.type, 'value': result, 'string': string }
  return dataValue
}
function convertStruct (value, attTypes) {
  let result
  let string
  let structResult = {}
  for (var key in value) {
    let info = value[key]
    let type = Object.keys(info)[0]
    let v = info[Object.keys(info)[0]]
    if (type === 'structValue') {
      result = convertStruct(v, attTypes[key].dataType.attTypes)
      string = null
    } else if (type === 'arrayValue') {
      result = convertArray(v, attTypes[key].dataType.dataType)
      string = null
    } else if (type === 'value') {
      result = v
      string = v
    }
    structResult[key] = { 'type': attTypes[key].dataType.type, 'value': result, 'string': string }
  }
  return structResult
}
function convertArray (value, dataType) {
  let arrayResult = []
  let result
  let string
  value.forEach((item, index, array) => {
    let type = Object.keys(item)[0]
    let v = item[Object.keys(item)[0]]
    if (type === 'structValue') {
      result = convertStruct(v, dataType.attTypes)
      string = null
    } else if (type === 'arrayValue') {
      result = convertArray(v, dataType.dataType)
      string = null
    } else if (type === 'value') {
      result = v
      string = v
    }
    arrayResult.push({ 'type': dataType.type, 'value': result, 'string': string })
  })
  return arrayResult
}
