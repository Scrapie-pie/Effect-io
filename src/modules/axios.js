import Vue from 'vue'
import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'

const refreshAuthLogic = failedRequest => {
    console.log('refreshAuthLogic')
    //console.log(failedRequest);
    let jwt = localStorage.getItem('jwt')
    if (jwt) {
        failedRequest.response.config.headers['jwt'] = jwt

        /*   let jwtHystory = window.jwtHystoryfailedRequest
            if(!jwtHystory) {
                jwtHystory = []
            }

            jwtHystory.push({jwt,urlRequest:failedRequest.config.url})
            window.jwtHystoryfailedRequest = jwtHystory*/
    }

    return Promise.resolve()
}

createAuthRefreshInterceptor(axios, refreshAuthLogic, {})

// Настройки http-запросов
console.log(process.env.VUE_APP_API_SERVER)
axios.defaults.baseURL = process.env.VUE_APP_API_SERVER
axios.defaults.headers.common['Content-Type'] = 'application/json'

axios.interceptors.request.use(
    function(config) {
        //console.log('axios.interceptors.request.use',config);
        const oldUrls = []

        if (localStorage.getItem('jwt')) {
            config.headers['jwt'] = localStorage.getItem('jwt')
        }

        return config
    },
    function(error) {
        // Do something with request error
        return Promise.reject(error)
    }
)

axios.interceptors.response.use(
    resp => {
        const jwt = resp.headers.jwt
        //console.log(jwt);
        if (jwt) {
            localStorage.setItem('jwt', jwt)
            /*   let jwtHystory = window.jwtHystory
           if(!jwtHystory) {
               jwtHystory = []
           }

           jwtHystory.push({jwt,urlResponse:resp.config.url})
           window.jwtHystory = jwtHystory*/
        }
        return resp
    },
    error => {
        /*  if (error.config && error.response && error.response.status === 401) {
            let jwt = localStorage.getItem('jwt')
            if (jwt !==error.config.headers['jwt']) {
                window.axiosErr= error
                error.config.headers['jwt'] = jwt
                    return axios.request(error.config)
            }

        }*/

        return Promise.reject(error)
    }
)

export default axios
