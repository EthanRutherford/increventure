import {render} from "react-dom";
import j from "react-jenny";
import {Party} from "./ui/party";
import {Particles} from "./ui/particles";
import {Store} from "./ui/store";
import {Minions} from "./ui/minions";
import {CharacterCreator} from "./ui/character-creator";
import {Overlay} from "./ui/overlay";
import styles from "./styles/root";
import "./logic/game-loop";
import "./styles/reset";

function App() {
	return j([Particles, {render: (createParticle) => [
		j({div: styles.header}, "Incre-venture"),
		j([Party, {createParticle}]),
		j([Store]),
		j([Minions]),
		j([CharacterCreator]),
		j([Overlay]),
	]}]);
}

render(j(App), document.getElementById("react-root"));
