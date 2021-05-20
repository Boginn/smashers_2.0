<template>
  <v-container>
    <v-card>
      <v-card-text class="indigo white--text pa-10">
        <v-container>
          <h1>{{ welcome }}</h1>
          <h3>{{ message }}</h3>
        </v-container>
        <v-col cols="6">
          <v-row
            @click="begin(toon)"
            v-for="toon in characters"
            v-bind:key="toon.name"
            class="ma-1 pa-1 highlight fontshadow"
          >
            <v-col>
              <h1 style="height: 50px;" class="fontshadow">
                {{ toon.name }}
                
              </h1>
            </v-col>
            <v-col cols="auto">
              <h3 v-for="stat in toon.stats" :key="stat.id">
                <span class=""> {{ stat.name }}</span>
                <span class=""> {{ stat.value }}</span>
              </h3>
            </v-col>
          </v-row>
        </v-col>
      </v-card-text>
    </v-card>
    
  </v-container>
</template>

<script>
export default {
  name: "Welcome",
  components: {},

  computed: {
    characters() {
      let characters = [];
      this.$store.getters.characters.forEach((character) => {
        // let toon = new Object();
        // toon = Object.assign({}, character);
        console.log(character)
        characters.push(character);
      });
      return characters;
    },
  },

  methods: {
    begin(toon) {
      console.log(toon)
      this.$store.commit("begin", toon);
      this.$router.push("/game");
    },
  },
  data() {
    return {
      welcome: 'Welcome to SMASHERS!"#%',
      message: "Pick a character:",
    };
  },
};
</script>

<style scoped>
.highlight:hover {
  cursor: pointer;
  background: rgba(63, 165, 190, 0.171);
}
.highlight {
  border-radius: 5px;

  border: 2px dotted white;
}
</style>
