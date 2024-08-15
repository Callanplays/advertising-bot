// MCBot.mjs

import mineflayer from 'mineflayer';
import pathfinder from 'mineflayer-navigate';
import pkg from 'mineflayer-pathfinder';
import Vec3 from 'vec3';
import cron from 'node-cron';
import { botArgs, Operators, gifter } from './config.mjs';
import { skyblockAdvertise, clickLobbySlot, extractLobbiesFromWindow, calculateAveragePlayerCount, filterPopularLobbies, getNextPopularLobby, selectNextLobby } from './skyblock.mjs';
import {
    hookRank, hookWholesome1, hookWholesome2, hookLoud1, hookLoud2,
    descriptionWholesome, description1, description2, join1, end1,
    wholesomeEnd, rankEnd, hookLouds
} from './messages.mjs';

const { goals } = pkg;
pathfinder(mineflayer);
const GoalFollow = goals.GoalFollow;

// Define the regex patterns used in processMessage (placeholders)
const msgRegex = /yourMsgRegex/g;
const inviteRegex = /yourInviteRegex/g;
const mutedRegex = /yourMutedRegex/g;
const disbandRegex = /yourDisbandRegex/g;
const joinRegex = /yourJoinRegex/g;
const guildRegex = /yourGuildRegex/g;

export class MCBot {
    constructor(username, settings) {
        this.username = username;
        this.settings = settings;
        this.host = botArgs.host;
        this.port = botArgs.port;
        this.version = botArgs.version;
        this.auth = botArgs.auth;

        this.initBot();
    }

    initBot() {
        console.log('Attempting to create bot');
        console.log(`Debug: ${this.username} ${this.host} ${this.port} ${this.version} ${this.auth}`);

        // Create a new bot instance
        this.bot = mineflayer.createBot({
            username: this.username,
            host: this.host,
            port: this.port,
            version: this.version,
            auth: this.auth 
        });

        // Load pathfinder plugin
        this.bot.loadPlugin(pathfinder);
        this.justJoined = true;
        this.initEvents();
        this.partyLeader = null;       
    }

    initEvents() {
        this.bot.on('login', this.onLogin.bind(this));
        this.bot.on("kicked", this.onKicked.bind(this));
        this.bot.on('end', this.onEnd.bind(this));
        this.bot.on('spawn', this.onSpawn.bind(this));
        this.bot.on('error', this.onError.bind(this));
        this.bot.on("messagestr", this.onMessage.bind(this));
        this.bot.on("windowOpen", this.onWindowOpen.bind(this));
    }

    // Event handler when the bot logs in
    onLogin() {
        let botSocket = this.bot._client.socket;
        console.log(`[${this.bot.username}] Logged in to ${botSocket.server ? botSocket.server : botSocket._host}`);
        this.onRejoinDelay = false;
        this.advertising = false;
        this.advertisingDelay = false;
    }

    // Event handler for being kicked
    onKicked(reason, loggedIn) {
        console.log(`[${this.bot.username}] Kick: ${reason}, rejoin delay: ${this.settings.rejoinDelay}`);
        this.justJoined = true;
        if (!this.onRejoinDelay) { 
            console.log(`[${this.bot.username}] Detected someone logging in, not rejoining for ${this.settings.rejoinDelay} minutes`);
            this.onRejoinDelay = true;
            setTimeout(() => {
                this.onRejoinDelay = false;
                console.log(`[${this.bot.username}] Rejoining after waiting ${this.settings.rejoinDelay} minutes`);
                this.initBot();
            }, this.settings.rejoinDelay * 60000);
        }
    }

    // Event handler for end event
    onEnd(reason) {
        console.log(`[${this.bot.username}] End: ${reason}, rejoin delay: ${this.settings.rejoinDelay}`);
        this.justJoined = true;
        if (!this.onRejoinDelay) { 
            console.log(`[${this.bot.username}] Detected someone logging in, not rejoining for ${this.settings.rejoinDelay} minutes`);
            this.onRejoinDelay = true;
            setTimeout(() => {
                this.onRejoinDelay = false;
                console.log(`[${this.bot.username}] Rejoining after waiting ${this.settings.rejoinDelay} minutes`);
                this.initBot();
            }, this.settings.rejoinDelay * 60000);
        }
    }

