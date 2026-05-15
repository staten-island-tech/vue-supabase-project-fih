import { createWebHistory } from "vue-router";
import AcquariumScreen from "~/Interfaces/AcquariumScreen.vue";
import PixelArtFish from "~/Interfaces/PixelArtFish.vue";

const rouster = createRouter ({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
     {
      path:'/',
      name:'Acquarium',
      component: AcquariumScreen,
    },
    {
      path:'/PixelArtFish',
      name:'PixelArt',
      component: PixelArtFish,
    },
  ],
})