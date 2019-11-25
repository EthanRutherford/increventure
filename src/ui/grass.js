import {useState, useEffect} from "react";
import j from "react-jenny";
import styles from "../styles/party.css";
import grass1 from "../images/pngs/grass-1.png";
import grass2 from "../images/pngs/grass-2.png";
import grass3 from "../images/pngs/grass-3.png";
import grass4 from "../images/pngs/grass-4.png";
import grass5 from "../images/pngs/grass-5.png";

const grassUrls = [
	grass1,
	grass2,
	grass3,
	grass4,
	grass5,
];

function loadImage(url) {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = reject;
		image.src = url;
	});
}

const grassPromises = grassUrls.map(loadImage);

async function createGrass() {
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

export function Grass() {
	const [src, setSrc] = useState(null);
	useEffect(() => {createGrass().then(setSrc);}, []);

	return j({img: {className: styles.grass, src}});
}
