<template>
  <v-container>
    <v-card color="teal">
      <v-card-text>
        <v-row class="text-center">
          <v-col>
            <div>{{ toon.name }} - {{ toon.level }}</div>
            <div>{{ toon.weighted.hp }} of {{ toon.weighted.hpMax }} hp</div>
            <div>{{ toon.xp }} xp - {{ toon.points }} points</div>
            <br />
            <div>
              pacifist: <b>{{ toon.status.pacifist }}</b>
            </div>
            <div>
              defending: <b>{{ toon.status.defending }}</b>
            </div>
            <div>
              recovering: <b>{{ toon.status.recovering }}</b>
            </div>
            <div>
              sacrifice: <b>{{ toon.status.sacrifice }}</b>
            </div>
            <div>
              lust: <b>{{ toon.status.lust }}</b>
            </div>
          </v-col>
          <v-col>
            <p>
              weapon: {{ toon.equipment.weapon.name }}
              {{ toon.equipment.weapon.ap }}
            </p>
            <p>armor: {{ toon.equipment.armor }}</p>
            <p>
              inventory:
              <span v-for="item in toon.inventory" :key="item.name">{{
                item.name
              }}</span>
            </p>
            <p>{{ toon.gold }}g</p>

            <br />
            <h3>Attack Power: {{ attackPower }}</h3>
            <h3>Armor Class: {{ armorClass }}</h3>
          </v-col>

          <v-col>
            <div v-for="stat in toon.stats" :key="stat.name">
              <v-btn block @click="spendPoint(stat)"
                >{{ stat.name }} {{ stat.value }}</v-btn
              >
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <div class="text-end">
      <v-btn color="fifth" @click="retreat()" :disabled="wait">retreat</v-btn>


      <v-btn color="indigo lighten-1" @click="defend()" :disabled="wait"
        >defend</v-btn
      >
      <v-btn color="fourth" @click="attack()" :disabled="wait">attack</v-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "Toon",
  props: {
    toon: Object,
    wait: Boolean,
  },
  created() {
    this.toon.weighted.hp = this.maxHealth;
    this.toon.weighted.hpMax = this.maxHealth;
    this.toon.weighted.ac = this.armorClass;
    this.toon.weighted.ap = this.attackPower;
    this.toon.equipment.weapon = this.toon.inventory[0];

    // this.toon.stats[0].value = 99;
  },
  watch: {
    maxHealth() {
      this.toon.weighted.hp = this.maxHealth;
      this.toon.weighted.hpMax = this.maxHealth;
    },
    armorClass() {
      this.toon.weighted.ac = this.armorClass;
    },
    attackPower() {
      this.toon.weighted.ap = this.attackPower;
    },
    xp() {
      if (this.toon.xp >= this.xpSlope) {
        this.toon.level += 1;
        this.toon.points += 1;
        this.$parent.logEntry(
          `${this.toon.name} gained a <span class="blue--text fontshadow">level</span>!`
        );
        // heal player
        this.toon.hp +=
          this.$parent.getStatValueByName("willpower", this.toon.stats) + 5;
      }
    },
  },

  computed: {
    xp() {
      return this.toon.xp;
    },
    xpSlope() {
      return this.$store.getters.xpSlope;
    },
    combat() {
      return this.$store.getters.combat;
    },
    heal() {
      let relevant = this.$parent.getStatValueByName("vigor", this.toon.stats);
      let secondary = this.$parent.getStatValueByName(
        "willpower",
        this.toon.stats
      );
      let hp = this.toon.weighted.hp;
      let maxhp = this.toon.weighted.hpMax;

      let roll = this.$parent.rollDamage(relevant);
      let result = roll + Math.floor(secondary * 0.6);
      console.log(`${this.toon.name} heals for ${result}`);

      if (hp + result >= maxhp) {
        return hp + result - maxhp;
      } else {
        return result;
      }
    },
    maxHealth() {
      let relevant = this.$parent.getStatValueByName("vigor", this.toon.stats);
      let result = relevant * 5;
      return result;
    },
    armorClass() {
      let relevant = this.$parent.getStatValueByName(
        "dexterity",
        this.toon.stats
      );

      let result = Math.floor(relevant * 1.25);

      if (this.toon.equipment.armor) {
        result += this.toon.equipment.armor.ac;
      }

      return result;
    },
    attackPower() {
      let relevant = this.$parent.getStatValueByName(
        "strength",
        this.toon.stats
      );
      let secondary = this.$parent.getStatValueByName(
        "dexterity",
        this.toon.stats
      );

      let result = relevant + Math.floor(secondary / 2);
      result += Math.floor(this.toon.level * 1.5);

      return result;
    },
  },

  methods: {
    // action
    attack() {
      let weapon = this.toon.equipment.weapon;
      let ap = this.toon.weighted.ap;
      let damage = this.$parent.rollDamage(ap);
      this.toon.status.defending = false;

      console.log(`${this.toon.name} rolls ${damage} out of ${ap}`);

      // weapon
      damage += weapon.ap;
      if (weapon.maxUses) {
        this.useWeapon(weapon);
      }

      console.log(`+${weapon.ap}=${damage}`);

      // add bloodlust damage
      if (this.toon.lust) {
        damage = Math.floor(damage * 0.25);
      }

      this.$emit("action", damage);
    },
    defend() {
      this.toon.status.defending = true;
      // heal
      this.toon.weighted.hp += this.heal();

      this.$emit("action", false);
    },
    changeWeapon(weapon) {
      this.toon.equipment.weapon = weapon;
    },

    //tally
    spendPoint(stat) {
      this.toon.points -= 1;
      this.toon.stats[this.toon.stats.indexOf(stat)].value += 1;
    },
    useWeapon(weapon) {
      if (weapon.uses) {
        weapon.uses -= 1;
        this.$emit("weaponUsed");

        if (weapon.uses <= 0) {
          this.toon.inventory.splice(this.toon.inventory.indexOf(weapon), 1);
          this.toon.equipment.weapon = this.toon.inventory[0];

          this.$parent.combatLog.push(
            `${weapon.name} breaks and is destroyed!`
          );
        }
      }
    },
  },

  data: () => ({}),
};
</script>
