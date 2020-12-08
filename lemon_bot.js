'use strict';

const Telegraf = require('telegraf');
const Markup = require('telegraf/markup')
const Extra = require('telegraf/extra')

const token = process.env.LEMON_TELEGRAM_TOKEN;

const bot = new Telegraf(token);

//Start bot
bot.start((ctx) => ctx.reply('Welcome to Lemon telegram bot'))

//Reaction on command /help
bot.help((ctx) => ctx.reply('This bot is in development right now'))

//Reaction on sending sticker
bot.on('sticker', (ctx) => ctx.reply('Nice sticer'))

//Reply on message Marcus Aurelius
bot.hears('Marcus Aurelius', (ctx) =>
    ctx.reply('You have power over your mind - not outside events. Realize this, and you will find strength.'))

//Reply on message testing
bot.hears('testing', (ctx) => {
    ctx.reply('<b>Hi</b>. <i>Choose one option</i>',
        //Using HTML markup to implement inline buttons
        Extra.HTML()
            .markup(Markup.inlineKeyboard([
                Markup.callbackButton('Rewrite', 'first option'),
                Markup.callbackButton('Clear', 'second option')
            ])))
})

//Activating after pressing the button with data first option
bot.action('first option', (ctx) => {
    //Using this method for editing message and not resending it again
    ctx.editMessageText('<i>Wow, some new text here 😊</i> ' + Math.random(),
        Extra.HTML()
            .markup(Markup.inlineKeyboard([
                Markup.callbackButton('Rewrite', 'first option'),
                Markup.callbackButton('Clear', 'second option')
            ]))
    )
})

bot.action('second option', (ctx) => {
    //Using this method to delete current message
    ctx.deleteMessage();
})

bot.launch();
