import Monster from "./Monster.js";

export default class Bugbear extends Monster {
  name = "Bugbear";
  level = 3;
  xp = 40;
  gold = 80;

  background =
  "background: linear-gradient(90deg, rgba(9, 12, 0, 0.95) 0%, rgba(25, 36, 5, 0.95) 24%, rgba(101, 121, 9, 0.95) 66%)";


  stats = [
    { name: "strength", value: 16},
    { name: "dexterity", value: 14},
    { name: "willpower", value: 8},
    { name: "vigor", value: 13},
  ];

  constructor(
    level,

  ) {
    super();

    this.level = level;
  }
}
