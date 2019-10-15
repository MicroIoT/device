import * as keys from './keys'

const state = {
  attribute: {}
}

const getters = {
  getAttribute: state => {
    return (name) => {
      return state.attribute ? state.attribute[name] : null
    }
  }
}

const mutations = {
  initAttribute (state) {
    let user = window.localStorage.getItem(keys.USER_STATE)
    let username = JSON.parse(user).deviceAccount.username
    let attributeKey = username + '.' + keys.ATTRIBUTE_STATE
    let attribute = window.localStorage.getItem(attributeKey)
    if (attribute === null) {
      state.attribute = new Map()
    } else {
      state.attribute = JSON.parse(attribute)
    }
  },
  setAttribute (state, value) {
    let k = Object.keys(value)[0]
    let v = value[k]
    state.attribute[k] = v
  }
}

export default {
  state,
  getters,
  mutations
}
