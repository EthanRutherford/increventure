import {Fragment, useEffect, useRef, useCallback} from "react";
import j from "react-jenny";
import {randItem, randRange} from "../logic/util";
import styles from "../styles/root";

function createSVG(size, inside) {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">${inside}</svg>`;
}

function createCrescent(name, fill, cx, cy, rx, ry, ox, oy, rot, px, py) {
	return [
		`<mask id="${name}-mask">
			<rect fill="white" width="100%" height="100%"/>
			<ellipse fill="black" cx="${cx + ox}" cy="${cy + oy}" rx="${rx}" ry="${ry}"/>
		</mask>`,
		`<ellipse fill="${fill}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${rot ? `transform="rotate(${rot}, ${px}, ${py})"` : ""} mask="url(#${name}-mask)" />`,
	];
}

function createToenail(size) {
	const [mask, ellipse] = createCrescent("toenail", "green", 50, 50, 45, 50, 20, 0);
	return createSVG(size, `<defs>${mask}</defs>${ellipse}`);
}

function createBlade(size) {
	const [mask, ellipse] = createCrescent("blade", "hsl(120, 60%, 40%)", 50, 50, 30, 50, 15, -5);
	return createSVG(size, `<defs>${mask}</defs>${ellipse}`);
}

function createDirt(size) {
	return createSVG(size,
		`<circle fill="hsl(25, 70%, 25%)" cx="50" cy="50" r="33" />
		<circle fill="hsl(25, 75%, 30%)" cx="25" cy="33" r="25" />
		<circle fill="hsl(25, 75%, 27%)" cx="67" cy="33" r="33" />`,
	);
}

function createTwoNail(size) {
	const [mask1, ellipse1] = createCrescent("nail-large", "hsl(120, 100%, 16%)", 50, 50, 12.5, 50, 10, 0);
	const [mask2, ellipse2] = createCrescent("nail-small", "hsl(120, 100%, 16%)", 50, 60, 12.5, 37.5, 10, 0, 15, 50, 95);
	return createSVG(size, `<defs>${mask1}${mask2}</defs>${ellipse1}${ellipse2}`);
}

function createThinToenail(size) {
	const [mask, ellipse] = createCrescent("nail", "hsl(120, 100%, 16%)", 50, 50, 25, 50, 15, 0);
	return createSVG(size, `<defs>${mask}</defs>${ellipse}`);
}

function createTwoBlade(size) {
	const [mask1, ellipse1] = createCrescent("blade-large", "green", 50, 50, 15, 50, 15, -10);
	const [mask2, ellipse2] = createCrescent("blade-small", "hsl(120, 60%, 40%)", 50, 60, 12.5, 40, 10, -5, 18, 50, 95);
	return createSVG(size, `<defs>${mask1}${mask2}</defs>${ellipse1}${ellipse2}`);
}

function compileSVG(def, scale) {
	const size = def.baseSize * scale;
	const img = new Image();
	img.src = "data:image/svg+xml," + encodeURIComponent(def.create(size));
	return [img, size];
}

const particleDefs = [
	{baseSize: 20, create: createToenail},
	{baseSize: 25, create: createBlade},
	{baseSize: 12, create: createDirt},
	{baseSize: 20, create: createTwoNail},
	{baseSize: 20, create: createThinToenail},
	{baseSize: 20, create: createTwoBlade},
];

class Particle {
	constructor(x, y, created) {
		this.x = x;
		this.y = y;
		this.vx = randRange(-1, 1);
		this.vy = -2;
		this.r = randRange(0, 360);
		[this.svg, this.size] = compileSVG(randItem(particleDefs), randRange(1, 1.25));
		this.created = created;
	}
	step(diff) {
		this.x += this.vx * diff;
		this.y += this.vy * diff;
		this.r += this.vx * diff * 5;
		this.vy += .1 * diff;
	}
}

export function Particles({render}) {
	const {current: particles} = useRef(new Set());
	const canvasRef = useRef();

	useEffect(() => {
		// TODO: will probably want to switch to webgl eventually
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		let prev = 0;

		function step(stamp) {
			const diff = (stamp - prev) / 10;
			prev = stamp;

			if (particles.size) {
				// clear the previous frame
				context.clearRect(0, 0, canvas.width, canvas.height);

				// draw each particle
				for (const particle of particles) {
					const age = stamp - particle.created;
					if (age > 1000) {
						particles.delete(particle);
					} else {
						particle.step(diff);

						context.save();
						context.globalAlpha = 1 - (age / 1000);
						context.translate(particle.x, particle.y);
						context.rotate((particle.r / 360) * Math.PI * 2);
						context.drawImage(particle.svg, -(particle.size / 2), -(particle.size / 2));
						context.restore();
					}
				}
			}

			requestAnimationFrame(step);
		}

		requestAnimationFrame(step);

		function resize() {
			canvas.width = canvas.clientWidth;
			canvas.height = canvas.clientHeight;
		}

		window.addEventListener("resize", resize);
		resize();
	}, []);

	const createParticle = useCallback((x, y) => {
		particles.add(new Particle(x, y, performance.now()));
	}, []);

	return j(Fragment, [
		j({canvas: {className: styles.particles, ref: canvasRef}}),
		...render(createParticle),
	]);
}
