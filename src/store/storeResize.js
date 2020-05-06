const getDefaultState = () => {
    return {
        window: {
            width: window.innerWidth,
            height: window.innerHeight
        }
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
        setWindowSize(state, { width, height }) {
            state.window.width = width
            state.window.height = height
        }
    },

    getters: {
        xs: (state, getters, rootState, rootGetters) => {
            return state.window.width <= 767
        }
    }
}
