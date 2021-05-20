import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //toon
    toons: {
      toon: {},
      characters: [
        {
          name: "Pharc",
          level: 1,
          xp: 0,
          points: 0,
          gold: 100,
          inventory: [
            { name: "Unarmed", ap: 0, uses: true, maxUses: false, cost: 0 },
          ],

          weighted: {
            hpMax: null,
            hp: null,
            ac: null,
            ap: null,
          },

          equipment: {
            weapon: null,
            armor: null,
          },

          status: {
            pacifist: true,
            defending: false,
            recovering: false,
            sacrifice: false,
            lust: false,
          },

          stats: [
            { name: "strength", value: 14 },
            { name: "dexterity", value: 10 },
            { name: "willpower", value: 4 },
            { name: "vigor", value: 12 },
          ],
        },
        {
          name: "Rambo",
          pacifist: false,
          level: 1,
          xp: 0,
          points: 0,
          gold: 0,
          inventory: [
            { name: "Unarmed", ap: 2, uses: true, maxUses: false, cost: 0 },
          ],

          weighted: {
            hpMax: null,
            hp: null,
            ac: null,
            ap: null,
          },

          equipment: {
            weapon: null,
            armor: null,
          },

          status: {
            pacifist: true,
            defending: false,
            recovering: false,
            sacrifice: false,
            lust: false,
          },

          stats: [
            { name: "strength", value: 14 },
            { name: "dexterity", value: 10 },
            { name: "willpower", value: 4 },
            { name: "vigor", value: 12 },
          ],
        },
      ],
    },

    //monsters
    monsters: {
      monster: {},

      target: null,
      monsterTag: 0,
    },
    //combat
    combat: {
      xpSlope: 20,
      combatLog: [],
      encounter: [],
    },
    //game
    game: {
      stage: 0,
      timeout: 3000,
      gameOver: false,
      combat: false,
      waiting: true,
      town: false,
    },
    //tally
    tally: {
      spentGold: 0,
      weaponUses: 0,
    },

  },

  mutations: {
    //toons
    begin(state, payload) {
      state.toons.toon = payload;
    },
    //game
    wait(state, payload) {
      state.game.waiting = payload;
    },
    town(state, payload) {
      state.game.town = payload;
    },
    stage(state) {
      state.game.stage++;
    },
    monsterTag(state) {
      state.monsters.monsterTag++;
    },
    //combat
    toggleCombat(state, payload) {
      state.game.combat = payload;
    },
    logEntry(state, payload) {
      state.combat.combatLog.push(payload);
    },
    seed(state, payload) {
      payload.forEach((element) => {
        state.combat.encounter.push(element);
      });

  
      state.game.combat = true;
      setTimeout(() => {
        
        state.game.waiting = false;
      }, 2800);
    },
  },
  actions: {
    stage (context) {
      context.commit('stage');
    },
    monsterTag (context) {
      context.commit('monsterTag');
    },
  },
  getters: {
    //toons
    characters(state) {
      return state.toons.characters;
    },
    toon(state) {
      return state.toons.toon;
    },

    //game
    waiting(state) {
      return state.game.waiting;
    },
    combat(state) {
      return state.game.combat;
    },
    stage(state) {
      return state.game.stage;
    },

    town(state) {
      return state.game.town;
    },
    road(state) {
      return state.game.road;
    },

    //combat
    encounter(state) {
      return state.combat.encounter;
    },
    xpSlope(state) {
      let scale = 1;
      if (state.toons.toon.level > 1) {
        scale = state.toons.toon.level * 1.5;
      }
      return state.combat.xpSlope * scale;
    },
    combatLog(state) {
      if (!state.combat.combatLog.length) {
        for (let i = 0; i < 7; i++) {
          state.combat.combatLog.push(`<b class="black--text">.</b>`);
        }
      }
      return state.combat.combatLog.slice().reverse();
    },

    //monsters
    monsterTag(state) {
      return state.monsters.monsterTag;
    },


  },
  modules: {},
  computed: {},
});
