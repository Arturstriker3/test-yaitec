import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createVuestic } from "vuestic-ui";
import 'vuestic-ui/styles/essential.css';
import 'vuestic-ui/styles/typography.css';
import { createPinia } from 'pinia';
import router from './core/router/pages'
import Toaster from "@meforma/vue-toaster";
import VueApexCharts from "vue3-apexcharts";

const app = createApp(App);

const pinia = createPinia();

app.use(router);

app.use(Toaster);

app.use(pinia);

app.use(
    createVuestic({
      config: {
        colors: {
          variables: {
            primary: "#151e22",
            button: "#039be5",
          },
        },
        components: {
          VaButton: {
            color: "button",
          },
        },
      },
    })
  )

app.use(VueApexCharts);

app.mount("#app");