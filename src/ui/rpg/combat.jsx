import React, {useState, useLayoutEffect, useCallback, useRef} from "react";
import {encounterStates} from "../../logic/rpg/combat";
import {actionKinds} from "../../logic/rpg/actions";
import {effectKinds} from "../../logic/rpg/effects";
import {LootPopup} from "../shared/loot-popup";
import {ActionMenu} from "./action-menu";
import styles from "../../styles/combat.css";
import rootStyles from "../../styles/root.css";

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
	} else if (kind === actionKinds.run) {
		const [{target, success}] = values;
		lines.push(`${source.name} tries to run...`);
		if (success) {
			lines.push(`and gets away safely!`);
		} else {
			lines.push(`but ${target.name} stops them!`);
		}
	} else {
		lines.push(`${source.name} does nothing.`);
	}

	return lines;
}

export function CombatUI({encounter}) {
	const lineElems = useRef();
	const [isPlayerTurn, setIsPlayerTurn] = useState(true);
	const [loot, setLoot] = useState(null);
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

		if (turn === encounterStates.flee) {
			setTimeout(() => encounter.end(turn), 1000);
			return;
		}

		if (turn === encounterStates.victory) {
			setLines((lines) => [...lines, "you win!"]);
			setTimeout(() => setLoot(encounter.loot()), 1000);
			return;
		}

		if (turn === encounterStates.defeat) {
			setLines((lines) => [...lines, "you lose!"]);
			setTimeout(() => encounter.end(turn), 1000);
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
		<div className={styles.container}>
			<div className={`${rootStyles.title} ${styles.header}`} />
			<div className={styles.content}>
				<div className={styles.enemyArea}>
					<div className={styles.enemySlider}>
						<div className={styles.enemyName}>{encounter.enemy.name}</div>
						<encounter.enemy.image className={styles.enemy} />
					</div>
				</div>
				<div className={styles.infoLines} ref={lineElems}>
					{lines.map((line, index) => (
						<div className={styles.infoLine} key={index}>{line}</div>
					))}
				</div>
				<ActionMenu
					isPlayerTurn={isPlayerTurn}
					doPlayerAction={doPlayerAction}
					enemy={encounter.enemy}
				/>
			</div>
			{loot != null && (
				<LootPopup loot={loot} dismiss={() => encounter.end(encounterStates.victory)} />
			)}
		</div>
	);
}
