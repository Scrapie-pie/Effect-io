export default {
    namespaced: true,
    state: {
        user:false,
    },
    mutations: {
        logout(state) {
            localStorage.removeItem('jwt')
            delete axios.defaults.headers.post[ 'jwt' ];
            state.user = false
            state.authenticated = false
            console.log(state);
        },

        save(state, user) {
            state.user=user;
        }

    },
    actions: {
        login({commit, dispatch}, user) {
            localStorage.setItem('jwt', user.jwt);
            axios.defaults.headers.post[ 'jwt' ] = user.jwt;
            commit('save', user)
        },

        logout({commit}) {
            commit('logout')
        },
    },
    getters: {
        authenticated: state => {
            return !!state.user
        }
    }
}
