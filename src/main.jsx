import {render} from "react-dom";
import {useState, useCallback} from "react";
import {Header} from "./ui/shared/header";
import {Particles} from "./ui/shared/particles";
import {ToastManager} from "./ui/shared/toast-manager";
import {StatusPanel} from "./ui/status/status-panel";
import {Overlay} from "./ui/shared/overlay";
import {StorePanel} from "./ui/middle/store-panel";
import {StatsPanel} from "./ui/middle/stats-panel";
import {OptionsPanel} from "./ui/middle/options-panel";
import {MinionPanel} from "./ui/minions/minion-panel";
import {CharacterCreator} from "./ui/rpg/character-creator";
import styles from "./styles/root";
import "./logic/game-loop";
import "./util/global-handlers";
import "./styles/reset";

function renderMiddlePanel(middle, close) {
	if (middle === "stats") {
		return <StatsPanel close={close} />;
	}

	if (middle === "options") {
		return <OptionsPanel close={close} />;
	}

	return <StorePanel />;
}

function App() {
	const [middle, setMiddle] = useState();
	const close = useCallback(() => setMiddle(), []);

	return (
		<Particles
			render={(createParticle) => (
				<>
					<Header setMiddle={setMiddle} />
					<StatusPanel createParticle={createParticle} />
					<div className={styles.divider1} />
					{renderMiddlePanel(middle, close)}
					<div className={styles.divider2} />
					<MinionPanel />
					<CharacterCreator />
					<Overlay />
					<ToastManager />
				</>
			)}
		/>
	);
}

render(<App />, document.getElementById("react-root"));
