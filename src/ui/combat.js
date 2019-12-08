import {useState, useLayoutEffect, useCallback, useRef} from "react";
import j from "react-jenny";
import {encounterStates} from "../logic/rpg/combat";
import {actionKinds, skillKinds} from "../logic/rpg/actions";
import styles from "../styles/combat.css";

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

		if (skill.kind === skillKinds.damage) {
			for (const {target, dodged, damage} of values) {
				if (dodged) {
					lines.push(`${target.name} avoids the attack!`);
					continue;
				}

				lines.push(`${target.name} takes ${damage} damage!`);
			}
		} else if (skill.kind === skillKinds.restore) {
			for (const {target, stat, amount} of values) {
				lines.push(`${target.name} restoring ${amount} ${stat}.`);
			}
		} else if (skill.kind === skillKinds.buff) {
			for (const {target, stat, amount} of values) {
				const effect = amount > 0 ? "increased" : "reduced";
				lines.push(`${target.name}'s ${stat} is temporarily ${effect}.`);
			}
		}
	} else {
		lines.push(`${source.name} does nothing.`);
	}

	return lines;
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
	});

	const attack = useCallback(() => {
		const nextLines = parseResult(encounter.playerTurn());
		setLines((lines) => [...lines, ...nextLines]);
		advance();
	});

	return j({div: styles.content}, [
		j({div: {className: styles.infoLines, ref: lineElems}},
			lines.map((line) => j({div: styles.infoLine}, line)),
		),
		isPlayerTurn && j({button: {
			className: styles.action,
			onClick: attack,
		}}, "Attack!"),
	]);
}
