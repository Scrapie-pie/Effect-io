import axios from 'axios'
//import config from "../config";

const config = {
  api_server:'http://rbcall-rbcall-3212.cloud4.newrobocall.ru/app/'
}

// Настройки http-запросов
axios.defaults.baseURL = config.api_server;
axios.defaults.headers.common['Content-Type'] = 'application/json'


axios.interceptors.response.use(null, function (error) {

    showError(error)
    if (error.response.status == 500) alert('Неизвестная ошибка')
    if (error.response.status == 400) alert('Bad request')
})

export default axios