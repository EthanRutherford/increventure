const {
	useState,
	useLayoutEffect,
	useCallback,
	useRef,
	useMemo,
} = require("react");
const j = require("react-jenny");
const game = require("../logic/game");
const {encounterStates} = require("../logic/rpg/combat");
const styles = require("../styles/combat.css");

const dodgeText = (name) => `, but ${name} dodged the attack!`;
function parseAction(action) {
	const {source, target, type} = action;

	if (type === "attack") {
		const prefix = `${source.name} attacks`;
		if (action.dodged) {
			return prefix + dodgeText(target.name);
		}

		return `${prefix} ${target.name} for ${action.damage} damage!`;
	}

	if (type === "skill") {
		const skill = action.skill;
		const prefix = `${source.name} used ${skill.name}`;
		if (action.dodged) {
			return prefix + dodgeText(target.name);
		}

		return `${prefix} on ${target.name} for ${action.damage} damage!`;
	}

	return `${source.name} does nothing.`;
}

function CombatUI({encounter}) {
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
				const nextLine = parseAction(encounter.enemyTurn());
				setLines((lines) => [...lines, nextLine]);
				setTimeout(advance, 1000);
			}, 1000);
		}
	});

	const attack = useCallback(() => {
		const nextLine = parseAction(encounter.playerTurn());
		setLines((lines) => [...lines, nextLine]);
		advance();
	});

	return j({div: styles.container}, j({div: styles.content}, [
		j({div: {className: styles.infoLines, ref: lineElems}},
			lines.map((line) => j({div: styles.infoLine}, line)),
		),
		isPlayerTurn && j({button: {
			className: styles.action,
			onClick: attack,
		}}, "Attack!"),
	]));
}

module.exports = function Combat() {
	game.useEncounter();

	if (game.encounter == null) {
		return null;
	}

	return j([CombatUI, {encounter: game.encounter}]);
};
