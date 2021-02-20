import {randItem, randInt, WeightedSet} from "../util";

function isVowel(letter) {
	return "aeiouy".includes(letter);
}

export function analyzeWords(words) {
	const consonant = new WeightedSet();
	const vowel = new WeightedSet();

	for (const word of words) {
		let i = 0;
		while (i < word.length) {
			const isMakingVowel = isVowel(word[i]);
			let phoneme = "";
			while (word[i] && isVowel(word[i]) === isMakingVowel) {
				phoneme += word[i];
				i++;
			}

			const phonemes = isMakingVowel ? vowel : consonant;
			phonemes.add(phoneme);
		}
	}

	return {consonant, vowel};
}

export function createName(phonemes) {
	const wordLength = randInt(4, 10);

	let useVowel = randItem([true, false]);
	let name = "";

	while (name.length < wordLength) {
		const set = useVowel ? phonemes.vowel : phonemes.consonant;
		name += set.getRand();
		useVowel = !useVowel;
	}

	if (
		name.startsWith("ck") ||
		name.startsWith("nk") ||
		name.startsWith("ng") ||
		name.startsWith("dg") ||
		name.startsWith("rb") ||
		name.startsWith("mp") ||
		name.startsWith("ct")
	) {
		if (randItem([true, false])) {
			name = name.slice(1);
		} else {
			name = name[0] + name.slice(2);
		}
	}

	if (
		name.startsWith("lth") ||
		name.startsWith("rsh")
	) {
		if (randItem([true, false])) {
			name = name.slice(1);
		} else {
			name = name[0] + name.slice(3);
		}
	}

	if (
		(
			name.endsWith("l") ||
			name.endsWith("r")
		) &&
		!isVowel(name[name.length - 2])
	) {
		name += "e";
	}

	name = name[0].toUpperCase() + name.substr(1);
	return name;
}

export const slimeWords = [
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
	"rot",
	"nasty",
	"sewage",
	"muck",
	"gross",
	"garbage",
	"filth",
	"ugliness",
	"trash",
	"bog",
	"marsh",
	"glob",
	"blob",
	"smear",
	"stain",
	"dump",
	"grump",
	"sleaze",
	"ectoplasm",
];
