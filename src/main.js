import {render} from "react-dom";
import {useState, useCallback} from "react";
import j from "react-jenny";
import {Header} from "./ui/header";
import {Party} from "./ui/party";
import {Particles} from "./ui/particles";
import {Store} from "./ui/middle/store";
import {Stats} from "./ui/middle/stats";
import {Options} from "./ui/middle/options";
import {Minions} from "./ui/minions";
import {CharacterCreator} from "./ui/character-creator";
import {Overlay} from "./ui/overlay";
import {ToastManager} from "./ui/toast-manager";
import styles from "./styles/root";
import "./logic/game-loop";
import "./ui/global-handlers";
import "./styles/reset";

function renderMiddle(middle, close) {
	if (middle === "stats") {
		return j([Stats, {close}]);
	}
	if (middle === "options") {
		return j([Options, {close}]);
	}
	return null;
}

function App() {
	const [middle, setMiddle] = useState();
	const close = useCallback(() => setMiddle(), []);

	return j([Particles, {render: (createParticle) => [
		j([Header, {setMiddle}]),
		j([Party, {createParticle}]),
		j({div: styles.divider1}),
		j([Store]),
		renderMiddle(middle, close),
		j({div: styles.divider2}),
		j([Minions]),
		j([CharacterCreator]),
		j([Overlay]),
		j([ToastManager]),
	]}]);
}

render(j(App), document.getElementById("react-root"));
