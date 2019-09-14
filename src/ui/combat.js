const {
	useState,
	useLayoutEffect,
	useCallback,
	useRef,
	useMemo,
} = require("react");
const j = require("react-jenny");
const Encounter = require("../logic/rpg/combat");
const styles = require("../styles/combat.css");

module.exports = function CombatUI() {
	const encounter = useMemo(() => new Encounter(), []);
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
		setIsPlayerTurn(turn === "player");

		if (turn === "enemy") {
			setTimeout(() => {
				const nextLine = encounter.enemyTurn();
				setLines((lines) => [...lines, nextLine]);
				setTimeout(advance, 1000);
			}, 1000);
		}
	});

	const attack = useCallback(() => {
		const nextLine = encounter.playerTurn();
		setLines((lines) => [...lines, nextLine]);
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
};
