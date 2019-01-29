import moment from 'moment'

export default {
    namespaced: true,
    state: {
        authenticated: false,
        loaded: false,
        user:false,
    },
    mutations: {

        // clear any user info and delete auth header
        logout(state) {
            localStorage.removeItem('user')
            delete axios.defaults.headers.post[ 'jwt' ]
            state.user = {}
            state.loaded = false
            state.authenticated = false
        },

        save(state, user) {
            state.user=user
            state.authenticated = true
            if (!state.state_loaded) state.state_loaded = true
        }

    },
    actions: {

        login({commit, dispatch}, user) {
            return new Promise((resolve) => {


                localStorage.setItem('jwt', user.jwt)
                axios.defaults.headers.post[ 'jwt' ] = user.jwt;

                commit('save', user)
                resolve()
            })
        },
        // log user out
        logout({commit}) {
            commit('logout')
            axios.post('/api/Account/Logout')
        },



    },
    getters: {}
}
