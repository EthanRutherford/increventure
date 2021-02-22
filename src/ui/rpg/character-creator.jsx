import {useState} from "react";
import {game} from "../../logic/game";
import {useWatchedValue} from "../../logic/use-watched-value";
import {adventurerKinds, adventurers, createNewAdventurer} from "../../logic/rpg/beings";
import {stats} from "../../logic/rpg/class-data";
import {CharacterHead} from "../status/character-head";
import styles from "../../styles/character-creator";

const skinColors = [
	"#ffed7c",
	"#f7d7c4",
	"#d8b094",
	"#bb9167",
	"#8e562e",
	"#613d30",
];

function CreatorPopup({which}) {
	const [name, setName] = useState("");
	const [kind, setKind] = useState(adventurerKinds[which]);
	const [skinColor, setSkinColor] = useState(skinColors[0]);

	function create() {
		game.adventurers[which] = createNewAdventurer(name, kind, game.inventory.items);
		game.adventurers[which].data.skinColor = skinColor;
	}

	const adventurer = adventurers[kind];
	const adventurerStats = stats[kind];

	return (
		<div className={styles.container}>
			<div className={styles.popup}>
				<h2 className={styles.title}>Create Adventurer</h2>
				<ul className={styles.list}>
					<li className={styles.listTitle}>Adventurers</li>
					{adventurerKinds.map((kind) => (
						<li key={kind}>
							<button
								className={styles.button}
								onClick={() => setKind(kind)}
							>
								{adventurers[kind].name}
							</button>
						</li>
					))}
				</ul>
				<div className={styles.desc}>
					<h1>Class: {adventurer.name}</h1>
					<div>{adventurer.desc}</div>
				</div>
				<div className={styles.stats}>
					<div>strength: {adventurerStats.str}</div>
					<div>dexterity: {adventurerStats.dex}</div>
					<div>constitution: {adventurerStats.con}</div>
					<div>intelligence: {adventurerStats.int}</div>
					<div>wisdom: {adventurerStats.wis}</div>
					<div>luck: {adventurerStats.luck}</div>
				</div>
				<div className={styles.preview}>
					<div className={styles.headContainer}>
						<CharacterHead adventurer={{kind, skinColor, hp: 1, maxHp: 1}} />
					</div>
					<div className={styles.skinColorButtons}>
						{skinColors.map((color) => (
							<button
								className={styles.skinColorButton}
								style={{backgroundColor: color}}
								onClick={() => setSkinColor(color)}
								key={color}
							/>
						))}
					</div>
				</div>
				<input
					className={styles.nameInput}
					placeholder="Enter name"
					onChange={(event) => setName(event.target.value)}
					value={name}
				/>
				<button
					className={styles.createButton}
					onClick={create}
				>
					Create!
				</button>
			</div>
		</div>
	);
}

export function CharacterCreator() {
	const shouldCreateFirst = useWatchedValue(() => game.adventurers[0] == null);

	if (shouldCreateFirst) {
		return <CreatorPopup which={0} />;
	}

	return null;
}
