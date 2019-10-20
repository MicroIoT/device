import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
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
        window.localStorage.setItem(keys.SERVER_STATE, JSON.stringify(state.user.server))
      }
      if (type === 'token' || type === 'quit') {
        window.localStorage.setItem(keys.TOKEN_STATE, JSON.stringify(state.user.token))
      }
      if (type === 'login' || type === 'logout') {
        window.localStorage.setItem(keys.LOGIN_STATE, JSON.stringify(state.user.logined))
        window.localStorage.setItem(keys.USER_STATE, JSON.stringify(state.user.user))
      }
      if (type === 'setAttribute') {
        window.localStorage.setItem(JSON.parse(localStorage.getItem(keys.USER_STATE)).deviceAccount.username + '.' + keys.ATTRIBUTE_STATE, JSON.stringify(state.attribute.attribute))
      }
      if (type === 'setActionResponse' || type === 'setActionRequest') {
        window.localStorage.setItem(JSON.parse(localStorage.getItem(keys.USER_STATE)).deviceAccount.username + '.' + keys.ACTION_STATE, JSON.stringify(state.action.action))
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
    attribute,
    arrays,
    action,
    alarm
  },
  plugins: [localStoragePlugin]
})

export default store
