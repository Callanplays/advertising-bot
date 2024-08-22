export const msgRegex =
	/^From(?: (?<rank>\[VIP\+?\]|\[MVP\+?\+?\]))? (?<username>[a-zA-Z0-9_]{2,16}): (?<msg>.+) (?<subject>.+)$/m;
export const inviteRegex =
	/^(?:(?<rank>\[VIP\+?\]|\[MVP\+?\+?\]))? (?<username>[a-zA-Z0-9_]{2,16}) has invited you to join their party!$/m;
export const disbandRegex =
	/^(?:(?<rank>\[VIP\+?\]|\[MVP\+?\+?\]))? (?<username>[a-zA-Z0-9_]{2,16}) has disbanded the party!$/m;
export const joinRegex =
	/^You have joined (?:(?<rank>\[VIP\+?\]|\[MVP\+?\+?\]))? (?<username>[a-zA-Z0-9_]{2,16})'s party!$/m;
export const guildRegex =
    /^Officer >(?: (?<rank>\[VIP\+?\]|\[MVP\+?\+?\]))? (?<username>[a-zA-Z0-9_]{2,16}) ?(?<tag>\[[^\]]+\])?: (?<msg>\.\w+.+) (?<target>[a-zA-Z0-9_]{2,16}) (?<subject>.+)$/m;
export const mutedRegex =
    /^Mute ID: #(\S+)$/m;
export const partyChatRegex =
/^Party >(?: (?<rank>\[VIP\+?\]|\[MVP\+?\+?\]))? (?<username>[a-zA-Z0-9_]{2,16}): (?<msg>\.\w+.+) (?<target>[a-zA-Z0-9_]{2,16}) (?<subject>.+)$/m;