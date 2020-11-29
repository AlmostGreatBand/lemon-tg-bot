'use strict';

const Telegraf = require('telegraf');
const token = process.env.LEMON_TELEGRAM_TOKEN

const bot = new Telegraf(token);


bot.start((ctx) => ctx.reply('Welcome to Lemon telegram bot'))

bot.help((ctx) => ctx.reply('This bot is in development right now'))

bot.on('sticker', (ctx) => ctx.reply('Nice sticer'))

bot.hears('Marcus Aurelius', (ctx) => ctx.reply('You have power over your mind - not outside events. Realize this, and you will find strength.'))

bot.launch()
