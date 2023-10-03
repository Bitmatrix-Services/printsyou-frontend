import axios from 'axios';

export const http = axios.create({
  baseURL: 'http://54.145.115.150:8090/'
});
