export default {
  '/mocker.api': {
    target: 'http://rddgit.changhong.com:7300/mock/5dd5efbdc239b926aeb04627/seid.api',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/mocker.api': '' },
  },
  '/api-gateway/sei-strategy-api': {
    target: 'http://127.0.0.1:8080',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/api-gateway/sei-strategy-api': '' },
    headers: {
       'x-authorization': 'eyJhbGciOiJIUzUxMiJ9.eyJyYW5kb21LZXkiOiI5ZGFkMjNhZS1hZjU4LTQwYWUtOTAxNC0zNDNiNjEyNTY4ZjYiLCJzdWIiOiLnlKjmiLfotKblj7ciLCJhdXRob3JpdHlQb2xpY3kiOiJOb3JtYWxVc2VyIiwidXNlck5hbWUiOiLkvZXniLXkuLoiLCJleHAiOjE2ODkwODUxNDEsInVzZXJJZCI6IkFDQTQ3RUYyLUNFNkEtMTFFRC1CQkRGLTAyNDJBQzEyMDAxMSIsImlhdCI6MTY4NjIwNTE0MSwidGVuYW50IjoiRE9OTElNIiwiYWNjb3VudCI6IjM4MTY2OSJ9.vCQPI3QzBjCHH_gXYM0ATEuTPTg14BdbGwBDN7PG4L97JIbhI_A4D1zAyWHc0T-K18wyb7-6EfRndTVvO3GbGw',
    },
  },
  '/api-gateway': {
    target: 'https://sei.donlim.com/api-gateway',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/api-gateway': '' },
  },
};
