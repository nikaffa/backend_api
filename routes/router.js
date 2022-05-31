const appRouter = (app) => {

  app.get('/', (req, res) => {
    res.send('Welcome to my blogpost app!');
  });
  
};

module.exports = appRouter;