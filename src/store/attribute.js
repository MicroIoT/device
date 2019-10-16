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