    // Event handler when bot spawns into a world
    onSpawn() {
        console.log(`[${this.bot.username}] Spawned into a world`);
        if (this.justJoined) {
            this.justJoined = false;
            this.settings.wholesomeAdvertise ? setTimeout(() => this.wholesomeLoop(), 5000) : this.visitHousing();
        }
    }

    // Event handler for errors
    onError(err) {
        if (err.code === 'ECONNREFUSED') {
            console.log(`[${this.bot.username}] Failed to connect to ${err.address}:${err.port}`);
        } else {
            console.error(`[${this.bot.username}] Unhandled error: ${err}`);
        }
    }

    // Event handler for chat messages
    onMessage(message, username) {
        if (username !== "chat") return;
        this.processMessage(message);
    }

    // Makes the bot run and jump (example action)
    async runAndJump() {
        this.bot.creative.stopFlying();
        this.bot.setControlState('forward', true);
        await this.bot.waitForTicks(1);
        this.bot.setControlState('sprint', true);
        this.bot.setControlState('jump', true);
        await this.bot.waitForTicks(11);
        this.bot.clearControlStates();
    }

    // Processes incoming messages and handles them
    async processMessage(message) {
        if (msgRegex.test(message)) {
            const { username, msg, subject } = msgRegex.exec(message).groups;
            this.operatorCommand(msg, subject, username);
        }

        if (inviteRegex.test(message)) {
            const { rank, username } = inviteRegex.exec(message).groups;
            if (Operators.includes(username)) {
                this.partyLeader = username;
                this.bot.chat("/party leave");
                setTimeout(() => this.bot.chat(`/party accept ${this.partyLeader}`), 3000);
            }
        }

        if (mutedRegex.test(message)) {
            setTimeout(() => {
                this.bot.chat(`/immuted ${this.partyLeader}`);
            }, 1000);
            setTimeout(() => {
                this.advertising = false;
                this.visitHousing();
            }, 6000);
        }

        if (disbandRegex.test(message)) {
            setTimeout(() => this.bot.chat(`/visit ${this.partyLeader}`), 15000);
        }

        if (joinRegex.test(message)) {
            const { username } = joinRegex.exec(message).groups;
            console.log(`[${this.bot.username}] Joined ${username}'s party!`);
        }

        if (guildRegex.test(message)) {
            const { username, msg, subject } = guildRegex.exec(message).groups;
            this.operatorCommand(msg, subject, username);
        }

        // More message handling logic for other regex...
    }

    // Handles commands from operators
    operatorCommand(msg, subject, username) {
        const recognizedMessages = {
            '.restart': () => process.exit(),
            '.cr': () => this.handleChatReport(subject),
            '.manualAdv': () => this.handleManualAdvertise(),
            '.startAdv': () => this.startAdvertising(),
            '.come': () => this.moveToPlayer(username),
            '.attack': () => this.attackNearestPlayer(),
            '.stop': () => this.stopAdvertising()
        };

        if (msg in recognizedMessages) {
            recognizedMessages[msg]();
        }

        // Add more operator commands as needed...
    }

    // Handles chat report command
    handleChatReport(subject) {
        console.log(`[${this.bot.username}] Chatreport command, target is ${subject}`);
        this.bot.chat(`/pc reported ${subject}`);
        setTimeout(() => {
            this.chatReporting = true;
            this.bot.chat(`/cr ${subject}`);
        }, this.getRandomInt(5000) + 1000);
    }

    // Manually advertise on chat
    handleManualAdvertise() {
        console.log(`[${this.bot.username}] Manually advertising rank gifter IGN!`);
        this.bot.chat(`/pc kk im gonna send a /visit ${gifter} message`);
        setTimeout(() => {
            this.bot.chat(this.generateAdvertisement(4));
        }, this.getRandomInt(5000) + 1000);
    }

    // Starts the advertising loop
    startAdvertising() {
        this.advertisingDelay = false;
        this.advertiseLoop = true;
        this.advertising = true;
        this.advertiseLoop();
    }

