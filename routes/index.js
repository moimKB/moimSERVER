const express = require('express');
const router = express.Router();
const apiRouter = require('./api/index');

router.use('/api',apiRouter);

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

module.exports = router;
