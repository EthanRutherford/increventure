import {useState, useEffect} from "react";
import j from "react-jenny";
import {WeightedSet} from "../logic/util";

function loadImage(url) {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = reject;
		image.src = url;
	});
}

async function createBg({tiles, width, tileSize}) {
	const images = await Promise.all(tiles.map((tile) => loadImage(tile.url)));
	const tileSet = new WeightedSet(tiles.map((tile, index) => ({
		item: {
			url: tile.url,
			image: images[index],
			noFollow: tile.noFollow,
		},
		weight: tile.weight,
	})));

	const height = width * 2;
	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");
	canvas.width = width * tileSize;
	canvas.height = height * tileSize;

	let prevCol = [];
	let curCol = [];
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			const above = curCol[j - 1];
			const beside = prevCol[j];
			const tile = above || beside ? tileSet.getFilteredRand((item) => {
				if (
					above && above.has(item.url) ||
					beside && beside.has(item.url)
				) {
					return false;
				}

				return true;
			}) : tileSet.getRand();

			curCol[j] = tile.noFollow;
			context.drawImage(tile.image, i * tileSize, j * tileSize);
		}
		prevCol = curCol;
		curCol = [];
	}

	return canvas.toDataURL();
}

export function TiledBg({className, ...rest}) {
	const [src, setSrc] = useState(null);
	useEffect(() => {createBg(rest).then(setSrc);}, []);

	return j({img: {className, src}});
}
