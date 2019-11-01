export const directions = {
	left: ({x, y}) => ({x: x - 1, y}),
	right: ({x, y}) => ({x: x + 1, y}),
	up: ({x, y}) => ({x, y: y + 1}),
	down: ({x, y}) => ({x, y: y - 1}),
};

export const inverse = {
	left: "right",
	right: "left",
	up: "down",
	down: "up",
};

class Room {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.left = null;
		this.right = null;
		this.up = null;
		this.down = null;
	}
}

export class Map {
	constructor() {
		this.rooms = {};
		this.minX = Infinity;
		this.maxX = -Infinity;
		this.minY = Infinity;
		this.maxY = -Infinity;
	}
	insertNewRoom(x, y) {
		const room = new Room(x, y);

		if (this.rooms[x] == null) {
			this.rooms[x] = {};
		}

		this.rooms[x][y] = room;

		this.maxX = Math.max(this.maxX, x);
		this.minX = Math.min(this.minX, x);
		this.maxY = Math.max(this.maxY, y);
		this.minY = Math.min(this.minY, y);

		return room;
	}
	getRoom(x, y) {
		if (this.rooms[x] == null) {
			return null;
		}

		return this.rooms[x][y] || null;
	}
	getValidWalls(room) {
		const {minX, maxX} = this;
		return Object.keys(directions).filter((dir) => {
			const {x, y} = directions[dir](room);
			const canGrow = maxX - minX < 9;
			return this[dir] == null &&
				(canGrow || (x >= minX && x <= maxX)) &&
				y >= 0 && y < 10
			;
		});
	}
	toNestedArray() {
		const outer = [];
		for (let y = this.maxY; y >= this.minY; y--) {
			const inner = [];
			for (let x = this.minX; x <= this.maxX; x++) {
				inner.push(this.getRoom(x, y));
			}

			outer.push(inner);
		}

		return outer;
	}
}
