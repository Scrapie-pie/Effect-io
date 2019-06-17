import Vue from 'vue'
import axios from 'axios'
import globalConfig from "@/config/index";

// Настройки http-запросов
axios.defaults.baseURL = globalConfig.api_server;
axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.request.use(function (config) {

    const oldUrls = [
        'login',
        'upload-avatar',
        'upload-message-file',
        'statistic/get-by-params'
    ];

    if(oldUrls.indexOf(config.url) != -1) {
        config.baseURL = globalConfig.api_server_old
        config.url='app.php?'+config.url
    }

    // if(config.url == 'login' ) {
    //     config.baseURL = globalConfig.api_server_old
    //     config.url='app.php?'+config.url
    // }

    // else if (config.url!=='screen.html') {
    //     //config.url='app.php?'+config.url
    // }


    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});



export default axios