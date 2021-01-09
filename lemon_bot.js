'use strict';
const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');

const token = process.env.LEMON_TELEGRAM_TOKEN;

const bot = new Telegraf(token);

const cards = [4242424242424242,4003830171874018,2223007648726984,2222990905257051];
let currentCardNumber;

const cardButtonsGenerator = (cardsArr) => {
    const result = [];
    cardsArr.forEach((cardNumber, index) => {
        const cardData = `card${index}`;
        const cardNumberStr = cardNumber.toString()
        const cardButtonText = cardNumberStr.substr(0,2) + '...' + cardNumberStr.substr(12,15)
        const cardButton = Markup.callbackButton(cardButtonText, cardData)
        result.push(cardButton);

        bot.action(cardData,(ctx) => {
            ctx.editMessageText(`CardNumber: ${cardNumber}`);
        })
    })
    return result;
}

const cardsButtons = cardButtonsGenerator(cards);

//Start bot
bot.start((ctx) => ctx.reply('Welcome to Lemon telegram bot! To start please send \'menu\''))

//Reaction on command /help
bot.help((ctx) => ctx.reply('This bot is in development right now'))

//Reaction on sending sticker
bot.on('sticker', (ctx) => ctx.reply('Nice sticker'))

//Reply on message Marcus Aurelius
bot.hears('Marcus Aurelius', (ctx) =>
    ctx.reply('You have power over your mind - not outside events. Realize this, and you will find strength.'))

bot.hears('menu', (ctx) =>{
    ctx.reply('Hello <b>Username</b>. <i>Please, choose a card</i>',
        Extra.HTML()
            .markup(Markup.inlineKeyboard(cardsButtons)))
})

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