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
      'x-authorization': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImxvZ2luQWNjb3VudCI6ImFkbWluIiwiaXAiOiJVbmtub3duIiwidXNlck5hbWUiOiLnp5_miLfnrqHnkIblkZgiLCJsb2NhbGUiOiJ6aF9DTiIsInVzZXJJZCI6IjIxQjJGNjE2LUJBMjctMTFFQy05NzU1LTAyNDJBQzE0MDAxQSIsInJhbmRvbUtleSI6IjI1MTQ0N0VBLTA0NDMtMTFFRS1BRjIwLUVFQjgwQzgyQzUwQyIsImF1dGhvcml0eVBvbGljeSI6IlRlbmFudEFkbWluIiwidXNlclR5cGUiOiJFbXBsb3llZSIsImV4cCI6MTY4NjEyNjA5MywiaWF0IjoxNjg2MDM5NjkzLCJ0ZW5hbnQiOiJET05MSU0iLCJhY2NvdW50IjoiYWRtaW4ifQ.VICsPazn4s33MyLeB3gMeom9Sl-oxIxl17r7DUtwCYK6tiN3rA2_SI86s6O84sE1oHiZjTPftuOwOtRtx7UYHQ',
      // 'x-authorization': 'eyJhbGciOiJIUzUxMiJ9.eyJyYW5kb21LZXkiOiJmYjk2ZDRmNy0zZmNiLTRhNGEtYWU4MS05YWQ2NDdjZDU1MmUiLCJzdWIiOiLnlKjmiLfotKblj7ciLCJhdXRob3JpdHlQb2xpY3kiOiJOb3JtYWxVc2VyIiwidXNlck5hbWUiOiLnp5_miLfnrqHnkIblkZgiLCJleHAiOjE2ODg5MTg5MjEsInVzZXJJZCI6IjIxQjJGNjE2LUJBMjctMTFFQy05NzU1LTAyNDJBQzE0MDAxQSIsImlhdCI6MTY4NjAzODkyMSwidGVuYW50IjoidGVzdCIsImFjY291bnQiOiJhZG1pbiJ9.i6PNdOH9Vkc4wGACjpUp4yA5g535ybjw-Y2FhcQxgfWYfDx6nRAkIKuowZnydeuTjHeJ3fDTAay4ZEDyQS9d-A',
    },
  },
  '/api-gateway': {
    target: 'https://sei.donlim.com/api-gateway',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/api-gateway': '' },
  },
};
