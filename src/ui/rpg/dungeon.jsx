import React, {useState, useRef, useLayoutEffect, useCallback} from "react";
import {game} from "../../logic/game";
import {useWatchedValue} from "../../logic/use-watched-value";
import {CharacterHead} from "../status/character-head";
import Chest from "../../images/svgs/chest";
import styles from "../../styles/dungeon.css";
import {LootPopup} from "../shared/loot-popup";

function Room({dungeon, room, setTreasure}) {
	const style = {
		top: `${-room.y * 100}%`,
		left: `${room.x * 100}%`,
		borderLeftWidth: room.left ? null : "2px",
		borderRightWidth: room.right ? null : "2px",
		borderTopWidth: room.up ? null : "2px",
		borderBottomWidth: room.down ? null : "2px",
		filter: !room.visited ? "brightness(60%)" : "",
	};

	const xDiff = Math.abs(dungeon.curRoom.x - room.x);
	const yDiff = Math.abs(dungeon.curRoom.y - room.y);
	const distance = xDiff + yDiff;

	return (
		<button
			className={styles.room}
			style={style}
			onClick={() => {
				if (dungeon.encounter != null) {
					return;
				}

				if (distance === 1) {
					dungeon.goToRoom(room);
				} else if (distance === 0) {
					setTreasure(dungeon.getTreasure(room));
				}
			}}
		>
			{dungeon.curRoom === room && (
				<div className={styles.characterWrapper}>
					<CharacterHead adventurer={game.adventurers[0]} />
				</div>
			)}
			{room.hasTreasure && (
				<Chest className={styles.chest} />
			)}
			{room.hasBoss && "I has boss!"}
		</button>
	);
}

export function DungeonUI({dungeon}) {
	useWatchedValue(() => dungeon.curRoom);
	const [position, setPosition] = useState({left: "0px", top: "0px"});
	const [treasure, setTreasure] = useState(null);
	const dungeonRef = useRef();

	useLayoutEffect(() => {
		const dungeonRect = dungeonRef.current.getBoundingClientRect();
		const wrapperRect = dungeonRef.current.parentElement.getBoundingClientRect();
		setPosition({
			left: `${wrapperRect.width / 2 - dungeonRect.width / 2}px`,
			top: `${wrapperRect.height / 2 - dungeonRect.height / 2}px`,
		});

		const keyUp = (event) => {
			if (dungeon.encounter != null) {
				return;
			}

			const upKeys = new Set(["w", "ArrowUp"]);
			const leftKeys = new Set(["a", "ArrowLeft"]);
			const downKeys = new Set(["s", "ArrowDown"]);
			const rightKeys = new Set(["d", "ArrowRight"]);
			if (dungeon.curRoom.up != null && upKeys.has(event.key)) {
				dungeon.goToRoom(dungeon.curRoom.up);
			} else if (dungeon.curRoom.left != null && leftKeys.has(event.key)) {
				dungeon.goToRoom(dungeon.curRoom.left);
			} else if (dungeon.curRoom.down != null && downKeys.has(event.key)) {
				dungeon.goToRoom(dungeon.curRoom.down);
			} else if (dungeon.curRoom.right != null && rightKeys.has(event.key)) {
				dungeon.goToRoom(dungeon.curRoom.right);
			} else if (event.key === "Enter") {
				setTreasure(dungeon.getTreasure(dungeon.curRoom));
			}
		};

		document.addEventListener("keyup", keyUp);
		return () => document.removeEventListener("keyup", keyUp);
	}, []);

	const onMouseDown = useCallback(({clientX, clientY}) => {
		const initialPos = {
			left: dungeonRef.current.offsetLeft,
			top: dungeonRef.current.offsetTop,
		};
		const clickPos = {x: clientX, y: clientY};

		const mouseMove = ({clientX, clientY}) => {
			const diffX = clientX - clickPos.x;
			const diffY = clientY - clickPos.y;
			setPosition({
				left: `${initialPos.left + diffX}px`,
				top: `${initialPos.top + diffY}px`,
			});
		};

		const mouseUp = () => {
			document.removeEventListener("mousemove", mouseMove);
			document.removeEventListener("mouseup", mouseUp);
		};

		document.addEventListener("mousemove", mouseMove);
		document.addEventListener("mouseup", mouseUp);
	}, []);

	return (
		<div className={styles.wrapper} onMouseDown={onMouseDown}>
			<div className={styles.content} style={position} ref={dungeonRef}>
				{[...dungeon.visibleRooms].map((room, i) => (
					<Room dungeon={dungeon} room={room} setTreasure={setTreasure} key={i} />
				))}
			</div>
			{treasure != null && (
				<LootPopup loot={treasure} dismiss={() => setTreasure(null)} />
			)}
		</div>
	);
}
