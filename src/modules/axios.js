import Vue from 'vue'
import axios from 'axios'
import config from "@/config/index";

// Настройки http-запросов
axios.defaults.baseURL = config.api_server;
axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.request.use(function (config) {

        if(config.url!=='screen.html') config.url='app.php?'+config.url

    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});



export default axios