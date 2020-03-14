import { Stomp } from '@stomp/stompjs'
import store from '../store'
import { http } from './http'
import { Loading, Notify } from 'quasar'
import { toDataValue } from './util'

const operationTopic = '/topic/operation.'
const resultTopic = '/topic/result.'
const alarmTopic = '/topic/alarm.'
class StompClient {
  constructor () {
    this.ws = {}
    this.client = {}
    this.getSub = {}
    this.setSub = {}
    this.actionSub = {}
  }
  connect () {
    let wsUrl = store.getters.getWs + store.getters.getServer + '/ws_iot'

    this.client = Stomp.client(wsUrl)
    this.client.reconnect_delay = 10000
    let token = store.getters.getToken.token
    let header = {
      'Authorization': `Bearer ${token}`
    }
    this.client.connect(header, () => {
      this.manageSubscription()
    }, (error) => {
      if (error) {
        http('get', '/token', null, (response) => {
          if (!response) {
            this.client.disconnect(() => {
            })
            Notify.create({
              message: 'token过期，请重新登录！'
            })
          } else {
            store.commit('token', response.data)
            let token = store.getters.getToken.token
            let header = {
              'Authorization': `Bearer ${token}`
            }
            this.client.connect(header, () => {
              this.manageSubscription()
            })
          }
        }, true, false)
      }
    })
  }

  manageSubscription () {
    let deviceId = store.getters.getCurrentUser.id
    this.getSub = this.client.subscribe(operationTopic + 'get.' + deviceId, (msg) => {
      let request = JSON.parse(msg.body)
      let value = store.getters.getAttribute(request.attribute)
      let topic = resultTopic + 'get.' + deviceId + '.' + request.requestId
      if (value) {
        let response = {}
        response.value = value
        response.success = true
        this.client.send(topic, {}, JSON.stringify(response))
        Notify.create({
          message: request.requester.username + '读取属性：' + request.attribute,
          color: 'positive'
        })
      } else {
        let response = {}
        response.success = false
        response.error = 'attribute not set'
        this.client.send(topic, {}, JSON.stringify(response))
        Notify.create({
          message: '读取属性前请设置属性：' + request.attribute
        })
      }
    })
    this.setSub = this.client.subscribe(operationTopic + 'set.' + deviceId, (msg) => {
      let request = JSON.parse(msg.body)
      let topic = resultTopic + 'set.' + deviceId + '.' + request.requestId
      let type = store.getters.getCurrentUser.deviceType.attDefinition[request.attribute].dataType
      let value = toDataValue(request.attribute, request.value, type)
      store.commit('setAttribute', value)
      let response = { 'success': true }
      this.client.send(topic, {}, JSON.stringify(response))
      Notify.create({
        message: request.requester.username + '设置属性：' + request.attribute,
        color: 'positive'
      })
    })
    this.actionSub = this.client.subscribe(operationTopic + 'action.' + deviceId, (msg) => {
      let request = JSON.parse(msg.body)
      let resp = store.getters.getActionResponse(request.action)
      let topic = resultTopic + 'action.' + deviceId + '.' + request.requestId
      let actionType = store.getters.getCurrentUser.deviceType.actionTypes[request.action].request
      if (actionType) {
        let requestName = Object.keys(actionType)[0]
        let type = actionType[requestName].dataType
        let value = toDataValue(request.action, request.value, type)
        store.commit('setActionRequest', value)
      }
      if (resp) {
        let response = {}
        response.value = resp
        response.success = true
        this.client.send(topic, {}, JSON.stringify(response))
        Notify.create({
          message: request.requester.username + '执行操作：' + request.action,
          color: 'positive'
        })
      } else {
        let response = {}
        response.success = false
        response.error = 'action response not set'
        this.client.send(topic, {}, JSON.stringify(response))
        Notify.create({
          message: '执行操作前请设置操作的响应：' + request.action
        })
      }
    })
  }
  unSubscription () {
    this.getSub.unsubscribe()
    this.setSub.unsubscribe()
    this.actionSub.unsubscribe()
  }
  disconnect () {
    this.unSubscription()
    if (typeof this.client.disconnect === 'function') {
      this.client.disconnect(() => {
      })
    }
  }
  operate (deviceId, operateType, name, input, successCallback, failCallback) {
    let topic = '/topic/operation.' + operateType + '.' + deviceId
    let date = new Date()
    let requestId = date.valueOf()
    let request
    request = {
      requestId: requestId
    }
    if (operateType === 'action') {
      request.action = name
      request.value = input
    } else if (operateType === 'set') {
      request.attribute = name
      request.value = input[name]
    } else if (operateType === 'get') {
      request.attribute = name
    }
    Loading.show()
    let resultTopic = '/topic/result.' + operateType + '.' + deviceId + '.' + requestId
    let returned = false
    let subscription = this.client.subscribe(resultTopic, (msg) => {
      Loading.hide()
      subscription.unsubscribe()
      returned = true
      let result = JSON.parse(msg.body)
      if (result.success) {
        if (typeof successCallback === 'function') {
          successCallback(result)
        }
      } else {
        var error = result.error
        Notify.create({
          message: error
        })
        if (typeof failCallback === 'function') {
          failCallback()
        }
      }
    })
    this.client.send(topic, {}, JSON.stringify(request))
    setTimeout(() => {
      if (!returned) {
        Loading.hide()
        subscription.unsubscribe()
        Notify.create({
          message: '系统无响应！'
        })
      }
    }, 10000)
  }
  subscribe (topic, alarmCallback) {
    let subTopic = alarmTopic + topic
    let subscription = this.client.subscribe(subTopic, (msg) => {
      let alarm = JSON.parse(msg.body)
      let alert = new Audio('./statics/alert.wav')
      alert.type = 'audio/wav'
      alert.play()
      alarmCallback(alarm)
    })
    return subscription
  }
  unsubscribe (subscription) {
    subscription.unsubscribe()
  }
}

export let stomp = new StompClient()
