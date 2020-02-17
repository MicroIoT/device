import Vue from 'vue'

const state = {
  timer: {}
}

const getters = {
  getTimer: state => {
    return (name) => {
      return state.timer[name] ? state.timer[name] : null
    }
  },
  getAllTimer: state => {
    return state.timer
  }
}

const mutations = {
  setTimer (state, value) {
    let k = Object.keys(value)[0]
    let v = value[k]
    Vue.set(state.timer, k, v)
  }
}

export default {
  state,
  getters,
  mutations
}
