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

const createPlot = async trans => {
  const data = transParser(trans);
  const layout = { fileopt: 'overwrite', filename: 'last-month-transactions' };
  await plotly.plot(data, layout, async (err, msg) => {
    try {
      console.log(msg.url);
      await msg.url;
    } catch (err) {
      console.log(err);
      return 'Error while creating plot';
    }
  });
};

module.exports = createPlot;

let transa = [{"transaction_id":2,"card_id":504,"amount":69000,"type":"Salary","date":"2020-10-13T15:37:01.325Z"},{"transaction_id":3,"card_id":657,"amount":-1236,"type":"Rent","date":"2020-10-18T14:10:23.753Z"}];
console.log(createPlot(transa));
