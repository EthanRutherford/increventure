const randItem = (list) => list[Math.floor(Math.random() * list.length)];

function analyzeWords(words) {
	const analysis = {
		alphabet: [],
		occurrences: {},
	};

	for (const word of words) {
		analysis.alphabet.push(word[0]);
		for (let i = 1; i < word.length; i++) {
			const char0 = word[i - 1];
			const char1 = word[i];

			analysis.alphabet.push(char1);
			analysis.occurrences[char0] = analysis.occurrences[char0] || [];
			analysis.occurrences[char0].push(char1);
		}
	}

	return analysis;
}

function createName(analysis) {
	const wordLength = 4 + Math.floor(Math.random() * 8);

	let name = randItem(analysis.alphabet);
	while (name.length < wordLength) {
		const lastChar = name[name.length - 1];
		const possibles = analysis.occurrences[lastChar] || analysis.alphabet;
		name += randItem(possibles);
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
	"rot",
	"nasty",
	"sewage",
	"muck",
];
