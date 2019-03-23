import _ from 'underscore'

const getDefaultState = () => {
    return {
        profile:false,
        settings:false,
        branchListAll:[],


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
        logout(state) {
            console.log('user logout');
            this._vm.$http.put('operator-online-update',{
                online:0
            })
            //this._vm.$http.put('logout')
            localStorage.removeItem('jwt')
            delete this._vm.$http.defaults.headers.common[ 'jwt' ];
            delete this._vm.$http.defaults.headers['content-type'];
        },
        profileUpdate(state, val) {
            console.log('profileUpdate',val.online);
            console.log(_.extend(state.profile, val));
            state.profile=_.extend(state.profile,val);
        },
        profile(state, val) {
            state.profile=val;
        },
        unreadUpdate(state,val){
            console.log('unreadUpdate',val[0]);
            if(val[1]==='clear') return state.profile.unread[val[0]]=0;
            if(state.profile.unread[val[0]]===0 && val[1]===-1)return
            state.profile.unread[val[0]] += val[1]
        },
        settings(state, val) {
            state.settings=val;
        },
        settingsUpdate(state, val) {
            state.settings.settings=val;
        },

        branchListAll(state, val) {
            state.branchListAll=val;
        },


    },
    actions: {
        getLogin({commit, dispatch}, user) {
            if(!user.jwt) return
            localStorage.setItem('jwt', user.jwt);
            this._vm.$http.defaults.headers.common[ 'jwt' ] = user.jwt;
            this._vm.$http.defaults.headers['content-type']= 'application/json';

            commit('profile', user);
            dispatch('getSettings');
            dispatch('getBranchListAll');
            dispatch('operators/getAll',null,{root:true});
            dispatch('phrases/getItemList',null,{root:true});
        /*    dispatch('visitors/getAll',null,{root:true}); //Todo лишний или нет
            dispatch('visitors/getProcess',null,{root:true});*/
            /*dispatch('visitors/getSelf',null,{root:true}).then((data)=>{
                console.log('getSelf',data);
            });*/


        },
        logout({commit}) {

            commit('logout')
            commit('resetState')
            commit('resetState', null, { root: true })
            commit('operators/resetState', null, { root: true })
            commit('visitors/resetState', null, { root: true })



        },
        getSettings({commit}) {
            this._vm.$http.get('company-get-settings').then(({data})=>{
                commit('settings',data.data)
            })
        },
        getBranchListAll({commit}) {
            this._vm.$http.get('branches-list').then(({data})=>{
                commit('branchListAll',data.data)
            })
        },

    },
    getters: {
        roles:state=> {// в JavaScript, когда `false && myString` возвратит `false`, а `true && myString` возвратит `myString`.
            let {id,owner_id,role_id} = state.profile;
            if(!id && !owner_id && !role_id) return []
            return [
                id === owner_id && 'owner',
                role_id === 13 && 'admin',
                role_id === 14 && 'operatorSenior',
            ];
        },
        isRole:(state, getters)=> list =>{// в JavaScript, когда `false && myString` возвратит `false`, а `true && myString` возвратит `myString`.
            return list.some(item=>getters.roles.includes(item))
        },
        branchListAll: state => {
            return state.branchListAll
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
