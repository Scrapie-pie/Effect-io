export default {
    namespaced: true,
    state: {
        profile:false,
    },
    mutations: {
        logout(state) {
            localStorage.removeItem('jwt')
            delete this._vm.$http.defaults.headers.common[ 'jwt' ];
            delete this._vm.$http.defaults.headers['content-type'];
            state.profile = false

        },

        save(state, user) {
            state.profile=user;


        }

    },
    actions: {
        login({commit, dispatch}, user) {
            localStorage.setItem('jwt', user.jwt);
            this._vm.$http.defaults.headers.common[ 'jwt' ] = user.jwt;
            this._vm.$http.defaults.headers['content-type']= 'application/json';

            commit('save', user)
        },
        logout({commit}) {
            commit('logout')
        },
    },
    getters: {
        isRole:state=> {// в JavaScript, когда `false && myString` возвратит `false`, а `true && myString` возвратит `myString`.

          return state.profile.id === state.profile.owner_id && 'owner';
        },
        profile: state => {
            return state.profile;
        },
        authenticated: state => {
            return !!state.profile
        }
    }
}
