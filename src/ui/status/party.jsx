import React from "react";
import {game} from "../../logic/game";
import {useSaveData} from "../../logic/save-data";
import {CharacterHead} from "./character-head";
import partyStyles from "../../styles/party";

function Adventurer({which}) {
	useSaveData((data) => data.adventurers[which]);

	const adventurer = game.adventurers[which];
	if (adventurer == null) {
		return null;
	}

	const hpRatio = adventurer.hp / adventurer.maxHp;
	const mpRatio = adventurer.mp / adventurer.maxMp;

	return (
		<div className={partyStyles.character}>
			<div className={partyStyles.characterTitle}>
				<CharacterHead adventurer={adventurer} />
				{adventurer.name}
			</div>
			<div className={partyStyles.characterClass}>{adventurer.class}</div>
			<div className={partyStyles.characterDetails}>
				<div className={partyStyles.characterBar}>
					<div
						className={partyStyles.characterHp}
						style={{width: `${hpRatio * 100}%`}}
					/>
				</div>
				<div className={partyStyles.characterBar}>
					<div
						className={partyStyles.characterMp}
						style={{width: `${mpRatio * 100}%`}}
					/>
				</div>
			</div>
			<div className={partyStyles.characterLevel}>
				level {adventurer.lvl}
			</div>
		</div>
	);
}

export function Party() {
	return (
		<>
			<Adventurer which={0} />
			<Adventurer which={1} />
			<Adventurer which={2} />
			<Adventurer which={3} />
		</>
	);
}
