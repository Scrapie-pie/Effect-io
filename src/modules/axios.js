import Vue from 'vue'
import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import globalConfig from '@/config/index'

const refreshAuthLogic = failedRequest => {

    console.log('refreshAuthLogic');
    //console.log(failedRequest);
    let jwt = localStorage.getItem('jwt')
        if(jwt) {
            failedRequest.response.config.headers['jwt'] = jwt

            console.log('debug request',failedRequest.config.url,jwt);

         /*   let jwtHystory = window.jwtHystoryfailedRequest
            if(!jwtHystory) {
                jwtHystory = []
            }

            jwtHystory.push({jwt,urlRequest:failedRequest.config.url})
            window.jwtHystoryfailedRequest = jwtHystory*/

        }




    return Promise.resolve();
};


createAuthRefreshInterceptor(axios, refreshAuthLogic,{});

// Настройки http-запросов
axios.defaults.baseURL = globalConfig.api_server
axios.defaults.headers.common['Content-Type'] = 'application/json'





axios.interceptors.request.use(
    function(config) {
        //console.log('axios.interceptors.request.use',config);
        const oldUrls = []

        if (oldUrls.indexOf(config.url) != -1) {
            config.baseURL = globalConfig.api_server_old
            config.url = 'app.php?' + config.url
        }

        if(localStorage.getItem('jwt')) {
            config.headers['jwt'] = localStorage.getItem('jwt')

        }

        // if(config.url == 'login' ) {
        //     config.baseURL = globalConfig.api_server_old
        //     config.url='app.php?'+config.url
        // }

        // else if (config.url!=='screen.html') {
        //     //config.url='app.php?'+config.url
        // }

        return config
    },
    function(error) {
        // Do something with request error
        return Promise.reject(error)
    }
)

axios.interceptors.response.use(
    function(resp) {
        //console.log(resp,'axios.interceptors.response.use');
        const jwt = resp.headers.jwt
        //console.log(jwt);
        if(jwt) {
            console.log();
            console.log('debug response',resp.config.url,jwt);
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
   /* function(err) {
        if(err?.response?.status === 401) {
            if(localStorage.getItem('jwt') && err.config.headers.jwt !== localStorage.getItem('jwt')) {
                console.log(err)
                console.table(err)

                err.config.headers.jwt = localStorage.getItem('jwt')
                axios.request(err.config)
            }

          /!*  return refreshToken(store).then(_ => {
                error.config.headers['Authorization'] = 'Bearer ' + store.state.auth.token;
                error.config.baseURL = undefined;
                return Axios.request(error.config);
            });*!/
        } else return Promise.reject(err)
    }*/
)

export default axios
