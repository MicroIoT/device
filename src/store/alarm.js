import * as keys from './keys'
import Vue from 'vue'

const state = {
  alarm: {}
}

const getters = {
  getAlarm: state => {
    return (name) => {
      return state.alarm[name] ? state.alarm[name] : null
    }
  }
}

const mutations = {
  initAlarm (state) {
    let id = JSON.parse(sessionStorage.getItem(keys.USER_STATE)).id
    let alarmKey = id + '.' + keys.ALARM_STATE
    let alarm = window.localStorage.getItem(alarmKey)
    if (alarm === null) {
      Vue.set(state, 'alarm', {})
    } else {
      Vue.set(state, 'alarm', JSON.parse(alarm))
    }
  },
  setAlarm (state, value) {
    let k = Object.keys(value)[0]
    let v = value[k]
    if (state.alarm === null) {
      Vue.set(state, 'alarm', {})
    }
    Vue.set(state.alarm, k, v)
  }
}

export default {
  state,
  getters,
  mutations
}
