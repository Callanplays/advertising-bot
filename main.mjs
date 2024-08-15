// Installation:

// - Admin powershell
// Set-ExecutionPolicy RemoteSigned

// - Terminal
// npm install -g pm2
// pm2 start 4.0/bots.mjs
// pm2 logs all

// npm install --save cheezbarger/mineflayer-move
// npm install --save PrismarineJS/mineflayer-navigate

// STOPPING PROGRAM (to update or patch)

// - Terminal
// pm2 stop all
// pm2 delete all

import mineflayer from 'mineflayer';
import pathfinder from 'mineflayer-navigate';
import pkg from 'mineflayer-pathfinder';
import cron from 'node-cron';
import { hookRank, hookWholesome1, hookWholesome2, hookLoud1, hookLoud2, descriptionWholesome, description1, description2, join1, end1, wholesomeEnd, rankEnd, hookLouds } from './messages.mjs'
const { goals } = pkg;
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const navigatePlugin = require('mineflayer-navigate')(mineflayer);
const GoalFollow = goals.GoalFollow
pathfinder(mineflayer);

import Vec3 from 'vec3';
// ...


// Schedule task to run at 4:30 AM every day
// npm install --save node-cron


cron.schedule('30 4 * * *', () => {
    process.exit();
});


let botArgs = {
    host: 'hypixel.net',
    port: 25565,
    version: '1.8',
    auth: 'microsoft'
};

let justJoined = true;
// Regex
const msgRegex =
	/^From(?: (?<rank>\[VIP\+?\]|\[MVP\+?\+?\]))? (?<username>[a-zA-Z0-9_]{2,16}): (?<msg>.+) (?<subject>.+)$/m;
const sudoRegex = 
	/^From(?: (?<rank>\[VIP\+?\]|\[MVP\+?\+?\]))? (?<username>[a-zA-Z0-9_]{2,16}): <(?<subject>\d+)> (?<msg>.+)$/m;
const inviteRegex =
	/^(?:(?<rank>\[VIP\+?\]|\[MVP\+?\+?\]))? (?<username>[a-zA-Z0-9_]{2,16}) has invited you to join their party!$/m;
const disbandRegex =
	/^(?:(?<rank>\[VIP\+?\]|\[MVP\+?\+?\]))? (?<username>[a-zA-Z0-9_]{2,16}) has disbanded the party!$/m;
const joinRegex =
	/^You have joined (?:(?<rank>\[VIP\+?\]|\[MVP\+?\+?\]))? (?<username>[a-zA-Z0-9_]{2,16})'s party!$/m;
const cookieRegex =
	/^(?:\* )?You received (?<cookies>\d+)? cookie(s)? from (?<rank>\[VIP\+?\] |\[MVP\+?\+?\] )?(?<username>[a-zA-Z0-9_]{2,16})!$/m;
const guildRegex =
    /^Officer >(?: (?<rank>\[VIP\+?\]|\[MVP\+?\+?\]))? (?<username>[a-zA-Z0-9_]{2,16}) ?(?<tag>\[[^\]]+\])?: (?<msg>\.\w+.+) (?<target>[a-zA-Z0-9_]{2,16}) (?<subject>.+)$/m;
const partyChatRegex =
	/^Party >(?: (?<rank>\[VIP\+?\]|\[MVP\+?\+?\]))? (?<username>[a-zA-Z0-9_]{2,16}): (?<msg>\.\w+.+) (?<target>[a-zA-Z0-9_]{2,16}) (?<subject>.+)$/m;
const protoolsRegex =
	/^Position (?<point>[AB]) set to (?<x>-?[0-9]+), (?<y>-?[0-9]+), (?<z>-?[0-9]+).$/m;
const friendRegex = 
	/^Friend request from (?<rank>\[VIP\+?\] |\[MVP\+?\+?\] )?(?<username>[a-zA-Z0-9_]{2,16})$/m;
const slotErrorRegex = 
    /^Error: Server didn't respond to transaction for clicking on slot \d+ on window with id \d+./m;
const mutedRegex =
    /^Mute ID: #(\S+)$/m;

