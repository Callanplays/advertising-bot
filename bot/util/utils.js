import {
    hookRank, hookWholesome1, hookWholesome2, hookLoud1, hookLoud2,
    descriptionWholesome, description1, description2, join1, end1,
    wholesomeEnd, rankEnd, hookLouds, hookGuild,
    descriptionGuild1, descriptionGuild2
} from './messages.js';
import { guild, botSettings } from '../config.js';

export function visitHousing(bot) {    
    setTimeout(() => bot.chat(`/lobby Housing`), 1000);
    console.log('Visit housing triggered')
    setTimeout(() => bot.chat(`/visit ${bot.botConfig.autoVisitUsername}`), 6000);    
}
    
export function findNearestPlayer(bot) {
    if (!bot || !bot.players) return null;
    return Object.values(bot.players)
        .filter(player => player.entity)
        .reduce((nearest, player) => {
            const distance = bot.entity.position.distanceTo(player.entity.position);
            return distance < nearest.dist ? { player, dist: distance } : nearest;
        }, { player: null, dist: Infinity }).player;    
} 

export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export function generateAdvertisement(id) {
    switch(id) {
            
        case 1:  
            return `/ac ${description1[getRandomInt(description1.length)]} ${description2[getRandomInt(description2.length)]} ${join1[getRandomInt(join1.length)]} ${gifter} ${end1[getRandomInt(end1.length)]}`;
               
        case 2:
            return `/ac ${hookRank[getRandomInt(hookRank.length)]} /visit ${gifter} ${rankEnd[getRandomInt(rankEnd.length)]}`;
        
        case 3:
            return `/ac ${hookWholesome1[getRandomInt(hookWholesome1.length)]} ${hookWholesome2[getRandomInt(hookWholesome2.length)]} [ /visit ${gifter} ] ${descriptionWholesome[getRandomInt(descriptionWholesome.length)]} hosting a ${description1[getRandomInt(description1.length)]} ${description2[getRandomInt(description2.length)]}! ${wholesomeEnd[getRandomInt(wholesomeEnd.length)]}`;
     
        case 4:
            return `/ac ${hookWholesome1[getRandomInt(hookWholesome1.length)]} < ${hookLouds[getRandomInt(hookLouds.length)]} > /visit ${gifter} < ${hookLouds[getRandomInt(hookLouds.length)]} > ${wholesomeEnd[getRandomInt(wholesomeEnd.length)]}`;
            
        case 5: //guild advertisement
        let firstDescription = descriptionGuild2[getRandomInt(descriptionGuild2.length)];
        let secondDescription;
        do {
            secondDescription = descriptionGuild2[getRandomInt(descriptionGuild2.length)];
        } while (secondDescription === firstDescription);
        return `/ac ${hookWholesome1[getRandomInt(hookWholesome1.length)]} ${hookGuild[getRandomInt(hookGuild.length)]} ${descriptionGuild1[getRandomInt(descriptionGuild1.length)]} with ${firstDescription}, ${secondDescription}, and more, if that sounds fun /g join ${guild}!`

    }
};