import * as keys from './keys'
import Vue from 'vue'

const state = {
  attribute: {}
}

const getters = {
  getAttribute: state => {
    return (name) => {
      return state.attribute[name] ? state.attribute[name] : null
    }
  }
}

const mutations = {
  initAttribute (state) {
    let username = JSON.parse(sessionStorage.getItem(keys.USER_STATE)).deviceAccount.username
    let attributeKey = username + '.' + keys.ATTRIBUTE_STATE
    let attribute = window.localStorage.getItem(attributeKey)
    if (attribute === null) {
      Vue.set(state, 'attribute', {})
    } else {
      Vue.set(state, 'attribute', JSON.parse(attribute))
    }
  },
  setAttribute (state, value) {
    let k = Object.keys(value)[0]
    let v = value[k]
    if (state.attribute === null) {
      Vue.set(state, 'attribute', {})
    }
    Vue.set(state.attribute, k, v)
  }
}

export default {
  state,
  getters,
  mutations
}
