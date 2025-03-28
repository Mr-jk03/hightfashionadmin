import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3005/api',
    //baseURL: 'https://server-a85p.onrender.com',
    headers:{
        'Content-Type':'application/json'
    }
})
export default apiClient