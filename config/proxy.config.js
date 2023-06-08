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
      // 'x-authorization': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImxvZ2luQWNjb3VudCI6ImFkbWluIiwiaXAiOiJVbmtub3duIiwidXNlck5hbWUiOiLnp5_miLfnrqHnkIblkZgiLCJsb2NhbGUiOiJ6aF9DTiIsInVzZXJJZCI6IjIxQjJGNjE2LUJBMjctMTFFQy05NzU1LTAyNDJBQzE0MDAxQSIsInJhbmRvbUtleSI6IkY0MkU1MjQzLTA1OUItMTFFRS1BRTI1LUQyMDI4MjA2MTRCNiIsImF1dGhvcml0eVBvbGljeSI6IlRlbmFudEFkbWluIiwidXNlclR5cGUiOiJFbXBsb3llZSIsImV4cCI6MTY4NjI3NDE4OCwiaWF0IjoxNjg2MTg3Nzg4LCJ0ZW5hbnQiOiJET05MSU0iLCJhY2NvdW50IjoiYWRtaW4ifQ.1dSFqpf65GiQXk7riJ0iuEPfWAwOIzLnXj05KHqtJTHXVky2cJMh0NMGkfmcZHc8P2Wtozit3fjX8GDbLKZeoA',
      // 'x-authorization': 'eyJhbGciOiJIUzUxMiJ9.eyJyYW5kb21LZXkiOiJmYjk2ZDRmNy0zZmNiLTRhNGEtYWU4MS05YWQ2NDdjZDU1MmUiLCJzdWIiOiLnlKjmiLfotKblj7ciLCJhdXRob3JpdHlQb2xpY3kiOiJOb3JtYWxVc2VyIiwidXNlck5hbWUiOiLnp5_miLfnrqHnkIblkZgiLCJleHAiOjE2ODg5MTg5MjEsInVzZXJJZCI6IjIxQjJGNjE2LUJBMjctMTFFQy05NzU1LTAyNDJBQzE0MDAxQSIsImlhdCI6MTY4NjAzODkyMSwidGVuYW50IjoidGVzdCIsImFjY291bnQiOiJhZG1pbiJ9.i6PNdOH9Vkc4wGACjpUp4yA5g535ybjw-Y2FhcQxgfWYfDx6nRAkIKuowZnydeuTjHeJ3fDTAay4ZEDyQS9d-A',
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
