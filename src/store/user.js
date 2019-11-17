import * as keys from './keys'

const state = {
  server: JSON.parse(window.sessionStorage.getItem(keys.SERVER_STATE)),
  token: JSON.parse(window.sessionStorage.getItem(keys.TOKEN_STATE)),
  logined: JSON.parse(window.sessionStorage.getItem(keys.LOGIN_STATE) || false),
  user: JSON.parse(window.sessionStorage.getItem(keys.USER_STATE))
}

const getters = {
  isLogined: state => {
    return state.logined
  },
  getCurrentUser: state => {
    return state.user
  },
  getServer: state => {
    return state.server.host
  },
  getToken: state => {
    return state.token
  },
  getWs: state => {
    if (state.server.protocol === 'iotp://') {
      return 'ws://'
    } else {
      return 'wss://'
    }
  },
  getHttp: state => {
    if (state.server.protocol === 'iotp://') {
      return 'http://'
    } else {
      return 'https://'
    }
  }
}

const mutations = {
  server (state, server) {
    state.server = server
  },
  token (state, token) {
    state.token = token
  },
  login (state, user) {
    state.logined = true
    state.user = user
  },
  logout (state) {
    state.logined = false
    state.user = ''
  },
  quit (state) {
    state.server = ''
    state.domain = ''
    state.token = ''
  }
}

export default {
  state,
  getters,
  mutations
}
