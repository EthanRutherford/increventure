import React, {useMemo} from "react";
import styles from "../styles/dungeon.css";

// temporarily testing all of the testable testinators
import {generate} from "../logic/dungeons/generate";

function Room({room}) {
	if (room == null) {
		return <div className={styles.empty} />;
	}

	const style = {
		borderLeftWidth: room.left ? null : "2px",
		borderRightWidth: room.right ? null : "2px",
		borderTopWidth: room.up ? null : "2px",
		borderBottomWidth: room.down ? null : "2px",
	};

	return <div className={styles.room} style={style} />;
}

export function DungeonUI() {
	const map = useMemo(() => generate(20), []);
	const rows = map.toNestedArray();

	return (
		<div className={styles.content}>
			{rows.map((row, i) => (
				<div className={styles.row} key={i}>
					{row.map((room, j) => <Room room={room} key={j} />)}
				</div>
			))}
		</div>
	);
}
