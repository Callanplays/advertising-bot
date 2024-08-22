import { MCBot } from './bot/MCBot.js';
import { botSettings } from './bot/config.js';

botSettings.forEach((config, i) => {
    setTimeout(() => {
        console.log(`Starting bot ${i}`);
        new MCBot(config.gmail, config.botConfig);
    }, i * 13000);
});