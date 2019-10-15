import Stomp from 'stompjs'
import ReconnectingWebSocket from 'ReconnectingWebSocket'
import store from '../store'
import { http } from './http'

const operationTopic = '/topic/operation.'
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
      console.log('get request')
    })
    this.client.subscribe(operationTopic + 'set.' + deviceId, (msg) => {
      console.log('set request')
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
