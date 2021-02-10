import React, {useState, useLayoutEffect, useCallback, useRef, useMemo} from "react";
import {game} from "../../logic/game";
import {randItem} from "../../logic/util";
import {encounterStates} from "../../logic/rpg/combat";
import {actionKinds} from "../../logic/rpg/actions";
import {effectKinds, mapTarget} from "../../logic/rpg/effects";
import {items} from "../../logic/rpg/items";
import styles from "../../styles/combat.css";

function parseResult(result) {
	const {source, kind, values} = result;
	const lines = [];

	if (kind === actionKinds.attack) {
		const prefix = `${source.name} attacks`;
		for (const {target, dodged, damage} of values) {
			if (dodged) {
				lines.push(`${prefix}, but ${target.name} dodges!`);
				continue;
			}

			lines.push(`${prefix} ${target.name} for ${damage} damage!`);
		}
	} else if (kind === actionKinds.skill) {
		const skill = result.skill;
		lines.push(`${source.name} used ${skill.name}!`);

		if (skill.kind === effectKinds.damage) {
			for (const {target, dodged, damage} of values) {
				if (dodged) {
					lines.push(`${target.name} avoids the attack!`);
					continue;
				}

				lines.push(`${target.name} takes ${damage} damage!`);
			}
		} else if (skill.kind === effectKinds.restore) {
			for (const {target, stat, amount} of values) {
				lines.push(`${target.name} restored ${amount} ${stat}.`);
			}
		} else if (skill.kind === effectKinds.buff) {
			for (const {target, stat, amount} of values) {
				lines.push(`${target.name}'s ${stat} raised by ${amount}.`);
			}
		} else if (skill.kind === effectKinds.debuff) {
			for (const {target, stat, amount} of values) {
				lines.push(`${target.name}'s ${stat} reduced by ${amount}.`);
			}
		}
	} else if (kind === actionKinds.item) {
		const item = result.item;
		lines.push(`${source.name} used a(n) ${item.name}!`);

		if (item.kind === effectKinds.restore) {
			for (const {target, stat, amount} of values) {
				lines.push(`${target.name} restored ${amount} ${stat}.`);
			}
		} else if (item.kind === effectKinds.buff) {
			for (const {target, stat, amount} of values) {
				lines.push(`${target.name}'s ${stat} raised by ${amount}.`);
			}
		}
	} else {
		lines.push(`${source.name} does nothing.`);
	}

	return lines;
}

function ActionMenu({doPlayerAction, enemy}) {
	const usableSkills = useMemo(() => game.adventurers[0].skills.filter((skill) =>
		skill.mpCost(game.adventurers[0]) <= game.adventurers[0].mp,
	), [game.adventurers[0].mp]);
	const usableItems = Object.entries(game.adventurers[0].items).filter(([, count]) =>
		count !== 0,
	);

	const attack = useCallback(() => {
		doPlayerAction({kind: actionKinds.attack, targets: [enemy]});
	}, []);
	const useSkill = useCallback(() => {
		const skill = randItem(usableSkills);
		const {options, all} = mapTarget(skill.target, game.adventurers[0], [], [enemy]);
		const targets = all ? options : [randItem(options)];
		doPlayerAction({kind: actionKinds.skill, skill, targets});
	}, [usableSkills]);
	const useItem = useCallback(() => {
		const [itemId] = randItem(usableItems);
		const {options, all} = mapTarget(items[itemId].target, game.adventurers[0], []);
		const targets = all ? options : [randItem(options)];
		doPlayerAction({kind: actionKinds.item, itemId, targets});
	}, []);

	return (
		<div className={styles.actionMenu}>
			<button
				className={styles.action}
				onClick={attack}
			>
				Attack!
			</button>
			<button
				className={styles.action}
				onClick={useSkill}
				disabled={usableSkills.length === 0}
			>
				Skill!
			</button>
			<button
				className={styles.action}
				onClick={useItem}
				disabled={usableItems.length === 0}
			>
				Item!
			</button>
			<button className={styles.action} disabled>Run!</button>
		</div>
	);
}

export function CombatUI({encounter}) {
	const lineElems = useRef();
	const [isPlayerTurn, setIsPlayerTurn] = useState(true);
	const [lines, setLines] = useState(() => [
		`${encounter.enemy.name} the ${encounter.enemy.data.kind} appears!`,
		`${encounter.enemy.name} quivers gelatinously.`,
	]);

	useLayoutEffect(() => {
		lineElems.current.scrollTop = lineElems.current.scrollHeight;
	});

	const advance = useCallback(() => {
		const turn = encounter.advanceTurn();
		setIsPlayerTurn(turn === encounterStates.playerTurn);

		if (turn === encounterStates.victory) {
			// temporary
			setLines((lines) => [...lines, "you win!"]);
			setTimeout(encounter.onVictory, 1000);
			return;
		}

		if (turn === encounterStates.defeat) {
			// temporary
			setLines((lines) => [...lines, "you win!"]);
			setTimeout(encounter.onDefeat, 1000);
			return;
		}

		if (turn === encounterStates.enemyTurn) {
			setTimeout(() => {
				const nextLines = parseResult(encounter.enemyTurn());
				setLines((lines) => [...lines, ...nextLines]);
				setTimeout(advance, 1000);
			}, 1000);
		}
	}, []);

	const doPlayerAction = useCallback((action) => {
		const nextLines = parseResult(encounter.playerTurn(action));
		setLines((lines) => [...lines, ...nextLines]);
		advance();
	}, []);

	return (
		<div className={styles.content}>
			<div className={styles.infoLines} ref={lineElems}>
				{lines.map((line) => (
					<div className={styles.infoLine} key={line}>{line}</div>
				))}
			</div>
			{isPlayerTurn && (
				<ActionMenu
					doPlayerAction={doPlayerAction}
					enemy={encounter.enemy}
				/>
			)}
		</div>
	);
}
