import React, {useEffect, useRef, useCallback} from "react";
import {animationSteps} from "../logic/game-loop";
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

function compileSVG(create, size) {
	const img = new Image();
	img.src = "data:image/svg+xml," + encodeURIComponent(create(size));
	return [img, size];
}

const particleDefs = [
	compileSVG(createToenail, 20),
	compileSVG(createBlade, 25),
	compileSVG(createDirt, 12),
	compileSVG(createTwoNail, 20),
	compileSVG(createThinToenail, 20),
	compileSVG(createTwoBlade, 20),
];

class Particle {
	constructor(data, created) {
		this.kind = data.kind;
		this.x = data.x;
		this.y = data.y;
		this.r = 0;
		this.vx = 0;
		this.vy = 0;
		this.vr = 0;
		this.ay = 0;
		this.created = created;

		if (this.kind === "text") {
			this.x += randRange(-2.5, 2.5);
			this.vy = -100;
			this.text = data.text;
		} else if (this.kind === "grass") {
			this.r = randRange(0, 360);
			this.vx = randRange(-100, 100);
			this.vy = -200;
			this.vr = this.vx * 5;
			this.ay = 1000;
			[this.svg, this.size] = randItem(particleDefs);
			this.size *= randRange(1, 1.25);
		}
	}
	step(diff) {
		this.x += this.vx * diff;
		this.y += this.vy * diff;
		this.r += this.vr * diff;
		this.vy += this.ay * diff;
	}
	draw(context, age) {
		context.globalAlpha = 1 - (age / 1000) ** 2;

		if (this.kind === "text") {
			context.font = "20px 'Germania One'";
			context.textAlign = "center";
			context.fillText(this.text, this.x, this.y);
		} else if (this.kind === "grass") {
			context.translate(this.x, this.y);
			context.rotate((this.r / 360) * Math.PI * 2);
			const dxy = -(this.size / 2);
			context.drawImage(this.svg, dxy, dxy, this.size, this.size);
		}
	}
}

export function Particles({render}) {
	const {current: particles} = useRef(new Set());
	const canvasRef = useRef();

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");

		function step(stamp, diff) {
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
						particle.draw(context, age);
						context.restore();
					}
				}
			}
		}

		function resize() {
			canvas.width = canvas.clientWidth;
			canvas.height = canvas.clientHeight;
		}

		animationSteps.add(step);
		window.addEventListener("resize", resize);
		resize();

		return () => {
			animationSteps.delete(step);
			window.removeEventListener("resize", resize);
		};
	}, []);

	const createParticle = useCallback((data) => {
		particles.add(new Particle(data, performance.now()));
	}, []);

	return (
		<>
			<canvas className={styles.particles} ref={canvasRef} />
			{render(createParticle)}
		</>
	);
}
