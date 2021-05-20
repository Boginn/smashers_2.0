import Monster from "./Monster.js";

export default class Ogre extends Monster {
  name = "Ogre";
  level = 6;
  xp = 60;
  gold = 150;

  background =
            "background: linear-gradient(90deg, rgba(29, 37, 2, 0.95) 0%, rgba(102, 139, 31, 0.95) 33%, rgba(121, 63, 9, 0.95) 80%)";


  stats = [
    { name: "strength", value: 18},
    { name: "dexterity", value: 12},
    { name: "willpower", value: 12},
    { name: "vigor", value: 14},
  ];

  constructor(
    level,

  ) {
    super();

    this.level = level;
  }
}
