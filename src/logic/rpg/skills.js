module.exports = {
	hero: [
		{
			lvl: 1,
			name: "Heroic effort",
			desc: "Damages one enemy using everything you've got",
			target: "enemy",
			mpCost: (hero) => 10,
			effect(hero) {
				const data = hero.data;
				const multiplier = data.str + data.dex +
					data.con + data.int * data.wis
				;
				return {
					kind: "damage",
					damage: multiplier * hero.lvl,
				};
			},
		},
	],
	warrior: [
		{
			lvl: 1,
			name: "Rage",
			target: "self",
			mpCost: (hero) => 10,
			effect(hero) {
				return {
					kind: "buff",
					stat: "str",
					amount: hero.con,
					turns: 3,
				};
			},
		},
	],
};
