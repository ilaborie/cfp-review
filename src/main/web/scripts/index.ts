import app from './app/app';

const host = document.querySelector('main');
host && app(host) || console.error('no <main> found');