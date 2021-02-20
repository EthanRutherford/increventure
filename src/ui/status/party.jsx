import React from "react";
import {game} from "../../logic/game";
import {useWatchedValue} from "../../logic/use-watched-value";
import {CharacterHead} from "./character-head";
import partyStyles from "../../styles/party";

function Adventurer({which}) {
	const isOpen = useWatchedValue(() => game.dungeon != null);
	const adventurer = useWatchedValue(() => game.adventurers[which], () => [
		game.adventurers[which].hp,
		game.adventurers[which].maxHp,
		game.adventurers[which].mp,
		game.adventurers[which].maxMp,
		game.adventurers[which].lvl,
	]);

	const hpRatio = adventurer.hp / adventurer.maxHp;
	const mpRatio = adventurer.mp / adventurer.maxMp;

	return (
		<div className={`${partyStyles.character} ${isOpen ? partyStyles.open : ""}`}>
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
	const show1 = useWatchedValue(() => game.adventurers[0] != null);
	const show2 = useWatchedValue(() => game.adventurers[1] != null);
	const show3 = useWatchedValue(() => game.adventurers[2] != null);
	const show4 = useWatchedValue(() => game.adventurers[3] != null);

	return (
		<>
			{show1 && <Adventurer which={0} />}
			{show2 && <Adventurer which={1} />}
			{show3 && <Adventurer which={2} />}
			{show4 && <Adventurer which={3} />}
		</>
	);
}
