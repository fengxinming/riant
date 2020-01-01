const { join } = require('path');
const { readFileSync } = require('fs');
const { Router } = require('express');
const sleep = require('celia/sleep');

const router = Router();

module.exports = app => {
  app.use('/mock', router);
};

router.all('*', async (req, res) => {
  try {
    const mockConfig = JSON.parse(
      readFileSync(join(__dirname, 'mock', req.url + '.json'), 'utf8')
    );
    if (mockConfig.defer) {
      await sleep(mockConfig.defer);
    }
    if (mockConfig.method && mockConfig.method !== req.method) {
      res.status(404).end();
      return;
    }
    res.status(200).json(mockConfig.res);
  } catch (e) {
    res.status(404).end();
  }
});
