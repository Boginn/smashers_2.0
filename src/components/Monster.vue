<template>
  <v-container>
    <v-col>
      <v-card
        :style="`${monster.background}`"
        v-bind:class="{ highlight: monster.status.active }"
      >
        <v-card-text class="white--text">
          <v-row class="text-center">
            <v-col>
              <p>
                {{ monster.name }} - {{ monster.level }} | ID: {{ monster.id }}
              </p>
              <p>
                {{ monster.weighted.hp }} of {{ monster.weighted.hpMax }} hp
              </p>
              <p>{{ monster.xp }}xp</p>
              <p>{{ monster.gold }}g</p>
            </v-col>
            <v-col>
              <div v-for="stat in monster.stats" :key="stat.name">
                {{ stat.name }}: {{ stat.value }}
              </div>
              <h3>Attack Power: {{ attackPower }}</h3>
              <h3>Armor Class: {{ armorClass }}</h3>
            </v-col>
            <v-col>
              {{ monster.status }}
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-container>
</template>

<script>
export default {
  name: "Monster",
  props: {
    monster: Object,
  },

  created() {
    this.monster.weighted.hp = this.maxHealth;
    this.monster.weighted.hpMax = this.maxHealth;
    this.monster.weighted.ac = this.armorClass;
    this.monster.weighted.ap = this.attackPower;
  },

  watch: {
    maxHealth() {
      this.monster.weighted.hp = this.maxHealth;
      this.monster.weighted.hpMax = this.maxHealth;
    },
    armorClass() {
      this.monster.weighted.ac = this.armorClass;
    },
    attackPower() {
      this.monster.weighted.ap = this.attackPower;
    },
    active() {
      if (this.active) {
        this.action();
      }
    },
  },

  methods: {
    action() {
      let damage = this.rollAction();
      // damage == null means defend
      this.$emit("action", damage, this.monster);
    },

    rollAction(int) {
      let roll = this.$parent.roll(int);

      if (roll < 6) {
        return this.defend();
      } else {
        return this.attack(roll);
      }
    },

    attack(roll) {
      this.monster.status.defending = false;
      if (roll == 20) {
        console.log(`${this.monster.weighted.ap} CRIT`);
        return this.monster.weighted.ap;
      } else if (roll > 17) {
        this.monster.status.defending = false;
        console.log(`whoops!`);
        return 0;
      } else {
        let damage = this.$parent.rollDamage(this.monster.weighted.ap);
        console.log(
          `${this.monster.name} rolls ${damage} out of ${this.monster.weighted.ap}`
        );
        return damage;
      }
    },

    defend() {
      this.monster.status.defending = true;
      this.monster.weighted.hp += this.heal();
      return null;
    },
  },

  computed: {
    heal() {
      let relevant = this.$parent.getStatValueByName(
        "vigor",
        this.monster.stats
      );
      let secondary = this.$parent.getStatValueByName(
        "willpower",
        this.monster.stats
      );
      let hp = this.monster.weighted.hp;
      let maxhp = this.monster.weighted.hpMax;

      let roll = this.$parent.rollDamage(Math.floor(relevant * 0.75));
      let result = roll + Math.floor(secondary * 0.6);
      console.log(`${this.monster.name} heals for ${result}`);

      if (hp + result >= maxhp) {
        return hp + result - maxhp;
      } else {
        return result;
      }
    },
    maxHealth() {
      let relevant = this.$parent.getStatValueByName(
        "vigor",
        this.monster.stats
      );
      let result = relevant * 3;
      return result;
    },
    armorClass() {
      let relevant = this.$parent.getStatValueByName(
        "dexterity",
        this.monster.stats
      );

      let result = Math.floor(relevant * 0.8);

      return result;
    },
    attackPower() {
      let relevant = this.$parent.getStatValueByName(
        "strength",
        this.monster.stats
      );
      let secondary = this.$parent.getStatValueByName(
        "dexterity",
        this.monster.stats
      );

      let result = relevant + Math.floor(secondary / 2.5);
      result += Math.floor(this.monster.level * 0.8);

      return result;
    },
    active() {
      return this.monster.status.active;
    },
  },

  data: () => ({}),
};
</script>

<style scoped>
.highlight {
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 0.95) 0%,
    rgba(8, 21, 63, 0.95) 24%,
    rgba(9, 20, 121, 0.8) 66%
  );
  border: 0.5px dashed white;
  /* margin-top: 10px; */
  margin-left: 15px;
}
.monsterbg {
  background: linear-gradient(
    120deg,
    rgba(2, 2, 1, 0.95) 10%,
    rgba(139, 101, 31, 0.95) 33%,
    rgba(121, 9, 9, 0.95) 80%
  );
  /* background-color: rgba(97, 23, 0, 0.925); */
}
</style>
