export default {
    namespaced: true,
    state: {
        profile:false,
    },
    mutations: {
        logout(state) {
            localStorage.removeItem('jwt')
            delete this._vm.$http.defaults.headers.post[ 'jwt' ];
            state.user = false

        },

        save(state, user) {
            state.profile=user;

        }

    },
    actions: {
        login({commit, dispatch}, user) {
            localStorage.setItem('jwt', user.jwt);
            this._vm.$http.defaults.headers.post[ 'jwt' ] = user.jwt;
            commit('save', user)
        },
        logout({commit}) {
            commit('logout')
        },
    },
    getters: {
        authenticated: state => {
            return !!state.profile
        }
    }
}
