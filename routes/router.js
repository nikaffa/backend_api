const appRouter = (app) => {
  //Step1 route
  app.get('/api/ping', (req, res) => {
    res.status(200).send({ "success":true });
  });
  
};

module.exports = appRouter;