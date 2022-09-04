import axios from 'axios';

const baseAxios = axios.create({
    baseURL: '/'
})


export default baseAxios;