const housingRegex = 
    /^\* (?<msg>.+)$/m;
const pseudoHousingRegex =
	/^Party >(?: (?<rank>\[VIP\+?\]|\[MVP\+?\+?\]))? (?<username>[a-zA-Z0-9_]{2,16}): \* (?<msg>\w+.+)$/m;


const moveCommandRegex = 
    /^(?<type>\w+)\s+(?<x>-?\d+)\s+(?<y>-?\d+)\s+(?<z>-?\d+)$/m;









let Operators = [
    "chickendoodle08",
    "onvm",
    "Tusr",
    "6nna",
    "Callanplays",
    "h00dz",
    "Cashn",
    "NOO6",
    "Mihd",
    "Dharma",
    "skywurs",
    "Cheese_Sheep",
    "ENNO20",
    "Ohpls_"
];
let gifter = [
    "Tusr"
]

// Loud Advertisement format;
// hookWholesome1 + < hookLouds > + /visit Skywurs + < hookLouds > + wholesomeEnd1

class MCBot {
    
    // Constructor
    constructor(username, settings) {
        this.username = username;
        this.settings = settings; // New settings parameter
        this.host = botArgs["host"];
        this.port = botArgs["port"];
        this.version = botArgs["version"];
        this.auth = botArgs["auth"];
        
        this.initBot();
    }

    // Init bot instance
    initBot() {
        console.log('Attempting to create bot')
        console.log('Debug:' + this.username + ' ' + this.host + ' ' + this.port + ' ' + this.version + ' ' + this.auth)
        this.bot = mineflayer.createBot({
            "username": this.username,
            "host": this.host,
            "port": this.port,
            "version": this.version,
            "auth": this.auth 
        });
        this.bot.loadPlugin(pathfinder);
        this.justJoined = true;
        this.initEvents()        
        this.partyLeader = "null"
        navigatePlugin(this.bot);
        
    }

    


    async runAndJump() {
        
        this.bot.creative.stopFlying();
        this.bot.setControlState('forward', true);

        await this.bot.waitForTicks(1);
        this.bot.setControlState('sprint', true);
        this.bot.setControlState('jump', true);

        await this.bot.waitForTicks(11);
        this.bot.clearControlStates();
    }


