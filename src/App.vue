<template>
  <v-app>
    <v-app-bar app color="third" dark>


      <v-spacer></v-spacer>
      <router-link to="/" name="Home"><v-tab class="white--text">Home</v-tab></router-link>
      <router-link to="/about" name="About"><v-tab class="white--text"> About</v-tab></router-link>
      <router-link to="/game" name="Game"><v-tab class="white--text">Game</v-tab></router-link>


    </v-app-bar>

    <v-main class="body-bg">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>

<style>
.body-bg {
  background-color: rgb(44, 68, 99);
  background: rgb(44, 68, 99);
}
.fontshadow {
  text-shadow: 1px 2px black;
}

</style>
