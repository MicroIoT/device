import * as keys from './keys'

const state = {
  attribute: JSON.parse(window.localStorage.getItem(
    JSON.parse(localStorage.getItem(keys.USER_STATE)).deviceAccount.username + '.' + keys.ATTRIBUTE_STATE))
}

const getters = {
  getAttribute: state => {
    return (name) => {
      return state.attribute ? state.attribute[name] : null
    }
  }
}

const mutations = {
  setAttribute (state, value) {
    let k = Object.keys(value)[0]
    let v = value[k]
    if (state.attribute === null) {
      state.attribute = {}
    }
    state.attribute[k] = v
  }
}

export default {
  state,
  getters,
  mutations
}
