import TelegramBot from "node-telegram-bot-api";

const token = '6005840606:AAGoxBKjryk-ZwAV-iLY7B91ijm7O8DE_Gw';
const bot = new TelegramBot(token, { polling: true });

interface IChatReminder {
  chatId: number;
  reminderEvery: number;
  lastReminder: number;
}

const chats: Map<number, IChatReminder> = new Map();

bot.setMyCommands([
  {command: '/start', description: 'Start reminder'},
  {command: '/stop', description: 'Stop reminder'},
]);

bot.on('message', ({chat, text}) => {
  const chatId = chat.id;
  console.log(chatId, ': runs ' + text + 'command');

  if (text === '/start') {
    chats.set(chatId, {chatId, reminderEvery: 1000 * 60, lastReminder: Date.now()})
    bot.sendMessage(chatId, 'Bot will remind you in 1h');

    return;
  }

  if (text === '/stop') {
    chats.delete(chatId);
    bot.sendMessage(chatId, 'Bot stop reminder');

    return;
  }

  bot.sendMessage(chatId, 'Unknown command. Use menu');
});

const sendMessages = () => {
  chats.forEach(({reminderEvery, lastReminder, chatId}) => {
    const shouldRemind = Date.now() - lastReminder >= reminderEvery;

    const activeChat = chats.get(chatId);
    if (shouldRemind && activeChat) {
      console.log('send reminder');
      
      activeChat.lastReminder = Date.now();
      bot.sendMessage(chatId, 'Reminder');
    }
  });
}

const checkTime = 1000 * 60;

setTimeout(function run() {
  sendMessages();
  setTimeout(run, checkTime);
}, checkTime); 
