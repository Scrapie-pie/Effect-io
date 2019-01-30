import moment from 'moment'

export default {
    namespaced: true,
    state: {
        authenticated: false,
        user:false,

    },
    mutations: {

        // clear any user info and delete auth header
        logout(state) {
            localStorage.removeItem('jwt')
            delete axios.defaults.headers.post[ 'jwt' ]
            state.user = false
            state.authenticated = false
            console.log(state);
        },

        save(state, user) {
            state.user=user;
            state.authenticated = true
        }

    },
    actions: {

        login({commit, dispatch}, user) {
            localStorage.setItem('jwt', user.jwt)
            axios.defaults.headers.post[ 'jwt' ] = user.jwt;

            commit('save', user)
        },
        // log user out
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
