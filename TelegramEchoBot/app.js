import { Telegraf } from "telegraf";
import axios from "axios";

const token = '';
const bot = new Telegraf(token);

function photo(user){
    axios.get('https://picsum.photos/200/300')
    .then(function (response) {
        const url = response.request["res"]["responseUrl"];
        bot.telegram.sendPhoto(user.chat.id,url);
        console.log(JSON.stringify(user.from["id"]) + " asked for a photo ");
    });
};

bot.command('help', (ctx) => ctx.reply('Bot will answer you with your messages or send random photo when you will send "photo"'));

bot.on("message", function (user) {
    const txt = user.message.text;
    if (txt.includes("photo")){
        photo(user);
    }
    else {
        bot.telegram.sendMessage(user.chat.id, 'You sent : '+ JSON.stringify(user.message.text));
        console.log(JSON.stringify(user.from["id"]) + " sent : " + JSON.stringify(user.message.text));
    }
    
});

bot.launch();
