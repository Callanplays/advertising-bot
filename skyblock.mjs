import Vec3 from 'vec3';

const getRandomInt = (max) => Math.floor(Math.random() * max);

export function clickLobbySlot(lobbyNumber) {
    // Calculate slot based on the lobby number
    return lobbyNumber - 1; // Example arbitrary calculation
}

export function skyblockAdvertise(bot) {
    if (bot.advertisingDelay || !bot.advertising) {
        console.log(`[${bot.username}] Double Advertisement trigger, canceling.`);
        return;
    } else {
        bot.advertisingDelay = true;

        // Go to the skyblock hub (twice for good measure)
        setTimeout(() => {
            bot.chat("/play skyblock");
        }, 5000 + getRandomInt(1000));

        setTimeout(() => {
            bot.chat("/hub");
        }, 10000 + getRandomInt(1000));

        setTimeout(() => {
            bot.chat("/hub");
        }, 15000 + getRandomInt(1000));

        // Move towards NPC
        setTimeout(() => {
            bot.look(1.57079632679, 0);
            bot.target = new Vec3(-10, 70, -69.5);
            bot.navigate.to(bot.target);
        }, 18000 + getRandomInt(1000));

        // Face NPC
        setTimeout(() => {
            bot.look(1.57079632679, 0);
            bot.target = new Vec3(-10, 70, -67);
            bot.look(0, 0);
            bot.navigate.to(bot.target);
        }, 21000 + getRandomInt(1000));

        // Click the NPC
        setTimeout(() => {
            bot.advertising = true;
            bot.attack(bot.nearestEntity(), true);
            bot.advertisingDelay = false;
        }, 24000 + getRandomInt(7000));
    }
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

export function calculateAveragePlayerCount(lobbies) {
    const totalPlayers = lobbies.reduce((sum, lobby) => sum + lobby.playerCount, 0);
    return totalPlayers / lobbies.length;
}

export function filterPopularLobbies(lobbies, average) {
    return lobbies.filter(lobby => lobby.playerCount > average);
}

export function getNextPopularLobby(popularLobbies, currentLobby) {
    return popularLobbies.find(lobby => lobby.lobbyNumber > currentLobby);
}

export function selectNextLobby(bot, nextLobby) {
    const slotIndex = clickLobbySlot(nextLobby.lobbyNumber);
    bot.simpleClick.leftMouse(slotIndex, 1, 0);
}