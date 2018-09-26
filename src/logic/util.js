const randRange = (min, max) => min + Math.random() * (max - min);
const randInt = (min, max) => Math.floor(randRange(min, max));
const randItem = (list) => list[randInt(0, list.length)];

module.exports = {
	randRange,
	randInt,
	randItem,
};
