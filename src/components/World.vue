<template>
  <v-container>
    <v-card>
      <v-card-text class="indigo white--text pa-10">
        <v-row>
          <v-col>
       
            <v-col>
                   <h3>
              {{ title }}
            </h3>
              {{ message }}
            </v-col>


          </v-col>
          <v-col>
            <v-container>
                            <v-btn block color="secondary" @click="town()" 
        >visit the shop</v-btn
      >
              <v-btn block color="secondary" @click="progress()" 
        >push on</v-btn
      >
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
    // title: String,
    // message: String,
  },


  computed: {

    stage() {
      return this.$store.getters.stage;
    },

  },

  methods: {
       progress() {
     this.$emit('progress');
   },
       town() {
     this.$store.commit('town', true);
   },


  },

  data() {
    return {
           title: "You exchange",
    message: "The economy intensifies",
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





