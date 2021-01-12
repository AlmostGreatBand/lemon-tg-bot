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

const showCardInfo = card =>
  `Balance: ${card.balance}${card.currency}\nType: ${card.type}`;

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

const throwToMainMenu = ctx => {
  ctx.editMessageText(messages.error,
    Extra.HTML()
      .markup(Markup.inlineKeyboard([
        Markup.callbackButton('Show cards', 'cards'),
      ]))
  );
};

const regex = new RegExp(/^\/login (.+)/);
bot.hears(regex, async ctx => {
  const userId = ctx.from.id;
  const creds = credentialsParser(ctx.message.text);
  credentials.set(userId, creds);
  try {
    await request('/cards', creds);
    await ctx.reply(`Hello, ${creds[0]}`,
      Extra.HTML()
        .markup(Markup.inlineKeyboard([
          Markup.callbackButton('Show cards', 'cards'),
        ]))
    );
  } catch (err) {
    console.log(err);
    await ctx.reply(err);
  }
});

bot.action('cards', async ctx => {
  const cards = [];
  const creds = credentials.get(ctx.from.id);
  let data;
  try {
    data = await request('/cards', creds);
    data.forEach(obj => {
      cards.push(obj);
    });
    const reply = `Hi <b>${creds[0]}</b>. <i>Please, choose a card</i>`;
    await ctx.editMessageText(reply,
      Extra.HTML()
        .markup(Markup.inlineKeyboard(cardButtonsGenerator(cards))));
  } catch (err) {
    console.log(err);
    throwToMainMenu(ctx);
  }
});

bot.action('transactions', async ctx => {
  const creds = credentials.get(ctx.from.id);
  let data;
  try {
    data = await request('/transactions', creds);
    await ctx.editMessageText(data); // raw alpha
  } catch (err) {
    console.log(err);
    throwToMainMenu(ctx);
  }
});

//Reaction on command /help
bot.help(ctx => ctx.reply('This bot is in development right now'));

//Reaction on sending sticker
bot.on('sticker', ctx => ctx.reply(messages.sticker));

//Reply on message Marcus Aurelius
bot.hears('Marcus Aurelius', ctx =>
  ctx.reply(messages.marcus));

// bot.launch();
