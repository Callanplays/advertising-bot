import Vec3 from 'vec3';
import { findNearestPlayer, getRandomInt, generateAdvertisement } from './util/utils.js';
let currentLobby;

export function clickLobbySlot(lobbyNumber) {
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

}
export async function handleLobbySwapErr(slotIndex, retryCount = 3, delay = 1000) {
    for (let i = 0; i < retryCount; i++) {
        try {
            await bot.simpleClick.leftMouse(slotIndex, 1, 0);
            console.log(`[${bot.username}] Clicked slot ${slotIndex} on attempt ${i+1}`);
            return; // Exit if successful
        } catch (err) {
            console.error(`[${bot.username}] Click attempt ${i+1} failed: ${err.message}`);
            if (err.message.startsWith("Server didn't respond to transaction for clicking on")) {
                // Retry after a delay
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                // Other errors should not be retried
                throw err;
            }
        }
    }
    console.error(`[${bot.username}] Failed to click slot ${slotIndex} after ${retryCount} attempts.`);
}

export async function handleSkyblockWindowOpen(window, bot) {
    console.log(`[${bot.username}] Skyblock advertisement window opened.`);
    const lobbies = extractLobbiesFromWindow(window); // Extract lobby information from the window
    const totalPlayers = lobbies.reduce((sum, lobby) => sum + lobby.playerCount, 0); //
    const average =  totalPlayers / lobbies.length; // Calculate the average player count
    const popularLobbies = lobbies.filter(lobby => lobby.playerCount > average); // Filter lobbies with more than average player count
    

    if (typeof currentLobby === 'undefined') {
        currentLobby = 0;
    }
    const nextLobby = popularLobbies.find(lobby => lobby.lobbyNumber > currentLobby)?.lobbyNumber;
    console.log(lobbies)
    console.log(popularLobbies)
    console.log(nextLobby)

    if (nextLobby) {
        currentLobby = nextLobby;
        const lobbySlot = clickLobbySlot(nextLobby);
        console.log(`[${bot.username}] Advertising in lobby ${nextLobby}, Calculated slot index: ${lobbySlot}.`);
        bot.simpleClick.leftMouse(lobbySlot, 1, 0);
        
        await new Promise(resolve => setTimeout(resolve, 3000 + getRandomInt(1000)));
        const moveForwardDistance = 10 + getRandomInt(11);
        const currentPos = bot.entity.position.clone();
        const forwardTarget = currentPos.offset(0, 0, moveForwardDistance);
        bot.navigate.to(forwardTarget);
        console.log(`[${bot.username}] Moving forward ${moveForwardDistance} blocks.`);
        await new Promise(resolve => setTimeout(resolve, 3000 + getRandomInt(5000)));
        const ad = generateAdvertisement(5);
        console.log(`[${bot.username}] Advertisement: ${ad}`);
        bot.chat(ad);
        skyblockAdvertise()
    } else {
        console.log(`Reached end of above-average Skyblock lobbies. (${currentLobby})`);
        bot.isSkyblockAdvertising = false;
    }
}

export async function skyblockAdvertise(bot) {
    if (!bot.isSkyblockAdvertising) {
        console.log(`[${bot.username}] Skyblock advertisement is not active.`);
        return
    }
    console.log(`[${bot.username}] Skyblock advertisement loop triggered.`)
    bot.chat("/hub");
    await new Promise(resolve => setTimeout(resolve, 4000 + getRandomInt(1000)));
    bot.look(1.57079632679, 0);
    target = new Vec3(-10, 70, -67);
    bot.navigate.to(target);
    
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
