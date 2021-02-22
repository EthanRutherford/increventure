import {useState, useRef, useEffect} from "react";
import {WeightedSet, randInt} from "../../logic/util";

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
	const tileSet = new WeightedSet(tiles.map(({weight, ...tile}, index) => ({
		item: {...tile, image: images[index]},
		weight: weight,
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

			const entry = {
				img: tile.image,
				flipY: tile.flipY && randInt(0, 1) === 1,
				flipX: tile.flipX && randInt(0, 1) === 1,
				rotate: tile.rotate ? randInt(0, 3) : 0,
			};

			curCol[j] = tile.noFollow;
			def[i][j] = entry;
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
			const tile = bgDef[i][j];
			const x = (i + .5) * ts;
			const y = (j + .5) * ts;
			const half = ts / 2;

			context.save();
			context.translate(x, y);
			context.scale(tile.flipX ? -1 : 1, tile.flipY ? -1 : 1);
			context.rotate(tile.rotate * Math.PI / 2);

			context.drawImage(tile.img, -half, -half, ts, ts);
			context.restore();
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

	return <img className={className} src={src} ref={img} />;
}
