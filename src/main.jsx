import {render} from "react-dom";
import React, {useState, useCallback} from "react";
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
		return <Stats close={close} />;
	}
	if (middle === "options") {
		return <Options close={close} />;
	}

	return null;
}

function App() {
	const [middle, setMiddle] = useState();
	const close = useCallback(() => setMiddle(), []);

	return (
		<Particles
			render={(createParticle) => (
				<>
					<Header setMiddle={setMiddle} />
					<Party createParticle={createParticle} />
					<div className={styles.divider1} />
					<Store />
					{renderMiddle(middle, close)}
					<div className={styles.divider2} />
					<Minions />
					<CharacterCreator />
					<Overlay />
					<ToastManager />
				</>
			)}
		/>
	);
}

render(<App />, document.getElementById("react-root"));
