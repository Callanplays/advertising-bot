const msgRegex =
	/^From(?: (?<rank>\[VIP\+?\]|\[MVP\+?\+?\]))? (?<username>[a-zA-Z0-9_]{2,16}): (?<msg>.+) (?<subject>.+)$/m;
const inviteRegex =
	/^(?:(?<rank>\[VIP\+?\]|\[MVP\+?\+?\]))? (?<username>[a-zA-Z0-9_]{2,16}) has invited you to join their party!$/m;
const disbandRegex =
	/^(?:(?<rank>\[VIP\+?\]|\[MVP\+?\+?\]))? (?<username>[a-zA-Z0-9_]{2,16}) has disbanded the party!$/m;
const joinRegex =
	/^You have joined (?:(?<rank>\[VIP\+?\]|\[MVP\+?\+?\]))? (?<username>[a-zA-Z0-9_]{2,16})'s party!$/m;
const guildRegex =
    /^Officer >(?: (?<rank>\[VIP\+?\]|\[MVP\+?\+?\]))? (?<username>[a-zA-Z0-9_]{2,16}) ?(?<tag>\[[^\]]+\])?: (?<msg>\.\w+.+) (?<target>[a-zA-Z0-9_]{2,16}) (?<subject>.+)$/m;
const mutedRegex =
    /^Mute ID: #(\S+)$/m;
const partyChatRegex =
/^Party >(?: (?<rank>\[VIP\+?\]|\[MVP\+?\+?\]))? (?<username>[a-zA-Z0-9_]{2,16}): (?<msg>\.\w+.+) (?<target>[a-zA-Z0-9_]{2,16}) (?<subject>.+)$/m;
const housingRegex = 
    /^\* (?<msg>.+)$/m;
const moveCommandRegex = 
    /^(?<type>\w+)\s+(?<x>-?\d+)\s+(?<y>-?\d+)\s+(?<z>-?\d+)$/m;