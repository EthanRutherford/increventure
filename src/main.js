const {Component} = require("react");
const {render} = require("react-dom");
const j = require("react-jenny");
const Party = require("./ui/party");
const Particles = require("./ui/particles");
const Store = require("./ui/store");
const Minions = require("./ui/minions");
require("./styles/reset");
const styles = require("./styles/root");

class App extends Component {
	render() {
		return j([Particles, {render: (createParticle) => [
			j({div: styles.header}, "Incre-venture"),
			j([Party, {createParticle}]),
			j([Store]),
			j([Minions]),
		]}]);
	}
}

render(j(App), document.getElementById("react-root"));
