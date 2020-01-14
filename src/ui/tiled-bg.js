import {useState, useRef, useEffect} from "react";
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

async function createBgDef(tiles, width) {
	const images = await Promise.all(tiles.map((tile) => loadImage(tile.url)));
	const tileSet = new WeightedSet(tiles.map((tile, index) => ({
		item: {
			url: tile.url,
			image: images[index],
			noFollow: tile.noFollow,
		},
		weight: tile.weight,
	})));

	const def = [];

	let prevCol = [];
	let curCol = [];
	for (let i = 0; i < width; i++) {
		def[i] = [];
		for (let j = 0; j < width * 2; j++) {
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
			def[i][j] = tile.image;
		}

		prevCol = curCol;
		curCol = [];
	}

	return def;
}

function buildBg(width, bgDef) {
	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");
	const ts = Math.ceil(width / bgDef.length);
	canvas.width = ts * bgDef.length;
	canvas.height = canvas.width * 2;
	context.imageSmoothingEnabled = false;

	for (let i = 0; i < bgDef.length; i++) {
		for (let j = 0; j < bgDef[i].length; j++) {
			context.drawImage(bgDef[i][j], i * ts, j * ts, ts, ts);
		}
	}

	return canvas.toDataURL();
}

export function TiledBg({className, tiles, width}) {
	const [src, setSrc] = useState();
	const bgDef = useRef();
	const img = useRef();
	useEffect(() => {
		const build = () => setSrc(buildBg(img.current.clientWidth, bgDef.current));
		createBgDef(tiles, width).then((result) => {
			bgDef.current = result;
			build();
		});
		window.addEventListener("resize", build);
		return () => window.removeEventListener("resize", build);
	}, []);

	return j({img: {className, src, ref: img}});
}
