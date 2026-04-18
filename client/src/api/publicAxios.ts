import axios from 'axios';

const getBackendUrl=()=>{if(import.meta.env.VITE_BACKEND_URL&&!import.meta.env.VITE_BACKEND_URL.includes('localhost'))return import.meta.env.VITE_BACKEND_URL;const protocol=window.location.protocol;const hostname=window.location.hostname;let backendPort='5000';if(import.meta.env.VITE_BACKEND_URL){const m=import.meta.env.VITE_BACKEND_URL.match(/:(\\d+)/);if(m)backendPort=m[1];}return protocol+'//'+hostname+':'+backendPort+'/api';};
console.log('Public Axios URL:',getBackendUrl());

const publicAxios=axios.create({baseURL:getBackendUrl()});

export default publicAxios;