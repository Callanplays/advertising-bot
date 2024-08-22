
import {
    findNearestPlayer,
    getRandomInt,
    generateAdvertisement
} from './util/utils.js';

let currentLobby;

export async function advertiseLoop(bot) {
    if (!bot.isAdvertising) {
        console.log("Advertising completed!")
        return;
    }

    bot.chat(`/lobby`);
    await new Promise(resolve => setTimeout(resolve, 5000 + getRandomInt(5000)));
    bot.chat(`/l housing`);
    await new Promise(resolve => setTimeout(resolve, 10000 + getRandomInt(5000)));
    bot.chat(`/swaplobby ${getRandomInt(4)}`);
    await new Promise(resolve => setTimeout(resolve, 15000 + getRandomInt(5000)));
    const ad = generateAdvertisement(4);
    if (ad) {
        console.log(`[${bot.username}] Advertisement: ${ad}`);
        bot.chat(ad);
    } else {
        console.log(`[Debug] Could not generate advertisement`);
    }
    await new Promise(resolve => setTimeout(resolve, 20000 + getRandomInt(10000)));
    advertiseLoop(bot);  // Recursively call advertiseLoop
}

export function clickLobbySlot(lobbyNumber) { // Calculate the slot index in the 9x6 grid
    if (lobbyNumber < 1 || lobbyNumber > 28) {
        console.error("Invalid lobby number:", lobbyNumber);
        return;
    }
    let row = Math.floor((lobbyNumber - 1) / 7); 
    let column = (lobbyNumber - 1) % 7; 
    let adjustedRow = row + 1; 
    let adjustedColumn = column + 1;

    let slotIndex = adjustedRow * 9 + adjustedColumn; 
    return slotIndex

}

export async function dungeonHubAdvertise(bot, goals) {
    
    console.log("Running dungeon hub advertisement PLS PLS PLS BE TRUE " + bot.dungeonHubAdv)
    bot.chat("/warp dh");
    await new Promise(resolve => setTimeout(resolve, 1000 + getRandomInt(1000)));


    bot.look(1.57079632679, 0);
    bot.pathfinder.setGoal(new goals.GoalBlock(-36.5, 119, 10.5));


    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 1000));
    const nearestPlayer = findNearestPlayer(bot);

    if (nearestPlayer) {
        bot.lookAt(nearestPlayer.entity.position.offset(0, nearestPlayer.entity.height, 0));
    } else {
        console.log('[Debug] No nearby player to face');
    }

    bot.attack(bot.nearestEntity(), true);
}

export async function handleWarpWindowOpen(window, bot, goals) {
    const lobbies = extractLobbiesFromWindow(window); // Extract lobby information from the window
    
    const popularLobbies = lobbies.filter(lobby => lobby.playerCount > 3); // Filter lobbies with more than average player count
    

    if (typeof currentLobby === 'undefined') {
        currentLobby = 0;
    }
    const nextLobby = popularLobbies.find(lobby => lobby.lobbyNumber > currentLobby)?.lobbyNumber;
    
    console.log('Popular Lobbies:', JSON.stringify(popularLobbies, null, 2));
    console.log('Next Lobby:', nextLobby);

    if (nextLobby) {
        currentLobby = nextLobby;
        const lobbySlot = clickLobbySlot(nextLobby);
        bot.simpleClick.leftMouse(lobbySlot, 1, 0);
        bot.once("messagestr", async (message) => {
            if (message.includes("Couldn't warp you! Try again later. (SERVERS_DID_NOT_ACCEPT)" || "This server is full!")) {
                console.log("[Error] Server full, skipping and trying next server...");
                if (bot.dungeonHubAdv) {
                    dungeonHubAdvertise(bot, goals)
                } else {
                    skyblockAdvertise(bot, goals)

                }
                
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 4000 + getRandomInt(1000)));
            const moveForwardDistance = 10 + getRandomInt(11);
            const moveSideDistance = getRandomInt(14)-7
            bot.pathfinder.setGoal(new goals.GoalBlock(bot.entity.position.x + moveSideDistance, bot.entity.position.y, bot.entity.position.z - moveForwardDistance));

            await new Promise(resolve => setTimeout(resolve, 3000 + getRandomInt(5000)));
            const ad = generateAdvertisement(5);
            console.log(`[${bot.username}] Advertisement: ${ad}`);
            bot.chat(ad);

            const waitTime = 20000 + getRandomInt(20000);
            console.log(`[${bot.username}] Waiting for ${waitTime / 1000} seconds before proceeding.`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            
            if (bot.dungeonHubAdv) {
                dungeonHubAdvertise(bot, goals)
            } else {
                skyblockAdvertise(bot, goals)

            }
        });
        
    } else {
        if (bot.dungeonHubAdv) {
            console.log(`Reached end of above-average lobbies. Advertising completed.`);
            bot.isSkyblockAdvertising = false;
            bot.dungeonHubAdv = false
            currentLobby = 0
            
        }
        console.log(`Reached end of above-average Skyblock lobbies. Moving to dungeon hub.`);
        currentLobby = 0
        bot.dungeonHubAdv = true
        dungeonHubAdvertise(bot, goals)
    }
}

export async function skyblockAdvertise(bot, goals) {
    // if (!bot.isSkyblockAdvertising) {
        // console.log(`[${bot.username}] Skyblock advertisement is not active.`);
        // return
    // }
    bot.chat("/hub");
    
    await new Promise(resolve => setTimeout(resolve, 4000 + getRandomInt(1000)));
    bot.look(1.57079632679, 0);
    bot.pathfinder.setGoal(new goals.GoalBlock(-10, 70, -67));
    
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 1000));
    const nearestPlayer = findNearestPlayer(bot);
    
    if (nearestPlayer) {
        bot.lookAt(nearestPlayer.entity.position.offset(0, nearestPlayer.entity.height, 0));
    } else {
        console.log('[Debug] No nearby player to face');
    }
    
    bot.attack(bot.nearestEntity(), true);
}

export function extractLobbiesFromWindow(window) {
    const lobbies = [];
    for (let y = 1; y <= 4; y++) {
        for (let x = 1; x <= 7; x++) {
            const slot = window.slots[y * 9 + x];
            if (slot?.nbt?.value?.display?.value?.Lore) {
                const lore = slot.nbt.value.display.value.Lore.value.value[0];
                const match = lore.match(/Players: (\d+)/);
                if (match) {
                    const playerCount = parseInt(match[1], 10);
                    const lobbyNumber = slot.count;
                    lobbies.push({ lobbyNumber, playerCount });
                }
            }
        }
    }
    return lobbies;
}
