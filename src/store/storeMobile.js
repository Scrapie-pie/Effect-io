const getDefaultState = () => {
    return {
        showChat: [],

    }
}
// initial state
const state = getDefaultState()

export default {
    namespaced: true,
    state,
    mutations: {
        resetState(state) {
            Object.assign(state, getDefaultState())
        },
        setShowChat(state, val) {
            state.showChat = val
        }
    },
    actions: {

    },
    getters: {

    }
}
