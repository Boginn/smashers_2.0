export default class Character {
  name = "";
  xp = Number;
  gold = Number;
  active = false;
  targeted = false;
  hp = null;
  ac = null;
  ap = null;
  defending = false;
  damage = null;
  strength = Number;
  dexterity = Number;
  willpower = Number;
  vigor = Number;

  constructor(
    name,
    xp,
    gold,
    strength,
    dexterity,
    willpower,
    vigor,

  ) {
    this.name = name;
    this.xp = xp;
    this.gold = gold;
    this.strength = strength;
    this.dexterity = dexterity;
    this.willpower = willpower;
    this.vigor = vigor;
  }
}
