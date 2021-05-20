<template>
  <v-container>
    <v-card class="black white--text pa-2">
      <div v-for="i in range(0, 10)" :key="i">
        <!-- <li class="pl-5" v-html="entry"></li> -->
        <div class="pl-5" v-html="combatLog[i]"></div>
      </div>
    </v-card>
    <v-btn block color="secondary" @click="toggleSize()">&lt;&gt;</v-btn>
  </v-container>
</template>

<script>
export default {
  props: {
    combatLog: Array,
  },
  computed: {
    encounter() {
      return this.$store.getters.encounter.length;
    },
  },
  methods: {
    range(start, end) {
      return Array(end - start + 1)
        .fill()
        .map((_, idx) => start + idx)
        .slice()
        .reverse();
    },
    toggleSize() {
      this.minimize = !this.minimize;
            if (this.minimize) {
        this.$emit('toggleSize', "max-width: 100px");
      } else {
        this.$emit('toggleSize', "");
      }
    },

  },
  data() {
    return {
      minimize: false,
    };
  },
};
</script>

<style></style>
