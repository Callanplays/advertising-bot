// Description: Main bot class for the Minecraft bot
import mineflayer from 'mineflayer';
import pkg from 'mineflayer-pathfinder';
import { mineflayer as mineflayerViewer } from 'prismarine-viewer';
import { botArgs, Operators } from './config.js';
import { skyblockAdvertise, handleWarpWindowOpen, advertiseLoop, dungeonHubAdvertise } from './advertising.js';
import {
    msgRegex, inviteRegex, disbandRegex, joinRegex, guildRegex, mutedRegex, partyChatRegex, 
} from './util/regex.js';
import { getRandomInt, generateAdvertisement, visitHousing, findNearestPlayer } from './util/utils.js';
const { pathfinder, Movements, goals } = pkg;

process.on('uncaughtException', (err) => {
    
    const errorString = err.toString();
    if (errorString.startsWith("Error: Server didn't respond to transaction for clicking on slot")) {
        return
      } else {
        console.error(err);
      }
});




export class MCBot {
    constructor(username, botConfig) {
        this.username = username;
        this.botConfig = botConfig;

        this.host = botArgs.host;
        this.port = botArgs.port;
        this.version = botArgs.version;
        this.auth = botArgs.auth;
        this.isAdvertising = false;
        this.isSkyblockAdvertising = false;
        this.dungeonHubAdv = false;
        this.initBot();
    }

    initBot() {
        console.log('Attempting to create bot');

        this.bot = mineflayer.createBot({
            username: this.username,
            host: this.host,
            port: this.port,
            version: this.version,
            auth: this.auth,
            settings: this.botConfig
        });

        this.bot.isAdvertising = false;
        this.bot.isSkyblockAdvertising = false;
        this.bot.dungeonHubAdv = false;
        this.bot.botConfig = this.botConfig
        this.bot.loadPlugin(pathfinder);
        this.justJoined = true;
        this.initEvents();
        this.partyLeader = null;
        if (!this.webServerStarted) {
            mineflayerViewer(this.bot, { port: 3007, firstPerson: true });
            this.webServerStarted = true; 
        }
    }

    initEvents() {
        this.bot.on('login', this.onLogin.bind(this));
        this.bot.on('kicked', this.onKicked.bind(this));
        this.bot.on('end', this.onEnd.bind(this));
        this.bot.on('spawn', this.onSpawn.bind(this));
        this.bot.on('error', this.onError.bind(this));
        this.bot.on("messagestr", this.onMessage.bind(this));
        this.bot.on("windowOpen", this.onWindowOpen.bind(this));
    }

    onLogin() {
        const defaultMove = new Movements(this.bot)
        defaultMove.canDig = false
        this.bot.pathfinder.setMovements(defaultMove)
        let botSocket = this.bot._client.socket;
        console.log(`[${this.bot.username}] Logged in to ${botSocket.server ? botSocket.server : botSocket._host}`);
        this.onRejoinDelay = false;

    }

    onKicked(reason, loggedIn) {
        console.log(`[${this.bot.username}] Kick: ${reason}, rejoin delay: ${this.botConfig.rejoinDelay}`);
        this.justJoined = true;
        if (!this.onRejoinDelay) { 
            this.onRejoinDelay = true;
            setTimeout(() => {
                this.onRejoinDelay = false;
                this.initBot();
            }, this.botConfig.rejoinDelay * 60000);
        }
    }

    onEnd(reason) {
        console.log(`[${this.bot.username}] End: ${reason}, rejoin delay: ${this.botConfig.rejoinDelay}`);
        this.justJoined = true;
        if (!this.onRejoinDelay) { 
            this.onRejoinDelay = true;
            setTimeout(() => {
                this.onRejoinDelay = false;
                this.initBot();
            }, this.botConfig.rejoinDelay * 60000);
        }
    }

    onSpawn() {
        console.log(`[${this.bot.username}] Spawned into a world`);
        if (this.justJoined) {
            this.justJoined = false;
            console.log("Attempting to visit housing")
            visitHousing(this.bot);
        }
    }

    onError(err) {
        if (err.code === 'ECONNRESET') {
            console.log(`[${this.bot.username}] Connection reset by peer, rejoining...`);
            this.initBot();
        } else {
            console.log(`[${this.bot.username}] Unhandled error: ${err}`);
        }
    }

    onMessage(message, username) {
        if (username !== "chat") return;
        this.processMessage(message);
    }

