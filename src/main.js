import { createApp } from 'vue'
import App from './App.vue'
import Toast from 'vue-toastification';

import 'vue-toastification/dist/index.css';
import './assets/main.css'
import "vue-select/dist/vue-select.css";

const app = createApp(App);
app.use(Toast);
app.mount('#app');
