const {Component} = require("react");
const j = require("react-jenny");
const game = require("../logic/game");
const {adventurerKinds, adventurers, createNewAdventurer} = require("../logic/rpg/beings");
const {stats} = require("../logic/rpg/class-data");
const styles = require("../styles/character-creator");

function shouldCreateFirst() {
	return !game.data.adventurer1.created;
}

module.exports = class CharacterCreator extends Component {
	constructor(...args) {
		super(...args);
		this.state = {
			name: "",
			selected: adventurerKinds[0],
			shouldCreateFirst: shouldCreateFirst(),
			shouldCreateSecond: false,
		};

		game.watch.adventurer1.created(this, this.handleAdv1Change);
		this.create = this.create.bind(this);
	}
	handleAdv1Change() {
		const shouldCreate = shouldCreateFirst();
		if (this.state.shouldCreateFirst !== shouldCreate) {
			this.setState({
				shouldCreateFirst: shouldCreate,
				name: "",
				selected: adventurerKinds[0],
			});
		}
	}
	create() {
		game.adventurers.adventurer1 = createNewAdventurer(
			game.data.adventurer1,
			this.state.name,
			this.state.selected,
		);
	}
	render() {
		// will check the conditions for each character unlock
		// (once those conditions actually exist, of course ;P)
		if (this.state.shouldCreateFirst) {
			const adventurer = adventurers[this.state.selected];
			const adventurerStats = stats[this.state.selected];

			return j({div: styles.container}, [
				j({div: styles.popup}, [
					j({h2: styles.title}, "Create Adventurer"),
					j({ul: styles.list}, [
						j({li: styles.listTitle}, "Adventurers"),
						...adventurerKinds.map((kind) => j({li: 0},
							j({button: {
								className: styles.button,
								onClick: () => this.setState({selected: kind}),
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
						onChange: (event) => this.setState({
							name: event.target.value,
						}),
						value: this.state.name,
					}}),
					j({button: {
						className: styles.createButton,
						onClick: this.create,
					}}, "Create!"),
				]),
			]);
		}
		return null;
	}
};
