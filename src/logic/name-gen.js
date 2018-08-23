const vowels = "aeiou";
const isVowel = (char) => vowels.includes(char);

function createSyllables(words) {
	const list = [];

	for (const word of words) {
		const halfSyllables = [];
		let curHalf;

		for (const char of word) {
			if (curHalf == null) {
				curHalf = char;
			} else if (isVowel(char) === isVowel(curHalf[0])) {
				curHalf += char;
			} else {
				halfSyllables.push(curHalf);
				curHalf = char;
			}
		}

		halfSyllables.push(curHalf);

		for (let i = 1; i < halfSyllables.length; i++) {
			list.push(halfSyllables[i - 1] + halfSyllables[i]);
		}
	}

	return list;
}

function createName(syllables) {
	const syllableCount = 2 + Math.floor(Math.random() * 3);

	let name = "";
	for (let i = 0; i < syllableCount; i++) {
		name += syllables[Math.floor(Math.random() * syllables.length)];
	}

	return name;
}

const slimeWords = [
	"slime",
	"goo",
	"gunk",
	"mucus",
	"mud",
	"sludge",
	"fungus",
	"glop",
	"mire",
	"ooze",
	"scum",
	"rotten",
	"nastiness",
	"sewage",
	"quagmire",
	"muck",
];
