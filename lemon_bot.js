'use strict';

const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const request = require('./request.js');
const fs = require('fs');
const token = process.env.LEMON_TELEGRAM_TOKEN;
const url = process.env.URL;
const port = process.env.PORT;

const messages = JSON.parse(fs.readFileSync('./messages.json', 'utf-8'));

const bot = new Telegraf(token);

bot.telegram.setWebhook(`${url}bot${token}`);
bot.startWebhook(`/bot${token}`, null, port);

const credentials = new Map();

const showCardInfo = card => `Balance: ${card.balance}${card.currency}\nType: ${card.type}`;

const cardHandlerCreator = (cardData, card) => {
  bot.action(cardData, ctx => {
    ctx.editMessageText(showCardInfo(card),
      Extra.HTML()
        .markup(Markup.inlineKeyboard([
          Markup.callbackButton('Back to cards', 'cards'),
          Markup.callbackButton('Show transactions', 'transactions')
        ])));
  });
};

const cardButtonsGenerator = cardsArr => {
  const result = [];

  cardsArr.forEach((card, index) => {
    const cardData = `card${index}`;
    const cardButtonText = `***${card.num}`;
    const cardButton = Markup.callbackButton(cardButtonText, cardData);
    result.push(cardButton);

    cardHandlerCreator(cardData, card);
  });
  return result;
};

const credentialsParser = text => {
  // /login username password some extra text
  const arr = text.split(' ').splice(1, 2);
  return arr;
};

//Start bot
bot.start(ctx => {
  ctx.reply(messages.start);
});

const regex = new RegExp(/^\/login (.+)/);
bot.hears(regex, ctx => {
  const userId = ctx.message.from.id;
  const creds = credentialsParser(ctx.message.text);
  credentials.set(userId, creds);
  request('/cards', creds);
  ctx.reply(`Hello, ${creds[0]}`,
    Extra.HTML()
      .markup(Markup.inlineKeyboard([
        Markup.callbackButton('Show cards', 'cards'),
      ]))
  );
});

bot.action('cards', ctx => {
  const cards = [];
  const creds = credentials.get(ctx.from.id);
  request('/cards', creds)
    .then(data => {
      console.log(data);
      data.forEach(obj => {
        cards.push(obj);
      });
      ctx.editMessageText(`Hi <b>${creds[0]}</b>. <i>Please, choose a card</i>`,
        Extra.HTML()
          .markup(Markup.inlineKeyboard(cardButtonsGenerator(cards))));
    });
});

bot.action('transactions', ctx => {
  const creds = credentials.get(ctx.from.id);
  request('/transactions', creds)
    .then(data => {
      ctx.editMessageText(data); // raw alpha
    });
});

//Reaction on command /help
bot.help(ctx => ctx.reply('This bot is in development right now'));

//Reaction on sending sticker
bot.on('sticker', ctx => ctx.reply(messages.sticker));

//Reply on message Marcus Aurelius
bot.hears('Marcus Aurelius', ctx =>
  ctx.reply(messages.marcus));

//bot.launch();
