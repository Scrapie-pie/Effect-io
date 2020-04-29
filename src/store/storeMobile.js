const getDefaultState = () => {
    return {
        showChat: false,

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
        showChat: (state, getters, rootState) => {
            return state.showChat
        }
    }
}
