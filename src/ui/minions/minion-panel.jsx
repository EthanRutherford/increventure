import React from "react";
import {minionKinds} from "../../logic/minions";
import {TiledBg} from "../shared/tiled-bg";
import {Minion} from "./minion";
import rootStyles from "../../styles/root";
import minionStyles from "../../styles/minions";

import stone1 from "../../images/pngs/stone-1.png";
import stone2 from "../../images/pngs/stone-2.png";
import stone3 from "../../images/pngs/stone-3.png";
import stone4 from "../../images/pngs/stone-4.png";
import stone5 from "../../images/pngs/stone-5.png";

const tiles = [
	{url: stone1, weight: 20},
	{url: stone2, weight: 10, flipX: true, flipY: true, rotate: true},
	{url: stone3, weight: 10, flipX: true, flipY: true, rotate: true},
	{url: stone4, weight: 5, flipX: true, flipY: true, rotate: true},
	{url: stone5, weight: 1, flipX: true, flipY: true, rotate: true},
];

export function MinionPanel() {
	return (
		<div className={minionStyles.wrapper}>
			<TiledBg
				className={minionStyles.stone}
				tiles={tiles}
				width={13}
			/>
			<div className={minionStyles.content}>
				<div className={rootStyles.title}>Minions</div>
				{minionKinds.map((kind) => (
					<Minion kind={kind} key={kind} />
				))}
			</div>
		</div>
	);
}
