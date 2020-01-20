import {useState} from "react";
import j from "react-jenny";
import {game} from "../logic/game";
import {useDerivedData} from "../logic/save-data";
import {adventurerKinds, adventurers, createNewAdventurer} from "../logic/rpg/beings";
import {stats} from "../logic/rpg/class-data";
import styles from "../styles/character-creator";

function CreatorPopup({which}) {
	const [name, setName] = useState("");
	const [kind, setKind] = useState(adventurerKinds[which]);

	function create() {
		game.adventurers[which] = createNewAdventurer(name, kind, game.data.inventory.items);
		game.data.adventurers[which] = game.adventurers[which].data;
	}

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

export function CharacterCreator() {
	const shouldCreateFirst = useDerivedData(
		(data) => data.adventurers[0],
		() => game.data.adventurers[0] == null,
	);

	if (shouldCreateFirst) {
		return j([CreatorPopup, {which: 0}]);
	}

	return null;
}
