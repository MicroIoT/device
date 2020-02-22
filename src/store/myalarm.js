import Vue from 'vue'

const state = {
  myalarm: {}
}

const getters = {
  getMyalarm: state => {
    return (name) => {
      return state.myalarm[name] ? state.myalarm[name] : null
    }
  }
}

const mutations = {
  setMyalarm (state, value) {
    let k = Object.keys(value)[0]
    let v = value[k]
    Vue.set(state.myalarm, k, v)
  }
}

export default {
  state,
  getters,
  mutations
}
