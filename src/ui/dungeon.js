import {useMemo} from "react";
import j from "react-jenny";
import styles from "../styles/dungeon.css";

// temporarily testing all of the testable testinators
import {generate} from "../logic/dungeons/generate";

function Room({room}) {
	if (room == null) {
		return j({div: styles.empty});
	}

	const style = {
		borderLeftWidth: room.left ? null : "2px",
		borderRightWidth: room.right ? null : "2px",
		borderTopWidth: room.up ? null : "2px",
		borderBottomWidth: room.down ? null : "2px",
	};

	return j({div: {className: styles.room, style}});
}

export function DungeonUI() {
	const map = useMemo(() => generate(20), []);
	const rows = map.toNestedArray();

	return j({div: styles.content}, rows.map((row) =>
		j({div: styles.row}, row.map((room) =>
			j([Room, {room}]),
		)),
	));
}
