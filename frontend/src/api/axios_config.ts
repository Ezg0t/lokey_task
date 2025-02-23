import axios from 'axios';
import { useUserStore } from '../stores/userStore';
import axiosMockAdapter from 'axios-mock-adapter';

export const BASE_URL = '/api/'
// export const BASE_URL = String(process.env.API_URL);  // works only when app served by backend server, for local set to full url
const useMock = true;
const mock = new axiosMockAdapter(axios, { delayResponse: 1000 });
if (useMock) {
mock.onPost('/api/login').reply((config) => {
  const { username, password } = JSON.parse(config.data);
 
  if (username === 'user' && password === 'password') {
    return [200, { authorization: 'mocked-jwt-token' }];
  } else {
    return [401, { message: 'Invalid credentials' }];
  }
});
}

export default function getCrudifulAxios () {
  const headers: Record<string, string> = {}
  const store = useUserStore();
  const token = store.authorization;
  headers['Content-Type'] = 'application/json';
  headers['Access-Control-Allow-Origin'] = '*';
  if (!!token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return axios.create({
    baseURL: BASE_URL,
    timeout: 60 * 1000,  // 60 seconds
    headers: headers
  })
}
