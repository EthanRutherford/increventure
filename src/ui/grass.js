const {useState, useEffect} = require("react");
const j = require("react-jenny");
const styles = require("../styles/grass.css");

const grassUrls = [
	require("../images/pngs/grass-1.png"),
	require("../images/pngs/grass-2.png"),
	require("../images/pngs/grass-3.png"),
	require("../images/pngs/grass-4.png"),
	require("../images/pngs/grass-5.png"),
];

function loadImage(url) {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = reject;
		image.src = url;
	});
}

async function createGrass() {
	const grassPromises = grassUrls.map(loadImage);
	const grasses = await Promise.all(grassPromises);

	const width = 23;
	const height = 45;
	const imageSize = 16;
	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");
	canvas.width = width * imageSize;
	canvas.height = height * imageSize;

	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			const x = Math.random();
			if (x <= .05) {
				context.drawImage(grasses[4], i * imageSize, j * imageSize);
			} else if (x <= .1) {
				context.drawImage(grasses[3], i * imageSize, j * imageSize);
			} else if (x <= .15) {
				context.drawImage(grasses[2], i * imageSize, j * imageSize);
			} else if (x <= .2) {
				context.drawImage(grasses[1], i * imageSize, j * imageSize);
			} else {
				context.drawImage(grasses[0], i * imageSize, j * imageSize);
			}
		}
	}

	return canvas.toDataURL();
}

module.exports = function Grass() {
	const [src, setSrc] = useState(null);
	useEffect(() => {createGrass().then(setSrc);}, []);

	return j({img: {className: styles.grass, src}});
};
