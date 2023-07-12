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
       'x-authorization': 'eyJhbGciOiJIUzUxMiJ9.eyJyYW5kb21LZXkiOiJjNGUyYWZiOC0xOWI1LTRjY2QtOTdkMy04MDJjMTRkNDViODUiLCJzdWIiOiLnlKjmiLfotKblj7ciLCJhdXRob3JpdHlQb2xpY3kiOiJOb3JtYWxVc2VyIiwidXNlck5hbWUiOiLkvZXniLXkuLoiLCJleHAiOjE2OTIwMDc5ODIsInVzZXJJZCI6IkFDQTQ3RUYyLUNFNkEtMTFFRC1CQkRGLTAyNDJBQzEyMDAxMSIsImlhdCI6MTY4OTEyNzk4MiwidGVuYW50IjoiRE9OTElNIiwiYWNjb3VudCI6IjM4MTY2OSJ9.bm4RCjis9YTwMtWPbfONOKzBP0DMzwZHKFQwXc-w7TxL0f60cnrx53utV3_6FtxBShKui32b9EbaDR5TT6dC3g',
    },
  },
  '/api-gateway': {
    target: 'https://sei.donlim.com/api-gateway',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/api-gateway': '' },
  },
};
