import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: "#0b090a",
        secondary: "#161a1d",
        tertiary: "#660708",
        fourth: "#a4161a",
        fifth: "#ff595e",

        accent: "#b1a7a6",


        error: "ff1654",
        
        success: "#70c1b3",
      },
    },
  },
});
