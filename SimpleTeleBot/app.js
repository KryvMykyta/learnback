import { Command } from "commander";
import { Telegraf } from "telegraf";
const token = '5698955715:AAFOYZkROkkGGUrD5CeMxoXcBxfwOMhvTuI';
const bot = new Telegraf(token);

const cmd = new Command();

cmd.command('message')
  .description('sends a string to a telegram bot')
  .argument('<string>', 'text to sent')
  .action( function(str) {
    bot.telegram.sendMessage(270719988,str);
  });

cmd.command('image')
  .description('sends an image to a telegram bot')
  .argument('<path>', 'path to an image to sent')
  .action( function(path) {
    bot.telegram.sendPhoto(270719988, {source: path});
  });

cmd.parse();
