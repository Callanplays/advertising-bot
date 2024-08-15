// index.js
import { MCBot } from './MCBot.mjs';
import { botSettings } from './config.mjs';

botSettings.forEach((config, i) => {
    setTimeout(() => {
        console.log(`Starting bot ${i}`);
        new MCBot(config.gmail, config.settings);
    }, i * 13000);
});