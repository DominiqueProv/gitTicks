//fix the next problem to sometime reflect the modifications made in the browser

module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
