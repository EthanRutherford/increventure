import {useState} from "react";
import j from "react-jenny";
import {Upgrades} from "./upgrades";
import rootStyles from "../../styles/root";
import storeStyles from "../../styles/store";
const selectedTab = `${storeStyles.tab} ${storeStyles.selectedTab}`;

const tabs = {
	shop: {id: "shop", name: "Shop"},
	upgrade: {id: "upgrade", name: "Upgrades"},
	dungeon: {id: "dungeon", name: "Dungeons"},
};

function renderSection(tab) {
	if (tab === tabs.shop.id) {
		return j({div: storeStyles.wip}, "WIP");
	}
	if (tab === tabs.upgrade.id) {
		return j([Upgrades]);
	}
	if (tab === tabs.dungeon.id) {
		return j({div: storeStyles.wip}, "WIP");
	}

	return "you should never see this";
}

export function Store() {
	const [tab, setTab] = useState(tabs.upgrade.id);

	return j({div: storeStyles.content}, [
		j({div: `${rootStyles.title} ${storeStyles.tabs}`},
			Object.values(tabs).map(({id, name}) =>
				j({button: {
					className: tab === id ? selectedTab : storeStyles.tab,
					onClick: () => setTab(id),
				}}, name),
			),
		),
		renderSection(tab),
	]);
}
