export default {
  '/mocker.api': {
    target: 'http://rddgit.changhong.com:7300/mock/5dd5efbdc239b926aeb04627/seid.api',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/mocker.api': '' },
  },
  '/api-gateway/startegy-api': {
    target: 'http://127.0.0.1:8080',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/api-gateway/startegy-api': '' },
  },
  '/api-gateway': {
    target: 'https://sei.donlim.com/api-gateway',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/api-gateway': '' },
  },
};
