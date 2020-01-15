const request = require("request");

const getPage = url =>
  new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if (err) reject(err);
      resolve(body);
    });
  });

const sleep = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

module.exports = { getPage, sleep };
