export default class Monster {


  id = Number;
  name = String;
  level = Number;
  xp = Number;
  gold = Number;

  background = String;

  weighted = {
    hpMax: null,
    hp: null,
    ac: null,
    ap: null,
  };

  status = {
    defending: false,
    recovering: false,
    active: false,
    targeted: false,
  };

  stats = [
    { name: "strength", value: Number},
    { name: "dexterity", value: Number},
    { name: "willpower", value: Number},
    { name: "vigor", value: Number},
  ];

}
