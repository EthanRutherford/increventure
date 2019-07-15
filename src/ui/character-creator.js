const {useState} = require("react");
const j = require("react-jenny");
const game = require("../logic/game");
const {useSaveData} = require("../logic/save-data");
const {adventurerKinds, adventurers, createNewAdventurer} = require("../logic/rpg/beings");
const {stats} = require("../logic/rpg/class-data");
const styles = require("../styles/character-creator");

function shouldCreateFirst() {
	return game.data.adventurers[0] == null;
}

module.exports = function CharacterCreator() {
	const [name, setName] = useState("");
	const [kind, setKind] = useState(adventurerKinds[0]);
	useSaveData((data) => data.adventurers[0]);

	function create() {
		game.data.adventurers[0] = {};
		game.adventurers[0] = createNewAdventurer(
			game.data.adventurers[0],
			name,
			kind,
		);
	}

	// will check the conditions for each character unlock
	// (once those conditions actually exist, of course ;P)
	if (shouldCreateFirst()) {
		const adventurer = adventurers[kind];
		const adventurerStats = stats[kind];

		return j({div: styles.container}, [
			j({div: styles.popup}, [
				j({h2: styles.title}, "Create Adventurer"),
				j({ul: styles.list}, [
					j({li: styles.listTitle}, "Adventurers"),
					...adventurerKinds.map((kind) => j({li: 0},
						j({button: {
							className: styles.button,
							onClick: () => setKind(kind),
						}}, [
							adventurers[kind].name,
						]),
					)),
				]),
				j({div: styles.desc}, [
					j({h1: 0}, ["Class: ", adventurer.name]),
					j({div: 0}, adventurer.desc),
				]),
				j({div: styles.stats}, [
					j({div: 0}, [
						"strength: ",
						adventurerStats.str,
					]),
					j({div: 0}, [
						"dexterity: ",
						adventurerStats.dex,
					]),
					j({div: 0}, [
						"constitution: ",
						adventurerStats.con,
					]),
					j({div: 0}, [
						"intelligence: ",
						adventurerStats.int,
					]),
					j({div: 0}, [
						"wisdom: ",
						adventurerStats.wis,
					]),
					j({div: 0}, [
						"luck: ",
						adventurerStats.luck,
					]),
				]),
				j({input: {
					className: styles.nameInput,
					placeholder: "Enter name",
					onChange: (event) => setName(event.target.value),
					value: name,
				}}),
				j({button: {
					className: styles.createButton,
					onClick: create,
				}}, "Create!"),
			]),
		]);
	}

	return null;
};
