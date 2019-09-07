const j = require("react-jenny");
const styles = require("../styles/grass.css");

const grassKinds = [
	require("../images/pngs/grass-1.png"),
	require("../images/pngs/grass-2.png"),
	require("../images/pngs/grass-3.png"),
	require("../images/pngs/grass-4.png"),
	require("../images/pngs/grass-5.png"),
];

const grasses = [];

for (let i = 0; i < 1000; i++) {
	const x = Math.random();
	if (x <= .05) {
		grasses.push(grassKinds[4]);
	} else if (x <= .1) {
		grasses.push(grassKinds[3]);
	} else if (x <= .15) {
		grasses.push(grassKinds[2]);
	} else if (x <= .2) {
		grasses.push(grassKinds[1]);
	} else {
		grasses.push(grassKinds[0]);
	}
}

module.exports = function Grass() {
	return j({div: styles.grass}, grasses.map((url) =>
		j({img: {className: styles.image, src: url}}),
	));
};
