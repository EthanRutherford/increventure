const j = require("react-jenny");
const game = require("../logic/game");
const CombatUI = require("./combat");
const styles = require("../styles/overlay.css");

function renderOverlay(children) {
	return j({div: styles.content}, j({div: styles.overlay}, children));
}

module.exports = function Overlay() {
	game.useEncounter();

	if (game.encounter != null) {
		return renderOverlay(
			j([CombatUI, {encounter: game.encounter}]),
		);
	}

	return null;
};
