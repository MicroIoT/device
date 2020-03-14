import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import myalarm from './myalarm'
import subscriber from './subscriber'
import timer from './timer'
import attribute from './attribute'
import arrays from './arrays'
import action from './action'
import alarm from './alarm'
import * as keys from './keys'
import { Notify } from 'quasar'

Vue.use(Vuex)

const localStoragePlugin = store => {
  store.subscribe((mutation, state) => {
    let type = mutation.type
    try {
      if (type === 'server' || type === 'quit') {
        window.sessionStorage.setItem(keys.SERVER_STATE, JSON.stringify(state.user.server))
      }
      if (type === 'token' || type === 'quit') {
        window.sessionStorage.setItem(keys.TOKEN_STATE, JSON.stringify(state.user.token))
      }
      if (type === 'login' || type === 'logout') {
        window.sessionStorage.setItem(keys.LOGIN_STATE, JSON.stringify(state.user.logined))
        window.sessionStorage.setItem(keys.USER_STATE, JSON.stringify(state.user.user))
      }
      if (type === 'setAttribute') {
        window.localStorage.setItem(JSON.parse(sessionStorage.getItem(keys.USER_STATE)).id + '.' + keys.ATTRIBUTE_STATE, JSON.stringify(state.attribute.attribute))
      }
      if (type === 'setAlarm') {
        window.localStorage.setItem(JSON.parse(sessionStorage.getItem(keys.USER_STATE)).id + '.' + keys.ALARM_STATE, JSON.stringify(state.alarm.alarm))
      }
      if (type === 'setActionResponse' || type === 'setActionRequest') {
        window.localStorage.setItem(JSON.parse(sessionStorage.getItem(keys.USER_STATE)).id + '.' + keys.ACTION_STATE, JSON.stringify(state.action.action))
      }
    } catch (e) {
      Notify.create({
        message: '请检查存储空间！'
      })
    }
  })
}

const store = new Vuex.Store({
  modules: {
    user,
    timer,
    subscriber,
    myalarm,
    attribute,
    arrays,
    action,
    alarm
  },
  plugins: [localStoragePlugin]
})

export default store
