import * as keys from './keys'
import Vue from 'vue'

const state = {
  action: {}
}

const getters = {
  getActionResponse: state => {
    return (name) => {
      let key = name + '.response'
      let response = state.action[key] ? state.action[key] : null
      if (response === null) {
        return null
      } else {
        let responseName = Object.keys(response)[0]
        return response[responseName]
      }
    }
  },
  getActionRequest: state => {
    return (name) => {
      let key = name + '.request'
      return state.action[key] ? state.action[key] : null
    }
  }
}

const mutations = {
  initAction (state) {
    let username = JSON.parse(sessionStorage.getItem(keys.USER_STATE)).deviceAccount.username
    let actionKey = username + '.' + keys.ACTION_STATE
    let action = window.localStorage.getItem(actionKey)
    if (action === null) {
      Vue.set(state, 'action', {})
    } else {
      Vue.set(state, 'action', JSON.parse(action))
    }
  },
  setActionResponse (state, value) {
    let action = Object.keys(value)[0]
    let response = value[action]
    if (state.action === null) {
      Vue.set(state, 'action', {})
    }
    let key = action + '.response'
    Vue.set(state.action, key, response)
  },
  setActionRequest (state, value) {
    let action = Object.keys(value)[0]
    let request = value[action]
    if (state.action === null) {
      Vue.set(state, 'action', {})
    }
    let key = action + '.request'
    Vue.set(state.action, key, request)
  }
}

export default {
  state,
  getters,
  mutations
}
