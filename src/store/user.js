export default {
    namespaced: true,
    state: {
        profile:false,
        settings:false,
        branchListAll:[]
    },
    mutations: {
        logout(state) {
            localStorage.removeItem('jwt')
            delete this._vm.$http.defaults.headers.common[ 'jwt' ];
            delete this._vm.$http.defaults.headers['content-type'];
            for (let prop in state) {
                state[prop] = false;
            }

        },

        profile(state, val) {
            state.profile=val;


        },
        settings(state, val) {
            state.settings=val;
        },
        branchListAll(state, val) {
            state.branchListAll=val;
        }

    },
    actions: {
        getLogin({commit, dispatch}, user) {
            localStorage.setItem('jwt', user.jwt);
            this._vm.$http.defaults.headers.common[ 'jwt' ] = user.jwt;
            this._vm.$http.defaults.headers['content-type']= 'application/json';

            commit('profile', user)
            dispatch('getSettings')
            dispatch('getBranchListAll');
            dispatch('operators/getAll',null,{root:true});
            dispatch('visitors/getAll',null,{root:true});


        },
        logout({commit}) {
            commit('logout')
        },
        getSettings({ commit, dispatch }) {
            this._vm.$http.get('company-get-settings').then(({data})=>{
                commit('settings',data.data)
            })
        },
        getBranchListAll({ commit, dispatch }) {
            this._vm.$http.get('branches-list').then(({data})=>{
                commit('branchListAll',data.data)
            })
        },
    },
    getters: {
        isRole:state=> {// в JavaScript, когда `false && myString` возвратит `false`, а `true && myString` возвратит `myString`.

          return state.profile.id === state.profile.owner_id && 'owner';
        },
        settings: state => {
            return state.settings;
        },
        profile: state => {
            return state.profile;
        },
        authenticated: state => {
            return !!state.profile
        }
    }
}
