import Stomp from 'stompjs'
import ReconnectingWebSocket from 'ReconnectingWebSocket'
import store from '../store'
import { http } from './http'
import { Notify } from 'quasar'
import { toDataValue } from './util'

const operationTopic = '/topic/operation.'
const resultTopic = '/topic/result.'
class StompClient {
  constructor () {
    this.ws = {}
    this.client = {}
    this.subscriptions = new Map()
  }
  connect () {
    let wsUrl = store.getters.getWs + store.getters.getServer + '/ws_iot'

    this.ws = new ReconnectingWebSocket(wsUrl, null, { debug: false, maxReconnectAttempts: null, reconnectInterval: 10000 })
    this.client = Stomp.over(this.ws)
    let token = store.getters.getToken.token
    let header = {
      'Authorization': `Bearer ${token}`
    }
    this.client.connect(header, () => {
      this.manageSubscription()
    }, (error) => {
      if (error) {
        http('get', '/token', null, (response) => {
          store.commit('token', response.data)
          let token = store.getters.getToken.token
          let header = {
            'Authorization': `Bearer ${token}`
          }
          this.client.connect(header, () => {
            this.manageSubscription()
          })
        }, true)
      }
    })
  }

  manageSubscription () {
    let deviceId = store.getters.getCurrentUser.id
    this.client.subscribe(operationTopic + 'get.' + deviceId, (msg) => {
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
    this.client.subscribe(operationTopic + 'set.' + deviceId, (msg) => {
      let request = JSON.parse(msg.body)
      let topic = resultTopic + 'set.' + deviceId + '.' + request.requestId
      let value = toDataValue(request.attribute, request.value)
      store.commit('setAttribute', value)
      let response = { 'success': true }
      this.client.send(topic, {}, JSON.stringify(response))
      Notify.create({
        message: request.requester.username + '设置属性：' + request.attribute,
        color: 'positive'
      })
    })
    this.client.subscribe(operationTopic + 'action.' + deviceId, (msg) => {
      let request = JSON.parse(msg.body)
      let resp = store.getters.getActionResponse(request.action)
      let topic = resultTopic + 'action.' + deviceId + '.' + request.requestId
      if (resp) {
        let value = toDataValue(request.action, request.value)
        store.commit('setActionRequest', value)
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

  disconnect () {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe()
    })
    if (this.ws.readyState === WebSocket.OPEN) {
      this.client.disconnect(() => {
      })
    }
    // this.ws.close()
  }
}

export let stomp = new StompClient()
