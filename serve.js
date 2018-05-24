const proxy = require('http-proxy-middleware');
const Bundler = require('parcel-bundler');
const express = require('express');

const target = 'http://localhost:8123';

const bundler = new Bundler('src/main/web/index.html');
const app = express();


app.use(
    '/api',
    proxy({target})
);

app.use(bundler.middleware());
app.listen(Number(process.env.PORT || 1234));