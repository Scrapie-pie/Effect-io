const getDefaultState = () => {
    return {
        profile: false,
        settings: false,
        branchListAll: [],
        siteCompanyList: []
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
        logout() {
            console.log('user logout')
            this._vm.$socket.disconnect()
            this._vm.$http.put('employee/online-update', {
                online: 0
            })
            //this._vm.$http.put('logout')
            localStorage.removeItem('jwt')

            delete this._vm.$http.defaults.headers.common['jwt']
            delete this._vm.$http.defaults.headers['content-type']
        },
        profileUpdate(
            state,
            {
                spelling,
                code,
                avatar,
                first_name,
                last_name,
                phones,
                mail,
                photo,
                active,
                online,
                branches_ids,
                is_common_chat,
                role_id,
                use_chat,
                use_calls
            }
        ) {
            let obj = {}

            if (spelling !== undefined) obj.spelling = spelling
            if (code !== undefined) obj.code = code
            if (avatar !== undefined) obj.avatar = avatar
            if (first_name !== undefined) obj.first_name = first_name
            if (last_name !== undefined) obj.last_name = last_name
            if (phones !== undefined) obj.phones = phones
            if (mail !== undefined) obj.mail = mail
            if (photo !== undefined) obj.photo = photo
            if (online !== undefined) obj.online = online
            if (active !== undefined) obj.active = active
            if (branches_ids !== undefined) obj.branches_ids = branches_ids
            if (is_common_chat !== undefined) obj.is_common_chat = is_common_chat
            if (role_id !== undefined) obj.role_id = role_id
            if (use_chat !== undefined) obj.use_chat = use_chat
            if (use_calls !== undefined) obj.use_calls = use_calls

            state.profile = Object.assign(state.profile, obj)
        },
        profile(state, val) {
            state.profile = val
        },
        unreadUpdate(state, val) {
            if (state.profile.unread !== undefined) {
                //иначе при logout была ошибка

                if (val[1] === 'clear') return (state.profile.unread[val[0]] = 0)
                if (state.profile.unread[val[0]] === 0 && val[1] === -1) return
                state.profile.unread[val[0]] += val[1]
            }
        },
        settings(state, val) {
            state.settings = val
        },
        settingsUpdateFields(state, obj) {
            state.settings.settings = Object.assign(state.settings.settings, obj)
        },
        settingsUpdate(state, val) {
            state.settings.settings = val
        },

        branchListAll(state, val) {
            state.branchListAll = val
        },
        siteCompanyList(state, val) {
            state.siteCompanyList = val
        }
    },
    actions: {
        getLogin({ commit, dispatch }, user) {
            if (!user.jwt) return
            localStorage.setItem('jwt', user.jwt)
            this._vm.$http.defaults.headers.common['jwt'] = user.jwt
            this._vm.$http.defaults.headers['content-type'] = 'application/json'

            this._vm.$socket.query = `uuid=${user.uuid}&user=employee`
            this._vm.$socket.io.opts.query = `uuid=${user.uuid}&user=employee`
            this._vm.$socket.open()

            commit('profile', user)
            dispatch('getSettings')
            dispatch('getBranchListAll')
            dispatch('getSiteCompanyList')
            dispatch('operators/getAll', null, { root: true })
            dispatch('phrases/getItemList', null, { root: true })
        },
        logout({ commit }) {
            commit('resetState')
            commit('resetState', null, { root: true })

            commit('roomActive/resetState', null, { root: true })
            commit('operators/resetState', null, { root: true })
            commit('visitors/resetState', null, { root: true })
            commit('phrases/resetState', null, { root: true })
            commit('tags/resetState', null, { root: true })
            commit('logout')
            console.log('logout resolve')
        },
        getSettings({ commit }) {
            this._vm.$http.get('company/get-settings').then(({ data }) => {
                commit('settings', data.data)
            })
        },
        getBranchListAll({ commit }) {
            this._vm.$http.get('branchs/list').then(({ data }) => {
                commit('branchListAll', data.data)
            })
        },
        getSiteCompanyList({ commit }) {

            this._vm.$http.get('site/company-list',{params:{'withIntegrations':1}}).then(({ data }) => {
                commit('siteCompanyList', data.data)
            })
        }
    },
    getters: {
        roles: state => {
            // в JavaScript, когда `false && myString` возвратит `false`, а `true && myString` возвратит `myString`.
            let { id, owner_id, role_id } = state.profile
            if (!id && !owner_id && !role_id) return []
            return [
                id === owner_id && 'owner',
                role_id === 13 && 'admin',
                role_id === 14 && 'operatorSenior'
            ]
        },
        isRole: (state, getters) => list => {
            // в JavaScript, когда `false && myString` возвратит `false`, а `true && myString` возвратит `myString`.
            return list.some(item => getters.roles.includes(item))
        },
        branchListAll: state => {
            return state.branchListAll
        },
        settings: state => {
            return state.settings
        },
        profile: state => {
            return state.profile
        },
        authenticated: state => {
            return !!state.profile.id
        }
    }
}
