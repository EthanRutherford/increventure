import {useState} from "react";
import j from "react-jenny";
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
	{url: plank2, weight: 5, noFollow: new Set([plank2, plank3, plank4, plank5])},
	{url: plank3, weight: 1, noFollow: new Set([plank2, plank3, plank4, plank5])},
	{url: plank4, weight: 1, noFollow: new Set([plank2, plank3, plank4, plank5])},
	{url: plank5, weight: 1, noFollow: new Set([plank2, plank3, plank4, plank5])},
];

const selectedTab = `${storeStyles.tab} ${storeStyles.selectedTab}`;
const tabs = {
	shop: {id: "shop", name: "Shop"},
	upgrade: {id: "upgrade", name: "Upgrades"},
	dungeon: {id: "dungeon", name: "Dungeons"},
};

function renderSection(tab) {
	if (tab === tabs.shop.id) {
		return j({div: storeStyles.wip}, "Coming soon");
	}
	if (tab === tabs.upgrade.id) {
		return j([Upgrades]);
	}
	if (tab === tabs.dungeon.id) {
		return j({div: storeStyles.wip}, "Coming soon");
	}

	return "you should never see this";
}

export function Store() {
	const [tab, setTab] = useState(tabs.upgrade.id);

	return j({div: storeStyles.wrapper}, [
		j([TiledBg, {
			className: storeStyles.wood,
			tiles,
			width: 20,
			tileSize: 16,
		}]),
		j({div: storeStyles.content}, [
			j({div: `${rootStyles.title} ${storeStyles.tabs}`},
				Object.values(tabs).map(({id, name}) =>
					j({button: {
						className: tab === id ? selectedTab : storeStyles.tab,
						onClick: () => setTab(id),
					}}, name),
				),
			),
			renderSection(tab),
		]),
	]);
}
