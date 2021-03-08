import {useState} from "react";
import {game} from "../../logic/game";
import {useWatchedValue} from "../../logic/use-watched-value";
import {statDefs, adventurerDefs, adventurerKinds} from "../../logic/classes/classes";
import {createNewAdventurer} from "../../logic/rpg/beings";
import {CharacterHead} from "../status/character-head";
import {Button} from "../shared/button";
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
		game.adventurers[which] = createNewAdventurer(name, kind, skinColor, game.inventory.items);
	}

	const def = adventurerDefs[kind];
	return (
		<div className={styles.container}>
			<div className={styles.popup}>
				<h2 className={styles.title}>Create Adventurer</h2>
				<ul className={styles.list}>
					<li className={styles.listTitle}>Adventurers</li>
					{adventurerKinds.map((kind) => (
						<li key={kind}>
							<Button width="100%" height="50px" onClick={() => setKind(kind)}>
								{def.name}
							</Button>
						</li>
					))}
				</ul>
				<div className={styles.desc}>
					<h1>Class: {def.name}</h1>
					<div>{def.desc}</div>
				</div>
				<div className={styles.stats}>
					{Object.entries(statDefs).map(([key, stat]) => (
						<div key={key}>{stat.name}: {def.baseStats[key]}</div>
					))}
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
				<Button
					className={styles.createButton}
					borderColor="olive-pale"
					baseColor="olive"
					onClick={create}
				>
					Create!
				</Button>
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