    // Init bot events
    initEvents() {
        
        this.bot.on('login', () => {
            let botSocket = this.bot._client.socket;
            console.log(`[${this.bot.username}] Logged in to ${botSocket.server ? botSocket.server : botSocket._host}`);
            this.onRejoinDelay = false;
            this.advertising = false;
            this.advertisingDelay = false;
            
        });
        
        this.bot.on("kicked", (reason, loggedIn) => {
            console.log(`[${this.bot.username}] Kick: ${reason}, rejoin delay: ${this.settings.rejoinDelay}`);
            this.justJoined = true;
            if (!this.onRejoinDelay) { 
                console.log(`[${this.bot.username}] Detected someone logging in, not rejoining for ${this.settings.rejoinDelay} minutes`);
                this.onRejoinDelay = true;
                setTimeout(() => {
                    this.onRejoinDelay = false;
                    console.log(`[${this.bot.username}] Rejoining after waiting ${this.settings.rejoinDelay} minutes`);
                    this.initBot();
                }, this.settings.rejoinDelay*60000);
            }
        })

        this.bot.on('end', (reason) => {
            console.log(`[${this.bot.username}] End: ${reason}, rejoin delay: ${this.settings.rejoinDelay}`);
            this.justJoined = true;
            if (!this.onRejoinDelay) { 
                console.log(`[${this.bot.username}] Detected someone logging in, not rejoining for ${this.settings.rejoinDelay} minutes`);
                this.onRejoinDelay = true;
                setTimeout(() => {
                    this.onRejoinDelay = false;
                    console.log(`[${this.bot.username}] Rejoining after waiting ${this.settings.rejoinDelay} minutes`);
                    this.initBot();
                }, this.settings.rejoinDelay*60000);
            }
        });

        this.bot.on('spawn', async () => {
            console.log(`[${this.bot.username}] Spawned into a world`);
            if (this.justJoined) {
                this.justJoined = false;

                if (this.settings.wholesomeAdvertise) {
                    console.log(`[${this.bot.username}] Wholesome advertising enabled`);
                    setTimeout(() => wholesomeLoop(), 5000);
                    
                } else {
                    console.log(`[${this.bot.username}] Visiting Housing attempt`);
                    visitHousing();
                    
                }
            }
            
        });

        this.bot.on('error', (err) => {
            if (err.startsWith("Uncaught Exception: Error: Server didn't respond to transaction for clicking on")) {
                return
            }
            if (err.code == 'ECONNREFUSED') {
                console.log(`[${this.bot.username}] Failed to connect to ${err.address}:${err.port}`)
            }
            else if (err === `Error: Failed to obtain profile data for ${this.bot.username}, does the account own minecraft?`) {
                console.log(`[${this.bot.username}] Unhandled error: ${err}`);
            }
            else {
                console.log(`[${this.bot.username}] Unhandled error: ${err}`);
            }
        });
        

        this.bot.on("windowOpen", (window) => {
            if (this.chatReporting) {
                setTimeout(() => this.bot.simpleClick.leftMouse(11, 1, 0), 3000);
                this.chatReporting = false;
                return
            }   
            
            if (!this.advertising) {
                console.log(`[${this.bot.username}] /visit Menu (probably) Window Opening detected, clicking it.`);
                this.bot.simpleClick.leftMouse(window.slots.filter((n) => n)[this.settings.autoVisitSlot - 1].slot, 1, 0);
            } else {
                console.log(`[${this.bot.username}] hopefully skyblock hub menu opened.`);
                const lobbies = [];

                // Iterate over the middle 4x7 grid
                for (let y = 1; y <= 4; y++) {
                    for (let x = 1; x <= 7; x++) {
                        const slot = window.slots[y * 9 + x];

                        // Check if the slot has an item
                        if (slot && slot.nbt && slot.nbt.value.display && slot.nbt.value.display.value.Lore) {
                            const lore = slot.nbt.value.display.value.Lore.value.value[0];

                            // Log the lore
                            //console.log(`Lore found: ${lore}`);

                            // Extract the player count from the lore
                            const match = lore.match(/Players: (\d+)/);
                            if (match) {
                                const playerCount = parseInt(match[1], 10);
                                const lobbyNumber = slot.count;
                                lobbies.push({ lobbyNumber, playerCount });
                            }
                        }
                    }
                }

                // Calculate the average player count
                const average = lobbies.reduce((a, b) => a + b.playerCount, 0) / lobbies.length;

                // Filter the lobbies to only include those with a player count above the average
                const popularLobbies = lobbies.filter(lobby => lobby.playerCount > average);

                //console.log(`Average player count: ${average}, Popular lobbies: ${popularLobbies.map(lobby => lobby.lobbyNumber)}`);

                //console.log('Current lobby:', this.currentLobby);
                //console.log('Popular lobbies:', popularLobbies.map(lobby => lobby.lobbyNumber));
                const nextLobby = popularLobbies.find(lobby => lobby.lobbyNumber > this.currentLobby);
                //console.log('Next lobby:', nextLobby);
                
                if (nextLobby) {
                    // Update the current lobby
                    this.currentLobby = nextLobby.lobbyNumber;
                    //console.log(`Going to the next above average Skyblock lobby (${nextLobby.lobbyNumber})`);
                
                    // Calculate the slot index
                    this.bot.simpleClick.leftMouse(clickLobbySlot(nextLobby.lobbyNumber), 1, 0);

                    skyblockAdvertise();
                } else {
                    console.log(`Reached end of above-average Skyblock lobbies. (${this.currentLobby})`);
                }
            }
            
        });

        this.bot.on("messagestr", (message, username) => {
            if (username !== "chat") return;
            //console.log(`${this.bot.username}: ${message}`);

            // Errors worthy of restart
            if (
                message === "You are AFK. Move around to return from AFK." ||
                message === "A disconnect occurred in your connection, so you have been routed to limbo!" ||
                message === "An exception occurred in your connection, so you were put in the Housing Lobby!" ||
                message === "A kick occurred in your connection, so you were put in the Housing lobby!" ||
                message === "A disconnect occurred in your connection, so you were put in the Housing Lobby!"
            ) {
                console.log(`[${this.bot.username}] Restarting: ${message}`);
                visitHousing();
            }
            // Try again in a second (attempting to /visit)
            if (
                message === "Try again in a second."
            ) {
                setTimeout(() => {
                    console.log(`[${this.bot.username}] Attempted /visit ${this.settings.autoVisitUsername}`);
                    this.bot.chat(`/visit ${this.settings.autoVisitUsername}`);
                }, 5000);
            }

            // Party invite detect
            if (inviteRegex.test(message)) {
                const { rank, username} = inviteRegex.exec(message).groups;
                console.log(`[${this.bot.username}] ${message}`);
                if (Operators.includes(username)) {
                    this.partyLeader = username;
                    console.log(`[${this.bot.username}] Party leader has been set to ${this.partyLeader}`);
                    this.bot.chat("/party leave");
                    setTimeout(() => {
                        console.log("/party accept "+this.partyLeader);
                        this.bot.chat("/party accept "+this.partyLeader);
                    }, 3000);
                }
            }

            // Mute detect
            if (mutedRegex.test(message)) {
                const { code } = mutedRegex.exec(message).groups;
                console.log(`[${this.bot.username}] BOT IS MUTED !!!! ALERT BOT IS MUTED !!!! ${message}`);
                setTimeout(() => {
                    this.bot.chat(`/immuted ${this.partyLeader}`);
                }, 1000);

                setTimeout(() => {
                    advertising = false;
                    visitHousing();
                }, 6000);
            }

            // Disband detect
            if (disbandRegex.test(message)) {
                const { rank, username } = disbandRegex.exec(message).groups;
                console.log(`[${this.bot.username}] ${message}`);
                console.log(`Attempting to rejoin in 15 seconds.`);
                setTimeout(() => {
                    console.log(`Attempted /visit ${this.partyLeader}`);
                    this.bot.chat("/visit "+this.partyLeader);
                }, 15000);
            }

            // Joined party detect
            if (joinRegex.test(message)) {
                console.log(`[${this.bot.username}] ${message}`);
                const { rank, username } = joinRegex.exec(message).groups;
                console.log(`[${this.bot.username}] ${message}`);
                console.log(`Joined ${this.partyLeader}'s party!`);

            }
            
    
            // Sudo -- put <ANY NUMBER> before your message with a space in between -- thsi is so you can spam it (bypass Hypixel spam filters w/ a bunch of random sstuff)
            if (sudoRegex.test(message)) {
                const { rank, username, subject, msg } = sudoRegex.exec(message).groups;
                console.log(`[${this.bot.username}] ${message}`);
                if (Operators.includes(username)) {
                    bot.chat(msg);
                }
            }

            // Messaged by a player
            if (msgRegex.test(message)) {
                const { rank, username, msg, subject } = msgRegex.exec(message).groups;
                console.log(`[${this.bot.username}] [MSG] ${username}: ${message}`);
                operatorCommand(msg, subject, username);
            }

            // recieved a message in the guild
            // 
            if (guildRegex.test(message)) {
                const { rank, username, msg, target, subject } = guildRegex.exec(message).groups;
                
                console.log(`[${this.bot.username}] [OFFICER CHAT] ${username}: ${message}`);
                if (target === this.bot.username || target === 'all') { console.log(`[${this.bot.username}] ${message}` );}
                operatorCommand(msg, subject, username);
            }

            if (partyChatRegex.test(message)) {
                const { rank, username, msg, target, subject } = partyChatRegex.exec(message).groups;
                
                console.log(`[${this.bot.username}] [PARTY CHAT] ${username}: ${message}`);
                if (!Operators.includes(username)) {
                    return
                }
                if (target === this.bot.username || target === 'all') { console.log(`[${this.bot.username}] ${message}` );}
                operatorCommand(msg, subject, username);
            }
    
            // Cookie detect
            if (cookieRegex.test(message)) {
                console.log(`[${this.bot.username}] ${message}`);
                const { cookies, rank, username } = cookieRegex.exec(message).groups;
                this.bot.chat('/friend add ' + username);
            }

            // Friend request detect
            if (friendRegex.test(message)) {
                console.log(`[${this.bot.username}] ${message}`);
                const { rank, username } = friendRegex.exec(message).groups;
                this.bot.chat("/friend accept " + username);
            }



        });
    
        process.on("uncaughtException", (err) => {
            console.log(`[${this.bot.username}] Uncaught Exception: ${err}`);
            if (
                "TypeError: Cannot read properties of undefined (reading 'bot')" ||
                "TypeError: Cannot read properties of undefined (reading 'settings')"

            ) {
                return
            }
            if (!slotErrorRegex.test(err)) {
                console.log(`[${this.bot.username}] ` + err);
            }
            
        });

        const operatorCommand = (msg, subject, username) => {
            
            // Restart ALL bots
            if (msg === ".restart") {
                console.log(`[${this.bot.username}] Restarting ALL bots`);
                process.exit();

            }

            if (msg === ".cr") {
                console.log(`[${this.bot.username}] Chatreport command, target is ${subject}`);
                    this.bot.chat(`/pc reported ${subject}`);

                    setTimeout(() => {
                        this.chatReporting = true;
                        this.bot.chat(`/cr ${subject}`);
                    }, getRandomInt(5000)+1000);
            }
            // rank gift spam messages
            if (msg === ".manualAdv" || msg === ".manualAdvertise") {
                
                console.log(`[${this.bot.username}] Manually advertising rank gifter IGN!`);
                this.bot.chat(`/pc kk im gonna send a /visit ${gifter} message`);
                setTimeout(() => {
                    console.log(`[${this.bot.username}] /visit ${gifter} advertisement sent`);
                    this.bot.chat(generateAdvertisement(4));
                }, getRandomInt(5000)+1000);
            }

            // start advertisements
            if (msg === ".startAdv" || msg === ".startAdvertising") {
                console.log(`[${this.bot.username}] Manually advertising party leader IGN!`);
                this.advertisingDelay = false
                this.advertiseLoop = true
                this.advertising = true
                advertiseLoop();
            }

        
            
            if (msg === '.come') {
                this.target = this.bot.players[username].entity;
                console.log(`[${this.bot.username}] Moving over to ${username}'s position: ${this.bot.players[username].entity.position}`);
                this.bot.navigate.to(this.target.position);
            }


            if (msg === '.attack') {
                console.log(findNearestPlayer(this.bot))
                this.target = findNearestPlayer(this.bot);
                console.log(`[${this.bot.username}] Attacking ${this.target.entity.position}`);

                this.bot.lookAt(this.target.entity.position);
                this.runAndJump();
    
            }
            

            if (msg === '.stop') {
                this.advertising = false;
                setTimeout(() => {
                    this.bot.chat(`/pc stopping advertising im gonna go back to the house`)
                }, 3000);
                visitHousing();
                
            

            }
                
           
        }
        function findNearestPlayer(bot) {
            // Check if bot or bot.players is undefined
            console.log(bot.players + " " + bot)
            if (!bot || !bot.players) {
                console.error("bot or bot.players is undefined");
                return null;
            }
        
            let nearestPlayer = null;
            let nearestDistance = Infinity;
        
            Object.keys(bot.players).forEach(playerName => {
                // Skip if the player is the bot itself
                if (playerName === bot.username) return;
        
                const player = bot.players[playerName];
                if (player && player.entity) {
                    const distance = bot.entity.position.distanceTo(player.entity.position);
                    if (distance < nearestDistance) {
                        nearestDistance = distance;
                        nearestPlayer = player;
                    }
                }
            });
        
            return nearestPlayer;
        }
        function clickLobbySlot(lobbyNumber) {
            // Validate lobbyNumber
            if (lobbyNumber < 1 || lobbyNumber > 28) {
                console.error("Invalid lobby number:", lobbyNumber);
                return;
            }
        
            // Calculate row and column in the 4x7 grid (0-indexed)
            let row = Math.floor((lobbyNumber - 1) / 7); // 0 to 3
            let column = (lobbyNumber - 1) % 7; // 0 to 6
        
            // Adjust for the offset in the 9x6 grid
            // Assuming the 4x7 block starts at row 1, column 1 (0-indexed) of the overall grid
            let adjustedRow = row + 1; // 1 to 4
            let adjustedColumn = column + 1; // 1 to 7
        
            // Calculate the slot index in the 9x6 grid
            // Minecraft inventory slots are 0-indexed, left to right, top to bottom
            let slotIndex = adjustedRow * 9 + adjustedColumn; // Convert row/column to slot index
        
            return slotIndex
            // Click on the slot
           
        }

        const skyblockAdvertise  = () => {
            if (this.advertisingDelay || !this.advertising) {
                console.log(`[${this.bot.username}] Double Advertisement trigger, canceling.`);
                return
            } else {
                this.advertisingDelay = true;

                // Go to the skyblock hub (twice for good measure)
                setTimeout(() => {
                    this.bot.chat("/play skyblock");
                }, 5000+getRandomInt(1000));

                setTimeout(() => {
                    this.bot.chat("/hub");
                }, 10000+getRandomInt(1000));
                
                setTimeout(() => {
                    this.bot.chat("/hub");
                }, 15000+getRandomInt(1000));
                
                // Move towards NPC
                setTimeout(() => {
                    this.bot.look(1.57079632679, 0);
                    this.target = new Vec3(-10, 70, -69.5);
                    this.bot.navigate.to(this.target);
                }, 18000+getRandomInt(1000));
            
                // Face NPC
                setTimeout(() => {
                    this.bot.look(1.57079632679, 0);
                    this.target = new Vec3(-10, 70, -67);
                    this.bot.look(0, 0);
                    this.bot.navigate.to(this.target); 

                    console.log(`[${this.bot.username}] Advertised in Lobby ${this.currentLobby}`);
                    this.bot.chat(`/ac ${hookLoud1[getRandomInt(hookLoud1.length-1)]} ${hookLoud2[getRandomInt(hookLoud2.length-1)]} >>> "/visit ${this.partyLeader}" <<< ${descriptionWholesome[getRandomInt(descriptionWholesome.length-1)]} hosting a ${description1[getRandomInt(description1.length-1)]} ${description2[getRandomInt(description2.length-1)]}! ${wholesomeEnd[getRandomInt(wholesomeEnd.length-1)]} `);
                }, 21000+getRandomInt(1000));
            
                // Click the NPC
                setTimeout(() => {
                    this.advertising = true;
                    this.bot.attack(this.bot.nearestEntity(), true);
                    this.advertisingDelay = false;
                }, 24000+getRandomInt(7000));

                // The menu opening triggers going to the next advertising
            }
        }
        const visitHousing = () => { 
            console.log(`[${this.bot.username}] Visit Housing Triggered`);
            setTimeout(() => {
                console.log(`[${this.bot.username}] Attempted /lobby Housing`);
                this.bot.chat(`/lobby Housing`);
            }, 1000);
            
            setTimeout(() => {
                console.log(`[${this.bot.username}] Attempted /visit ${this.settings.autoVisitUsername}`);
                this.bot.chat(`/visit ${this.settings.autoVisitUsername}`);
            }, 6000);
        }
        
        const wholesomeLoop = () => {
            
            console.log(`[${this.bot.username}] Wholesome loop Triggered`);
            this.bot.chat("/l housing");
            this.advertising = true;
            setTimeout(() => {
                this.bot.chat("/swaplobby " + getRandomInt(4));
            }, 5000);
            setTimeout(() => {
                console.log(wholesomeAdvertisement());
                this.bot.chat(wholesomeAdvertisement());
            }, 10000);
            setTimeout(() => {
                console.log(`[${this.bot.username}] Returning to Housing`);
    
                visitHousing();
                this.advertising = false;
            }, 15000);


            setTimeout(() => {
                wholesomeAdvertisement(); // Call the advertise function
            }, (options.wholesomeDelay*60000)); // option.baseDelay milliseconds
        
            // When you want to stop the loop, use clearInterval(wholesomeID);
        }
        
        function generateAdvertisement(id) {
            
            // id 1: /visit <housing> advertisement
            // id 2: wholesome /visit <housing> advertisement
            // id 3: /visit <host> advertisement
            if (id === 3) {
               return(`/ac ${description1[getRandomInt(description1.length-1)]} ${description2[getRandomInt(description2.length-1)]} ${join1[getRandomInt(join1.length-1)]} Tusr ${end1[getRandomInt(end1.length-1)]}`)
            }
            
            // id 4: manual /visit <host> advertisement (right after gifting)
            if (id === 4) {
                
               return(`/ac ${hookRank[getRandomInt(hookRank.length-1)]} /visit ${gifter} ${rankEnd[getRandomInt(rankEnd.length-1)]}`)
            }

            // id 5: wholesome /visit <host> advertisement
            if (id === 5) {
               return(`/ac ${hookWholesome1[getRandomInt(hookWholesome1.length-1)]} ${hookWholesome2[getRandomInt(hookWholesome2.length-1)]} [ /visit Tusr ] ${descriptionWholesome[getRandomInt(descriptionWholesome.length-1)]} hosting a ${description1[getRandomInt(description1.length-1)]} ${description2[getRandomInt(description2.length-1)]}! ${wholesomeEnd[getRandomInt(wholesomeEnd.length-1)]} `)
            }

            // Id 6: // Loud Advertisement format;
            // hookWholesome1 + < hookLouds > + /visit Skywurs + < hookLouds > + wholesomeEnd1

            if (id == 6) {
                return(`/ac ${hookWholesome1[getRandomInt(hookWholesome1.length-1)]} < ${hookLouds[getRandomInt(hookLouds.length-1)]} > /visit skywurs < ${hookLouds[getRandomInt(hookLouds.length-1)]} > ${wholesomeEnd[getRandomInt(wholesomeEnd.length-1)]}`)
            }

        }
        
        const advertiseLoop = () => {
            if (!this.advertiseLoop || !this.advertising || this.advertisingDelay) { 
                console.log(`[${this.bot.username}] Advertisement loop ended because advertising was disabled, or two loops somehow occurred.`);
                return
            }
            this.advertisingDelay = true
            // housing lobby advertisement (100% chance for now)
            this.bot.chat(`/lobby`)
            
            setTimeout(() => {
                console.log(`[${this.bot.username}] Attempted to go to the Housing Lobby`)
                this.bot.chat(`/l housing`)
            }, 5000 + getRandomInt(5)*1000);

            setTimeout(() => {
                console.log(`[${this.bot.username}] Attempted to go to a random Lobby Instance`)
                this.bot.chat(`/swaplobby ${getRandomInt(4)}`)
            }, 10000 + getRandomInt(5)*1000);

            setTimeout(() => {
                console.log(`[${this.bot.username}] Generated an Advertisement`)
                this.bot.chat(generateAdvertisement(6))
            }, 15000 + getRandomInt(5)*1000);

            

            
            setTimeout(() => {
                this.advertising = true
                this.advertiseLoop = true
                this.advertisingDelay = false 
                advertiseLoop();
            }, 20000 + getRandomInt(10)*1000);
            
        }

        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }
    }
}

const bots = [
// Housing ID
// - 1: Fortnite
// - 2: Lethal Company
    {
        gmail: "callanplays@proton.me", // Tusr
        settings: {
            autoVisitUsername: "Agentwinters_",
            autoVisitSlot: 1,
            wholesomeAdvertise: false,
            wholesomeDelay: 5, // in minutes,
            rejoinDelay: 180, // in minutes
            housingID: 1
        }
    },


];
for (let i = 0; i < bots.length; i++) {
    setTimeout(() => {
        console.log(`Starting bot ${i}`);
        const bot = new MCBot(bots[i].gmail, bots[i].settings);
    }, i * 13000);
}