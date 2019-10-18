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
      } else {
        let response = {}
        response.success = false
        response.error = 'attribute not set'
        this.client.send(topic, {}, JSON.stringify(response))
        Notify.create({
          message: '读取前请设置属性：' + request.attribute
        })
      }
    })
    this.client.subscribe(operationTopic + 'set.' + deviceId, (msg) => {
      let request = JSON.parse(msg.body)
      let topic = resultTopic + 'set.' + deviceId + '.' + request.requestId
      let value = toDataValue(request)
      store.commit('setAttribute', value)
      let response = { 'success': true }
      this.client.send(topic, {}, JSON.stringify(response))
    })
    this.client.subscribe(operationTopic + 'action.' + deviceId, (msg) => {
      console.log('action request')
    })
  }

  disconnect () {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe()
    })
    this.client.disconnect(() => {
    })
    // this.ws.close()
  }
}

export let stomp = new StompClient()
