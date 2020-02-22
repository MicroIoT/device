import Vue from 'vue'

const state = {
  subscriber: {}
}

const getters = {
  getSubscriber: state => {
    return (name) => {
      return state.subscriber[name] ? state.subscriber[name] : null
    }
  },
  getAllSubscriber: state => {
    return state.subscriber
  }
}

const mutations = {
  setSubscriber (state, value) {
    let k = Object.keys(value)[0]
    let v = value[k]
    Vue.set(state.subscriber, k, v)
  }
}

export default {
  state,
  getters,
  mutations
}
