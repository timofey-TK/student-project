import { createApp } from 'vue'
import App from './App.vue'
import Toast from 'vue-toastification';
import "@/lib/phoneinput";

import 'vue-toastification/dist/index.css';
import './assets/base.css'
import '@/assets/custom-select.css'

const app = createApp(App);
app.use(Toast);
app.mount('#app');
