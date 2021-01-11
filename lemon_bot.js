'use strict';

const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const request = require('./request.js');
const token = process.env.LEMON_TELEGRAM_TOKEN;

const bot = new Telegraf(token);

const cardHandlerCreator = (cardData, card) => {
  bot.action(cardData, ctx => {
    ctx.editMessageText(card);
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
  const arr = text.split(' ');
  return arr[1] + ':' + arr[2];
};

//Start bot
bot.start(ctx => {
  ctx.reply('Welcome to Lemon telegram bot! \nSend me your data in \'/login username password\' format');
});

const regex = new RegExp(/^\/login (.+)/);

bot.hears(regex, ctx => {
  const cards = [];
  request('cards', credentialsParser(ctx.message.text))
    .then(data => {
      data.forEach(obj => {
        cards.push(obj);
      });
      ctx.reply('Hello <b> BLA </b>. <i>Please, choose a card</i>',
        Extra.HTML()
          .markup(Markup.inlineKeyboard(cardButtonsGenerator(cards))));
    });
});

//Reaction on command /help
bot.help(ctx => ctx.reply('This bot is in development right now'));

//Reaction on sending sticker
bot.on('sticker', ctx => ctx.reply('Nice sticker'));

//Reply on message Marcus Aurelius
bot.hears('Marcus Aurelius', ctx =>
  ctx.reply('You have power over your mind - not outside events. Realize this, and you will find strength.'));

bot.launch();
