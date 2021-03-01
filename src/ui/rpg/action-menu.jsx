import {useState, useCallback} from "react";
import {game} from "../../logic/game";
import {randItem} from "../../logic/util";
import {actionKinds} from "../../logic/rpg/actions";
import {mapTarget} from "../../logic/rpg/effects";
import {itemDefs, itemIds} from "../../logic/rpg/items";
import styles from "../../styles/combat.css";

export function ActionMenu({isPlayerTurn, doPlayerAction, enemy}) {
	const [menuState, setMenuState] = useState("main");

	const attack = useCallback(() => {
		doPlayerAction({kind: actionKinds.attack, targets: [enemy]});
	}, []);
	const useSkill = useCallback((skill) => {
		const {options, all} = mapTarget(skill.target, game.adventurers[0], [], [enemy]);
		const targets = all ? options : [randItem(options)];
		doPlayerAction({kind: actionKinds.skill, skill, targets});
		setMenuState("main");
	}, []);
	const useItem = useCallback((itemId) => {
		const {options, all} = mapTarget(itemDefs[itemId].target, game.adventurers[0], []);
		const targets = all ? options : [randItem(options)];
		doPlayerAction({kind: actionKinds.item, itemId, targets});
		setMenuState("main");
	}, []);
	const run = useCallback(() => {
		doPlayerAction({kind: actionKinds.run, targets: [enemy]});
	}, []);

	if (menuState === "skill") {
		return (
			<div className={styles.actionMenu}>
				{game.adventurers[0].skills.map((skill) => (
					<button
						className={styles.button}
						onClick={() => useSkill(skill)}
						disabled={game.adventurers[0].mp < skill.mpCost(game.adventurers[0])}
						key={skill.name}
					>
						{skill.name}
					</button>
				))}
				<button className={styles.button} onClick={() => setMenuState("main")}>
					Back
				</button>
			</div>
		);
	}

	if (menuState === "items") {
		return (
			<div className={styles.actionMenu}>
				{itemIds.map((itemId) => (
					<button
						className={styles.button}
						onClick={() => useItem(itemId)}
						disabled={game.adventurers[0].items[itemId] === 0}
						key={itemId}
					>
						{itemDefs[itemId].name} ({game.adventurers[0].items[itemId]})
					</button>
				))}
				<button className={styles.button} onClick={() => setMenuState("main")}>
					Back
				</button>
			</div>
		);
	}

	return (
		<div className={styles.actionMenu}>
			<button
				className={styles.button}
				onClick={attack}
				disabled={!isPlayerTurn}
			>
				Attack!
			</button>
			<button
				className={styles.button}
				onClick={() => setMenuState("skill")}
				disabled={!isPlayerTurn}
			>
				Skill!
			</button>
			<button
				className={styles.button}
				onClick={() => setMenuState("items")}
				disabled={!isPlayerTurn}
			>
				Item!
			</button>
			<button
				className={styles.button}
				onClick={run}
				disabled={!isPlayerTurn}
			>
				Run!
			</button>
		</div>
	);
}
