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
    let username = JSON.parse(localStorage.getItem(keys.USER_STATE)).deviceAccount.username
    let alarmKey = username + '.' + keys.ALARM_STATE
    let alarm = window.localStorage.getItem(alarmKey)
    if (alarm === null) {
      state.alarm = {}
    } else {
      state.alarm = JSON.parse(alarm)
    }
  },
  setAlarm (state, value) {
    let k = Object.keys(value)[0]
    let v = value[k]
    if (state.alarm === null) {
      state.alarm = {}
    }
    state.alarm[k] = v
    Vue.set(state.alarm, k, v)
  }
}

export default {
  state,
  getters,
  mutations
}
