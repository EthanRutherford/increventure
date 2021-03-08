import {useState, useCallback} from "react";
import {game} from "../../logic/game";
import {randItem} from "../../logic/util";
import {actionKinds} from "../../logic/rpg/actions";
import {mapTarget} from "../../logic/rpg/effects";
import {itemDefs, itemIds} from "../../logic/rpg/items";
import {Button} from "../shared/button";
import styles from "../../styles/combat.css";

function ActionButton(props) {
	return (
		<Button
			padding="10px"
			width="100%"
			height="50px"
			{...props}
		/>
	);
}

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
					<ActionButton
						onClick={() => useSkill(skill)}
						disabled={game.adventurers[0].mp < skill.mpCost(game.adventurers[0])}
						key={skill.name}
					>
						{skill.name}
					</ActionButton>
				))}
				<ActionButton onClick={() => setMenuState("main")}>
					Back
				</ActionButton>
			</div>
		);
	}

	if (menuState === "items") {
		return (
			<div className={styles.actionMenu}>
				{itemIds.map((itemId) => (
					<ActionButton
						onClick={() => useItem(itemId)}
						disabled={game.adventurers[0].items[itemId] === 0}
						key={itemId}
					>
						{itemDefs[itemId].name} ({game.adventurers[0].items[itemId]})
					</ActionButton>
				))}
				<ActionButton onClick={() => setMenuState("main")}>
					Back
				</ActionButton>
			</div>
		);
	}

	return (
		<div className={styles.actionMenu}>
			<ActionButton
				onClick={attack}
				disabled={!isPlayerTurn}
			>
				Attack!
			</ActionButton>
			<ActionButton
				onClick={() => setMenuState("skill")}
				disabled={!isPlayerTurn}
			>
				Skill!
			</ActionButton>
			<ActionButton
				onClick={() => setMenuState("items")}
				disabled={!isPlayerTurn}
			>
				Item!
			</ActionButton>
			<ActionButton
				onClick={run}
				disabled={!isPlayerTurn}
			>
				Run!
			</ActionButton>
		</div>
	);
}
