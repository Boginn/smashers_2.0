<template>
  <div>
    <v-row>
      <v-col  :style="`${logstyle}`" >
        <CombatLog :combatLog="combatLog" v-if="combat" @toggleSize='toggleLog' />
      </v-col>

      <v-col>
        <v-col v-for="m in encounter" v-bind:key="m.id">
          <Monster :monster="m" v-if="m.name" @action="monsterAction" />
          <World v-if="!combat && refresh" />
        </v-col>
      </v-col>

      <v-col>
          <Toon
            :toon="toon"
            v-if="toon.name"
            :wait="waiting"
            @weaponUsed="addWeaponUsed"
            @action="round"
          />
      </v-col>
    </v-row>

    You exchange. The economy intensifies. You travel to town. The evil power
    intensifies. You rest. The evil power intensifies. You died. The evil power
    intensifies. Your enemies are dead. Peace is restored. The evil power
    intensifies. Characters meet up at the end to defeat the evil power
    deathrattles
  </div>
</template>

<script>
import Toon from "../components/Toon.vue";
import World from "../components/World.vue";
import Monster from "../components/Monster.vue";
import CombatLog from "../components/CombatLog.vue";
import Goblin from "../data/Goblin";

export default {
  name: "Game",

  components: {
    Toon,
    World,
    Monster,
    CombatLog,
  },

  created() {
    if (!this.toon.name) {
      this.$router.push("/welcome");
    } else {
      this.nextStage();
    }
  },

  data() {
    return {
      monsterDamage: 0,
      monster: {},
      nextStep: null,
      refresh: true,
      logstyle: '',
    };
  },

  watch: {
    monsterDamage() {
      if (this.monsterDamage != 0) {
        if (this.monster.status.recovering) {
          this.defend(this.monster);
        } else if (this.monster.status.defending) {
          this.defend(this.monster);
        } else {
          this.attack(this.monsterDamage, this.monster, this.toon);
        }
      }
    },
  },

  computed: {
    //getters
    //toons
    toon() {
      return this.$store.getters.toon;
    },
    //monsters
    monsterTag() {
      return this.$store.getters.monsterTag;
    },
    goblin() {
      return this.$store.getters.goblin;
    },
    bugbear() {
      return this.$store.getters.bugbear;
    },
    //combat
    combatLog() {
      return this.$store.getters.combatLog;
    },
    encounter() {
      return this.$store.getters.encounter;
    },
    //game
    stage() {
      return this.$store.getters.stage;
    },


    //
    target() {
      this.encounter.forEach((monster) => {
        if (monster.status.targeted) {
          return monster;
        }
      });
      return this.encounter[0];
    },
    active() {
      this.encounter.forEach((monster) => {
        if (monster.status.active) {
          return monster;
        }
      });
      return this.encounter[0];
    },

    //
    waiting: {
      get: function() {
        return this.$store.getters.waiting;
      },
      set: function(value) {
        this.$store.commit("wait", value);
      },
    },
    //
    combat: {
      get: function() {
        console.log(`combat ${this.$store.getters.combat}`);
        return this.$store.getters.combat;
      },
      set: function(value) {
        this.$store.commit("toggleCombat", value);
      },
    },
  },

  methods: {
    nextStage() {
      // init
      console.log(this.stage);
      this.$store.dispatch("stage");
      console.log(this.stage);

      this.combat = true;
      // this.combatLog = [];

      /*
      // voice line
      this.combatLog.push(
        `<span class="yellow--text fontshadow"><b>${this.toon.name}</b> says: ` +
          this.toon.lines[0] +
          "</span>"
      );


      // heal player
      if (this.toon.hp + this.toon.vigor * 1 > this.toon.vigor * 10) {
        this.toon.hp = this.toon.vigor * 10;
      } else {
        this.toon.hp += this.toon.vigor * 1;
      }
        */

      // seed an encounter based on stage
      this.curation();
    },
    //seed
    tagMonster(monster) {
      let newMonster = new Object();
      newMonster = Object.assign({}, monster);

      // assign unique id
      this.$store.commit("monsterTag");
      var tagOn = {
        id: this.monsterTag,
      };
      newMonster = Object.assign(newMonster, tagOn);

      return newMonster;
    },
    seedEncounter(howMany, monster) {
      let encounter = [];
      for (let i = 0; i < howMany; i++) {
        encounter.push(monster);
      }
      this.$store.commit("seed", encounter);
    },

    curation() {
      if (this.stage == 1) {
        // two goblin

        this.seedEncounter(1, this.tagMonster(new Goblin(this.stage)));
        this.seedEncounter(1, this.tagMonster(new Goblin(this.stage)));
      } else if (this.stage < 4) {
        // three goblins
        this.seedEncounter(3, this.tagMonster(this.goblin));
      } else if (this.stage < 6) {
        if (this.rollDamage(20) < 15) {
          // one goblin, one bugbear
          this.seedEncounter(1, this.tagMonster(this.goblin));
          this.seedEncounter(1, this.tagMonster(this.bugbear));
        } else {
          this.seedEncounter(2, this.tagMonster(this.goblin));
          this.seedEncounter(1, this.tagMonster(this.bugbear));
        }
      } else if (this.stage < 8) {
        if (this.rollDamage(20) < 15) {
          this.seedEncounter(2, this.tagMonster(this.goblin));
          this.seedEncounter(1, this.tagMonster(this.bugbear));
        } else {
          this.seedEncounter(1, this.tagMonster(this.goblin));
          this.seedEncounter(2, this.tagMonster(this.bugbear));
        }
      } else {
        if (this.rollDamage(20) < 15) {
          this.seedEncounter(1, this.tagMonster(this.bugbear));
          this.seedEncounter(1, this.tagMonster(this.ogre));
        } else {
          this.seedEncounter(1, this.tagMonster(this.ogre));
        }
      }
    },

    //descriptions, world
    makeentry() {
      this.logEntry(".");
    },
    logEntry(html) {
      this.$store.commit("logEntry", html);
    },
    fresh() {
      this.refresh = !this.refresh;
      setTimeout(() => {
        this.refresh = !this.refresh;
      }, 100);
    },
    dots(html) {
      setTimeout(() => {
        this.logEntry(".");
        setTimeout(() => {
          this.logEntry("..");
          setTimeout(() => {
            this.logEntry("...");
            setTimeout(() => {
              this.logEntry("....");
              setTimeout(() => {
                this.logEntry(".....");
                setTimeout(() => {
                  this.logEntry(html);
                }, 250);
              }, 250);
            }, 250);
          }, 250);
        }, 250);
      }, 250);
    },

    //tally
    addGoldSpent(g) {
      this.$store.commit("spentGold", g);
    },
    addWeaponUsed() {
      this.$store.commit("usedWeapon");
    },

    //helpers
    getStatValueByName(string, stats) {
      let result;
      stats.forEach((stat) => {
        if (stat.name == string) {
          result = stat.value;
        }
      });
      return result;
    },
    roll(int) {
      return Math.floor(Math.random() * Math.floor(int));
    },
    rollDamage(int) {
      let r = this.roll(int);
      if (r < int * 0.5) {
        r = Math.floor(int / 2);
      }
      // lowest roll is half of ap
      return r;
    },

    percent(percent, int) {
      return (int / 100) * percent;
    },
    isolateStringFromHtml(str) {
      var a = str.split(">");
      var b = a[1].split("<");
      return b[0];
    },
    toggleLog(style) {
      this.logstyle = style;
    },

    //combat
    monsterAction(damage, monster) {
      this.monsterDamage = damage;
      this.monster = monster;
      console.log(monster);
    },
    round(damage) {
      // init
      let target = this.target;
      let toon = this.toon;
      let timeout = 500;

      this.waiting = true;

      console.log(target);

      //player first
      if (this.toon.status.recovering) {
        this.defend(toon);
      } else if (this.toon.status.defending) {
        this.defend(toon);
      } else {
        this.attack(damage, toon, target);
      }
      // timeout for playerturn
      setTimeout(() => {
        // loop through monster turns, iterate timeout

        for (let i = 0; i < this.encounter.length; i++) {
          setTimeout(() => {
            // watcher: when active, attacks
            console.log(this.encounter[i].id);
            this.encounter[i].status.active = true;

            if (i > 0) {
              this.encounter[i - 1].status.active = false;
            }

            setTimeout(() => {
              this.encounter[i].status.active = false;
              this.monsterDamage = 0;
              // !!
            }, 1000);
          }, timeout);

          // timeout to unlock player
          let lastMonsterTurn = this.encounter.length - 1;
          setTimeout(() => {
            if (i == lastMonsterTurn) {
              this.waiting = false;
            }
          }, timeout + 1000);

          // add time for each turn
          timeout += 1000;
        } //for
      }, timeout);
    },

    attack(damage, wielder, victim) {
      if (!wielder) {
        wielder;
      }
      if (wielder.status.defending) {
        this.defend(wielder);
      }
      console.log(
        `${wielder.name} at ${victim.name}. ${damage} vs ${victim.weighted.ac} defending: ${victim.status.defending}`
      );

      damage -= victim.weighted.ac;

      if (victim.status.defending) {
        damage -= Math.floor(this.percent(25, damage));
      }

      // If damage is less than 0, make it 0
      if (damage < 0) {
        damage = 0;
      }

      console.log(`${damage} damage`);

      // Update descriptions
      damage
        ? this.logEntry(
            `<i>${wielder.name}</i> <b>attacks</b> <i>${victim.name}</i> for <span class="red--text fontshadow">${damage}</span>`
          )
        : this.logEntry(
            `<i>${wielder.name}</i> <b>misses</b> <i>${victim.name}</i> and deals <b>no</b> damage!`
          );

      // If hp is less than 0, make it 0
      if (victim.weighted.hp - damage <= 0) {
        victim.weighted.hp = 0;
        this.hollow(victim);
      } else {
        victim.weighted.hp -= damage;
      }
    },
    defend(wielder) {
      console.log(`${wielder.name} defends`);

      // Update descriptions
      this.logEntry(`<i>${wielder.name}</i> <b>defends</b>`);
    },

    hollow(victim) {
      this.logEntry(
        `${victim.name} is <span class="red--text fontshadow">dead</span>!`
      );
      this.encounter.splice(this.encounter.indexOf(victim), 1);

      // autotarget
      if (this.encounter.length) {
        this.encounter[0].status.target = true;
      }

      // reward
      this.toon.xp += this.rollDamage(
        this.getStatValueByName("willpower", this.toon.stats)
      );
      this.toon.xp += victim.xp;
      let rollGold = this.rollDamage(victim.gold);
      this.toon.gold += rollGold;
      this.logEntry(
        `${this.toon.name} gained <span class="blue--text fontshadow">${victim.xp}xp</span>`
      );
      this.logEntry(
        `${this.toon.name} gained <span class="yellow--text fontshadow">${rollGold}g</span>`
      );

      this.checkWin();
    },

    checkWin() {
      if (!this.encounter.length) {
        setTimeout(() => {
          // if (this.finalBattle) {
          //   this.$emit("win", this.spentGold, this.weaponUses);
          // } else {

          // lust wears off
          this.toon.lust = false;
          this.combat = false;

          //reward
          this.toon.gold += this.stage * 50;
          this.logEntry(
            `${
              this.toon.name
            } gained <span class="yellow--text fontshadow">${this.stage *
              50}g</span>`
          );
        }, 2500);
      }
    },

    //seed
    pickOption(option) {
      // if it's an encounter
      if (option.encounter.length) {
        let encounter = [];
        if (option.logEntry) {
          this.dots(option.logEntry);
        }
        option.encounter.forEach((entry) => {
          if (entry == "goblin") {
            encounter.push(this.goblin);
          } else if (entry == "bugbear") {
            encounter.push(this.bugbear);
          } else if (entry == "west") {
            encounter.push(this.goblin);
          } else if (entry == "east") {
            encounter.push(this.bugbear);
          }
        });
        option.encounter = encounter;

        this.$store.commit("seed", option);
      }

      //Other paths
      if (option.name == "shop") {
        option.name;
      } else if (option.name == "rest") {
        option.name;
      } else if (option.name == "leave") {
        this.$store.commit("town", false);
        this.$store.commit("road", true);
        this.fresh();
      } else if (option.name == "west") {
        this.$store.commit("road", false);
        this.fresh();
      } else if (option.name == "town") {
        this.$store.commit("town", true);
        this.$store.commit("road", false);
        this.fresh();
      } else if (option.name == "east") {
        this.$store.commit("road", false);
        this.fresh();
      }
    },
  },
};
</script>
