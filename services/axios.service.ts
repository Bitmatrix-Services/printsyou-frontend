import axios from 'axios';
import getConfig from 'next/config';

const config = getConfig();

const DOMAIN_BASE_URL =
  config.publicRuntimeConfig.DOMAIN_BASE_URL || 'https://identity.the-mgi.com';



export const http = axios.create({
  baseURL: DOMAIN_BASE_URL
});