    // Advertising loop to continually send advertisements
    async advertiseLoop() {
        while (this.advertising) {
            if (!this.advertisingDelay) {
                console.log(`[${this.bot.username}] Sending advertisement...`);
                this.bot.chat(this.generateAdvertisement(3)); // Example advertisement type ID
                this.advertisingDelay = true;
                setTimeout(() => {
                    this.advertisingDelay = false;
                }, this.settings.wholesomeDelay * 60000); // Delay in milliseconds
            }
            await new Promise(resolve => setTimeout(resolve, 1000)); // Check every second
        }
    }

    // Event handler for window opening
    onWindowOpen(window) {
        if (this.chatReporting) {
            setTimeout(() => this.bot.simpleClick.leftMouse(11, 1, 0), 3000);
            this.chatReporting = false;
            return;
        }

        if (!this.advertising) {
            console.log(`[${this.bot.username}] /visit Menu (probably) Window Opening detected, clicking it.`);
            this.bot.simpleClick.leftMouse(window.slots.filter(n => n)[this.settings.autoVisitSlot - 1].slot, 1, 0);
        } else {
            console.log(`[${this.bot.username}] Hopefully Skyblock hub menu opened.`);
            const lobbies = extractLobbiesFromWindow(window);

            const averagePlayerCount = calculateAveragePlayerCount(lobbies);
            const popularLobbies = filterPopularLobbies(lobbies, averagePlayerCount);

            const nextLobby = getNextPopularLobby(popularLobbies, this.currentLobby);
            if (nextLobby) {
                selectNextLobby(this.bot, nextLobby);
                skyblockAdvertise(this.bot);
            } else {
                console.log(`Reached end of above-average Skyblock lobbies. (${this.currentLobby})`);
            }
        }
    }

    wholesomeLoop() {
        // Implement wholesomeLoop logic...
    }

    // Makes the bot visit a specified housing
    visitHousing() {
        console.log(`[${this.bot.username}] Visit Housing Triggered`);
        setTimeout(() => this.bot.chat(`/lobby Housing`), 1000);
        console.log(`[${this.bot.username}] Visiting ${this.autoVisitUsername}'s housing`);
        setTimeout(() => this.bot.chat(`/visit ${this.autoVisitUsername}`), 6000);
        console.log(`[${this.bot.username}] Visiting slot ${this.settings.autoVisitSlot}`);
    }

    // Finds the nearest player to the bot
    findNearestPlayer() {
        if (!this.bot || !this.bot.players) return null;
        return Object.values(this.bot.players)
            .filter(player => player.entity)
            .reduce((nearest, player) => {
                const distance = this.bot.entity.position.distanceTo(player.entity.position);
                return distance < nearest.dist ? { player, dist: distance } : nearest;
            }, { player: null, dist: Infinity }).player;
    }

    // Generates a random integer up to a maximum value
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    // Generates advertisement messages based on an ID
    generateAdvertisement(id) {
        switch(id) {
            case 1:
                return `/ac ${description1[this.getRandomInt(description1.length)]} ${description2[this.getRandomInt(description2.length)]} ${join1[this.getRandomInt(join1.length)]} Tusr ${end1[this.getRandomInt(end1.length)]}`;
            case 2:
                return `/ac ${hookRank[this.getRandomInt(hookRank.length)]} /visit ${gifter} ${rankEnd[this.getRandomInt(rankEnd.length)]}`;
            case 3:
                return `/ac ${hookWholesome1[this.getRandomInt(hookWholesome1.length)]} ${hookWholesome2[this.getRandomInt(hookWholesome2.length)]} [ /visit Tusr ] ${descriptionWholesome[this.getRandomInt(descriptionWholesome.length)]} hosting a ${description1[this.getRandomInt(description1.length)]} ${description2[this.getRandomInt(description2.length)]}! ${wholesomeEnd[this.getRandomInt(wholesomeEnd.length)]}`;
            case 4:
                return `/ac ${hookWholesome1[this.getRandomInt(hookWholesome1.length)]} < ${hookLouds[this.getRandomInt(hookLouds.length)]} > /visit skywurs < ${hookLouds[this.getRandomInt(hookLouds.length)]} > ${wholesomeEnd[this.getRandomInt(wholesomeEnd.length)]}`;
        }
    }
}