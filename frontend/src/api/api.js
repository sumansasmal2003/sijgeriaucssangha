import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sijgeriaucssangha.vercel.app/api/v1',
  // baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true, // This is the crucial line that tells axios to send cookies with its requests.
});

export default api;
