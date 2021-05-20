<template>
  <v-container>
    <v-card>
      <v-card-text class="indigo white--text pa-10">
        <v-row>
          <v-col>
            <h3>
              {{ step.title }}
            </h3>
            <p>
              {{ step.message }}
            </p>

            <v-row>
              <h3
                @click="pickOption(option, step)"
                v-for="option in step.options"
                v-bind:key="option.name"
                class="ma-1 pa-1 highlight fontshadow text-center"
                style="width: 100%;"
              >
                {{ option.name }}
              </h3>
            </v-row>
          </v-col>
          <v-col>
            <v-container>
              {{ step.elaboration }}
            </v-container>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

  </v-container>
</template>

<script>
export default {
  name: "World",
  components: {},
  props: {
  },


  computed: {
    step() {

      if (this.steps.intro.fog) {
        this.$store.commit("town", true);
        return this.steps.intro;

      } else if (this.town) {
        this.$store.commit("road", true);
        this.$store.commit("town", false);
        return this.steps.town;

      } else if (this.road) {
        this.$store.commit("road", false);
        this.$store.commit("town", false);
        return this.steps.road;

      } else {
        return this.steps.west;
      }

    },

    stage() {
      return this.$store.getters.stage;
    },
    steps() {
      return this.$store.getters.steps;
    },

    //
    town: {
      get: function() {
        console.log(`town ${this.$store.getters.town}`);

        return this.$store.getters.town;
      },
      set: function(value) {
        this.$store.commit("town", value);
      },
    },
    road: {
      get: function() {
        console.log(`road ${this.$store.getters.road}`);

        return this.$store.getters.road;
      },
      set: function(value) {
        this.$store.commit("road", value);
      },
    },
  },

  methods: {
    getStepByName(string) {
      let result;
      this.steps.forEach((step) => {
        if (step.title == string) {
          result = step;
        }
      });
      return result;
    },
    pickOption(option, step) {
      step.fog = false;
      this.$emit("option", option);
    },
  },
  data() {
    return {};
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





