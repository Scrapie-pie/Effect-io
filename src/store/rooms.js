const getDefaultState = () => {
    return {
        visitors: []
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

        visitors(state, val) {
            state.visitors = val

        },


    },
    actions: {
    /*    getAll({ commit, dispatch }) {
            this._vm.$http
                .get('employee/company-list', {
                    params: {
                        with_branches_ids: 1,
                        with_unread: 1,
                        with_last_messages: 1
                    }
                })
                .then(({ data }) => {
                    commit('all', data.data)
                })
        }*/
    },
    getters: {
        all: (state, getters, rootState) => {
            state.all.map(room => {
                return room
            })
            return state.all
        }
    }
}
