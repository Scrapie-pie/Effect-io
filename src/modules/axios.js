import axios from 'axios'
//import config from "../config";

const config = {
  api_server:'http://rbcall-rbcall-3212.cloud4.newrobocall.ru/app/'
}

// Настройки http-запросов
axios.defaults.baseURL = config.api_server;
axios.defaults.headers.common['Content-Type'] = 'application/json'
/*axios.interceptors.response.use((resp) => {
  if(resp.data && resp.data.data && resp.data.data.jwt){
    localStorage.setItem('jwt', resp.data.data.jwt)
    axios.defaults.headers.post[ 'jwt' ] = resp.data.data.jwt
  }
  return resp
})
const jwt = localStorage.getItem('jwt')
if (jwt) {
  axios.defaults.data = {};
  axios.defaults.headers.post[ 'jwt' ] = jwt
  axios.defaults.headers.get[ 'jwt' ] = jwt
}*/

/*axios.interceptors.response.use(null, function (error) {
    console.log(error.response);
    if (error.response.status == 500) alert('Неизвестная ошибка')
    if (error.response.status == 400) alert('Bad request')
})*/

export default axios