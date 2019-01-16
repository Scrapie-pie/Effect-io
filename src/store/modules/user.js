import moment from 'moment'

export default {
    namespaced: true,
    state: {
        authenticated: false,
        state_loaded: false,
        info: {},
        profile: {},
        authToken: '',
        baseURL: ''
    },
    mutations: {

        // clear any user info and delete auth header
        logout(state) {
            localStorage.removeItem('user')
            delete axios.defaults.headers.common['Authorization']
            state.info = {}
            state.state_loaded = false
            state.authenticated = false
        },
        api(state, obj) {
            state.authToken = obj.authToken
            state.baseURL = obj.baseURL
        },
        save(state, {info}) {
            state.info = info
            state.profile = {
                shortName: 'Капустников Р.Г'
            }
            state.authenticated = true
            if (!state.state_loaded) state.state_loaded = true
        }

    },
    actions: {
        // Log user in
        login({commit, dispatch}, user) {
            return new Promise((resolve) => {
                // calculate when token expires

                user.expires = moment.utc().add(user.expires_in, 'seconds')

                // save toke to local storage
                localStorage.setItem('user', JSON.stringify(user))

                // remove items from localstorage related to register

                if (user.token) user.access_token = user.token

                // set default auth header, needed for API authorization
                axios.defaults.headers.common['Authorization'] = `Bearer ${user.access_token}`

                let tokenUser = {
                    auth: axios.defaults.headers.common['Authorization'],
                    baseURL: 'http://lka.test-it-studio.ru'
                }
                localStorage.setItem('tokenUser', JSON.stringify(tokenUser))

                dispatch('getProfile')
                commit('api', {
                    authToken: `Bearer ${user.access_token}`,
                    baseURL: 'http://lka.test-it-studio.ru'
                })
                resolve()
            })
        },
        // log user out
        logout({commit}) {
            commit('logout')
            axios.post('/api/Account/Logout')
        },

        getProfile({commit, dispatch}) {
            axios.all([
                axios.get('/userInfo')
            ]).then(
                axios.spread((info) => {
                    commit('save', {
                        info: info
                    })
                })
            )
        }

    },
    getters: {}
}
