const {Component, Fragment, createRef} = require("react");
const j = require("react-jenny");

// HACK: use reel svgs pls
const particleDefs = [
	{
		width: 18, height: 20,
		style: "position: relative;border-radius: 50%;width: 18px;height: 20px;box-shadow: inset 4px 0px green;",
	},
	{
		width: 15, height: 25,
		style: "position: relative;border-radius: 50%;width: 15px;height: 25px;box-shadow: inset 3px -1px hsl(120, 60%, 40%);",
	},
	{
		width: 12, height: 10,
		style: "position: relative;border-radius: 50%;margin: 2px;width: 8px;height: 8px;background-color: hsl(25, 70%, 25%);",
		style1: "position: absolute;border-radius: 50%;top: -2px;left: 2px;width: 8px;height: 8px;background-color: hsl(25, 75%, 27%);z-index: 1;",
		style2: "position: absolute;border-radius: 50%;top: -1px;left: -2px;width: 6px;height: 6px;background-color: hsl(25, 75%, 30%);z-index: 0;",
	},
	{
		width: 8, height: 20,
		style: "position: relative;border-radius: 50%;width: 5px;height: 20px;box-shadow: inset 2px 0px hsl(120, 100%, 16%);",
		style1: "position: absolute;border-radius: 50%;bottom: 0;left: 2px;width: 5px;height: 15px;box-shadow: inset 2px 0px hsl(120, 100%, 16%);transform: rotate(15deg);",
	},
	{
		width: 10, height: 20,
		style: "position: relative;border-radius: 50%;width: 10px;height: 20px;box-shadow: inset 3px 0px hsl(120, 100%, 16%);",
	},
	{
		width: 9, height: 20,
		style: "position: relative;border-radius: 50%;width: 6px;height: 20px;box-shadow: inset 3px -2px green;",
		style1: "position: absolute;border-radius: 50%;bottom: 0;left: 3px;width: 5px;height: 16px;box-shadow: inset 2px -1px hsl(120, 60%, 40%);transform: rotate(18deg);",
	},
];
const particleSvgs = particleDefs.map((def) => {
	const data = encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" width="${def.width}" height="${def.height}">` +
			`<foreignObject width="100%" height="100%">` +
				`<div xmlns="http://www.w3.org/1999/xhtml" style="${def.style}">` +
					(def.style1 ? `<div style="${def.style1}"/>` : "") +
					(def.style2 ? `<div style="${def.style2}"/>` : "") +
				"</div>" +
			"</foreignObject>" +
		"</svg>",
	);
	const img = new Image();
	img.src = "data:image/svg+xml," + data;
	return img;
});

class Particle {
	constructor(x, y, created) {
		this.x = x;
		this.y = y;
		this.vx = Math.random() * 2 - 1;
		this.vy = -2;
		this.r = Math.random() * 360;
		this.scale = 1 + Math.random() / 4;
		this.kind = Math.floor(Math.random() * 6);
		this.created = created;

		this.step = this.step.bind(this);
	}
	step(diff) {
		this.x += this.vx * diff;
		this.y += this.vy * diff;
		this.r += this.vx * diff * 5;
		this.vy += .1 * diff;
	}
}

module.exports = class Particles extends Component {
	constructor(...args) {
		super(...args);

		this.particles = new Set();
		this.canvas = createRef();

		this.createParticle = this.createParticle.bind(this);
		this.step = this.step.bind(this);
		this.prev = 0;
	}
	componentDidMount() {
		// TODO: will probably want to switch to webgl eventually
		this.context = this.canvas.current.getContext("2d");
		requestAnimationFrame(this.step);
	}
	createParticle(x, y) {
		this.particles.add(new Particle(x, y, performance.now()));
	}
	step(stamp) {
		const diff = (stamp - this.prev) / 10;
		this.prev = stamp;

		const {canvas: {current: canvas}, context, particles, step} = this;
		if (
			canvas.width !== canvas.clientWidth ||
			canvas.height !== canvas.clientHeight
		) {
			canvas.width = canvas.clientWidth;
			canvas.height = canvas.clientHeight;
		}

		if (particles.size) {
			// clear the area covered by particles in previous frame
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
					const {width, height} = particleDefs[particle.kind];
					context.translate(particle.x, particle.y);
					context.scale(particle.scale, particle.scale);
					context.rotate((particle.r / 360) * Math.PI * 2);

					context.drawImage(
						particleSvgs[particle.kind],
						-(width * particle.scale / 2),
						-(height * particle.scale / 2),
					);

					context.restore();
				}
			}
		}

		requestAnimationFrame(step);
	}
	render() {
		const {createParticle, canvas} = this;
		return j(Fragment, [
			j({canvas: {className: "particles", ref: canvas}}),
			...this.props.render(createParticle),
		]);
	}
};
