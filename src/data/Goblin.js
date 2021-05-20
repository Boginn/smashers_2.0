import Monster from "./Monster.js";

export default class Goblin extends Monster {
  name = "Goblin";
  level = 1;
  xp = 20;
  gold = 50;

  background = "background: linear-gradient(90deg, rgba(2,0,36,0.95) 0%, rgba(8, 21, 63, 0.95) 24%, rgba(9, 20, 121, 0.95) 66%)";


  stats = [
    { name: "strength", value: 14},
    { name: "dexterity", value: 10},
    { name: "willpower", value: 4},
    { name: "vigor", value: 12},
  ];

  constructor(
    level,

  ) {
    super();

    this.level = level;
  }
}
