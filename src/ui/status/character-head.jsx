import React, {useState, useCallback, useRef, useEffect} from "react";
import {randRange} from "../../logic/util";
import Happy from "../../images/svgs/happy";
import Meh from "../../images/svgs/meh";
import Bad from "../../images/svgs/bad";
import Dead from "../../images/svgs/dead";
import HeroHat from "../../images/svgs/hero-hat";
import WarriorHat from "../../images/svgs/warrior-hat";
import WizardHat from "../../images/svgs/wizard-hat";
import ClericHat from "../../images/svgs/cleric-hat";
import partyStyles from "../../styles/party";

const hatMap = {
	hero: <HeroHat className={partyStyles.heroHat} />,
	warrior: <WarriorHat className={partyStyles.hat} />,
	wizard: <WizardHat className={partyStyles.wizardHat} />,
	cleric: <ClericHat className={partyStyles.hat} />,
};

export function CharacterHead({adventurer}) {
	const [bounceBack, setBounceBack] = useState(false);
	const timeout = useRef(null);
	const animate = useCallback(() => {
		timeout.current = null;
		if (adventurer.hp > 0) {
			setBounceBack((x) => !x);
		} else {
			handleAnimationEnd();
		}
	}, []);

	const handleAnimationEnd = useCallback(() => {
		if (timeout.current) return;
		timeout.current = setTimeout(animate, randRange(0, 2000));
	}, []);

	useEffect(() => () => clearTimeout(timeout.current), []);

	const hpRatio = adventurer.hp / adventurer.maxHp;
	const Face = hpRatio > 2 / 3 ? Happy :
		hpRatio > 1 / 3 ? Meh :
			hpRatio > 0 ? Bad :
				Dead
	;

	return (
		<div
			className={`${partyStyles.characterHead} ${bounceBack ? partyStyles.bounceBack : ""}`}
			style={{color: adventurer.skinColor}}
			onAnimationEnd={handleAnimationEnd}
		>
			{hatMap[adventurer.class]}
			<Face style={{filter: `grayscale(${1 - hpRatio})`}} />
		</div>
	);
}
