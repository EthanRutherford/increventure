import React, {useState} from "react";
import {TiledBg} from "../tiled-bg";
import {Upgrades} from "./upgrades";
import rootStyles from "../../styles/root";
import storeStyles from "../../styles/store";

import plank1 from "../../images/pngs/plank-1.png";
import plank2 from "../../images/pngs/plank-2.png";
import plank3 from "../../images/pngs/plank-3.png";
import plank4 from "../../images/pngs/plank-4.png";
import plank5 from "../../images/pngs/plank-5.png";
const tiles = [
	{url: plank1, weight: 92},
	{url: plank2, weight: 5, noFollow: new Set([plank2, plank3, plank4, plank5]), flipX: true},
	{url: plank3, weight: 1, noFollow: new Set([plank2, plank3, plank4, plank5]), flipX: true},
	{url: plank4, weight: 1, noFollow: new Set([plank2, plank3, plank4, plank5]), flipX: true},
	{url: plank5, weight: 1, noFollow: new Set([plank2, plank3, plank4, plank5]), flipX: true},
];

const selectedTab = `${storeStyles.tab} ${storeStyles.selectedTab}`;
const tabs = {
	shop: {id: "shop", name: "Shop"},
	upgrade: {id: "upgrade", name: "Upgrades"},
	dungeon: {id: "dungeon", name: "Dungeons"},
};

function renderSection(tab) {
	if (tab === tabs.shop.id) {
		return <div className={storeStyles.wip}>Coming soon</div>;
	}
	if (tab === tabs.upgrade.id) {
		return <Upgrades />;
	}
	if (tab === tabs.dungeon.id) {
		return <div className={storeStyles.wip}>Coming soon</div>;
	}

	return "you should never see this";
}

export function Store() {
	const [tab, setTab] = useState(tabs.upgrade.id);

	return (
		<div className={storeStyles.wrapper}>
			<TiledBg
				className={storeStyles.wood}
				tiles={tiles}
				width={20}
			/>
			<div className={storeStyles.content}>
				<div className={`${rootStyles.title} ${storeStyles.tabs}`}>
					{Object.values(tabs).map(({id, name}) => (
						<button
							className={tab === id ? selectedTab : storeStyles.tab}
							onClick={() => setTab(id)}
							key={id}
						>
							{name}
						</button>
					))}
				</div>
				{renderSection(tab)}
			</div>
		</div>
	);
}
