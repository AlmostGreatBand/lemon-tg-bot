'use strict';

const plotly = require('plotly')('DjBee', 'ApPjQFhC3pUbR2XvbC6p');

const transParser = trans => {
  const x = [];
  const y = [];
  trans.sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  ).reverse();
  const lastMonth = new Date(trans[trans.length - 1].date).getMonth();
  trans = trans.filter(transaction => (
    new Date(transaction.date).getMonth() === lastMonth
  ));
  console.log(trans);
  trans.forEach(it => {
    x.push(new Date(it.date).getDate());
    y.push(it.amount);
  });
  return [{ x, y, type: 'line' }];
};

const createPlot = trans => {
  const data = transParser(trans);
  const layout = { fileopt: 'overwrite', filename: 'last-month-transactions' };
  plotly.plot(data, layout, (err, msg) => {
    try {
      console.log(msg.url);
      return msg.url;
    } catch (err) {
      console.log(err);
      return 'Error while creating plot';
    }
  });
};

module.exports = createPlot;