    async processMessage(message) {
        if (msgRegex.test(message)) {
            const { username, msg, subject } = msgRegex.exec(message).groups;
            this.operatorCommand(msg, subject, username);
        }

        if (guildRegex.test(message)) {
            const { username, msg, target, subject } = guildRegex.exec(message).groups;
            if (target === this.bot.username || target === 'all') {
                this.operatorCommand(msg, subject, username);
            }
        }

        if (partyChatRegex.test(message)) {
            const { username, msg, target, subject } = partyChatRegex.exec(message).groups;
            if (Operators.includes(username) && (target === this.bot.username || target === 'all')) {
                this.operatorCommand(msg, subject, username);
            }
        }

        if (inviteRegex.test(message)) {
            const { username } = inviteRegex.exec(message).groups;
            console.log(`[Debug] Party invite detected from ${username}`);
            if (Operators.includes(username)) {
                this.partyLeader = username;
                this.bot.chat("/party leave");
                setTimeout(() => this.bot.chat(`/party accept ${this.partyLeader}`), 3000);
            }
        }

        if (mutedRegex.test(message)) {
            console.log(`[ALERT] Bot muted message detected: ${message}`);
            setTimeout(() => this.bot.chat(`/immuted ${this.partyLeader}`), 1000);
            setTimeout(() => {
                this.isAdvertising = false;
                this.isSkyblockAdvertising = false;
                visitHousing();
            }, 6000);
        }

        if (disbandRegex.test(message)) {
            setTimeout(() => this.bot.chat(`/visit ${this.partyLeader}`), 15000);
        }

        if (joinRegex.test(message)) {
            const { username } = joinRegex.exec(message).groups;
            console.log(`[${this.bot.username}] Joined ${username}'s party!`);
        }
    }

    operatorCommand(msg, subject, username) {
        const commands = {
            '.restart': () => process.exit(),
            '.cr': () => this.handleChatReport(subject),
            '.manualAdv': () => this.handleManualAdvertise(subject),
            '.startAdv': () => this.startAdvertising(),
            '.come': () => this.moveToPlayer(username),
            '.attack': () => this.attackNearestPlayer(),
            '.stop': (this.isAdvertising = false, this.isSkyblockAdvertising = false, this.dungeonHubAdv = false),
            '.skyblockAdv': () => this.startSkyblockAdvertising(subject),
            '.dhAdv': () => this.startDungeonHubAdvertising(),
            '.test': () => this.test()
        };

        if (commands[msg]) {
            commands[msg]();
        }
    }

    async test() {

    }
    
    handleChatReport(subject) {
        this.bot.chat(`/pc reported ${subject}`);
        setTimeout(() => {
            this.chatReporting = true;
            this.bot.chat(`/cr ${subject}`);
        }, getRandomInt(5000) + 1000);
    }

    async handleManualAdvertise(subject) {
        this.bot.chat(`/pc Creating an advertisement`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        subject = subject.split(' ')[0];
        if (!isNaN(subject)) {
            try {
                const ad = generateAdvertisement(parseInt(subject, 10));
                this.bot.chat(`/pc ${ad}`);
            } catch (error) {
                console.error(`Failed to generate advertisement type ${subject}:`, error);
            }
        } else {
             console.error('Invalid advertisement type provided.');
        }
    };

    startAdvertising() {
        this.isAdvertising = true;
        advertiseLoop(this.bot);
    }

    async startDungeonHubAdvertising() {
        this.bot.isSkyblockAdvertising = true; 
        this.bot.dungeonHubAdv = true;
        console.log(this.bot.username, "is starting dungeon hub advertising ONLY", this.bot.dungeonHubAdv)
        this.bot.chat("/play skyblock");
        await new Promise(resolve => setTimeout(resolve, 4000 + getRandomInt(1000)));
        this.bot.chat("/warp dh");
        dungeonHubAdvertise(this.bot, goals)
    }
    
    async startSkyblockAdvertising(subject) {
        subject = subject.split(' ')[0];
        if (subject == "true") {
            this.bot.dungeonHubAdv = false;
        } if (subject == "false") {
            this.bot.dungeonHubAdv = true;
        } else {
             console.error('Invalid type provided. (true/false)');
             return
        }
        this.bot.isSkyblockAdvertising = true;
        console.log(this.bot.username, "is starting skyblock advertising", this.isSkyblockAdvertising)
        this.bot.chat("/play skyblock");
        await new Promise(resolve => setTimeout(resolve, 4000 + getRandomInt(1000)));
        this.bot.chat("/hub");
        skyblockAdvertise(this.bot, goals);
    }

    async onWindowOpen(window) {
        if (this.chatReporting) {
            setTimeout(() => this.bot.simpleClick.leftMouse(11, 1, 0), 3000);
            this.chatReporting = false;
            return;
        }
        if (this.bot.isSkyblockAdvertising) {
            console.log('Skyblock hub swap menu detected');
            await handleWarpWindowOpen(window, this.bot, goals);
        }
        if (!this.bot.isAdvertising) {
            this.bot.simpleClick.leftMouse(window.slots.find(n => n).slot, 1, 0);
            return;
        }

    }
};
