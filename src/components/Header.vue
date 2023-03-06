<script setup>
import { ref } from "vue";
import useAuthUser from "@/lib/UseAuthUser";
import AddProductModal from "./AddProductModal.vue";
import RegistrationModal from "@/components/RegistrationModal.vue";
import LogInModal from "./LogInModal.vue";
import UseDatabase from "@/lib/UseDatabase";
import { useToast as toast } from "vue-toastification";

const { categories, categorySelect } = UseDatabase();

const isLogInModalOpen = ref(false),
    isRegistrationModalOpen = ref(false),
    isAddProductModalOpen = ref(false);

const { isLoggedIn, user, logout } = useAuthUser();

function handleProductModal() {
    if (!isLoggedIn()) {
        toast().warning("Для добавления товара необходимо авторизоваться!");
    } else {
        isAddProductModalOpen.value = true;
    }
}
const categoriesSliced = () => {
    return categories.value.slice(0, 6);
};
const handleCategory = (id) => {
    categorySelect.value = id;
};
</script>
<template>
    <RegistrationModal
        v-show="isRegistrationModalOpen"
        @close="isRegistrationModalOpen = false"
    />
    <LogInModal v-show="isLogInModalOpen" @close="isLogInModalOpen = false" />
    <AddProductModal
        v-show="isAddProductModalOpen"
        @close="isAddProductModalOpen = false"
    />
    <header id="header">
        <div class="container">
            <nav>
                <div class="logotype">
                    <img src="@/assets/images/logo.svg" alt="logotype" />
                </div>
                <div class="authorization" v-if="!isLoggedIn()">
                    <a href="#" @click="isLogInModalOpen = true">Войти</a>
                    <a href="#" @click="isRegistrationModalOpen = true"
                        >Регистрация</a
                    >
                </div>
                <div class="account" v-else>
                    <button @click="logout" class="logout">Выйти</button>
                    <p class="account-name">{{ user.user_metadata?.name }}</p>
                    <img
                        class="avatar"
                        :src="
                            'https://api.dicebear.com/5.x/bottts-neutral/svg?radius=50&seed=' +
                            user.id
                        "
                        alt="avatar"
                    />
                </div>
            </nav>
            <div class="logo">
                <h1>студ.маркет</h1>
            </div>

            <ul class="list">
                <li
                    v-for="(category, index) in categoriesSliced()"
                    :key="index"
                    data-category="category.id"
                >
                    <a
                        class="list_item smooth"
                        href="#products-section"
                        @click="handleCategory(category.id)"
                        >{{ category.name }}</a
                    >
                </li>
            </ul>
            <div class="buttons">
                <a href="#products-section" class="btn btn-buy smooth"
                    >Купить</a
                >
                <button class="btn btn-sell" @click="handleProductModal()">
                    Продать
                </button>
            </div>
            <div class="arrow">
                <a href="#products-section" class="smooth"
                    ><img
                        src="@/assets/images/arrow.svg"
                        alt="button arrow down"
                /></a>
            </div>
        </div>
    </header>
</template>
<style scoped>
.logout {
    font-size: inherit;
    border: none;
    background: red;
    padding: 7px;
    border-radius: 13px;
    color: #fff;
    font-weight: 500;
}
.avatar {
    width: 55px;
}
.account {
    display: flex;
    align-items: center;
    gap: 20px;
}
.account-name {
    text-align: right;
}
@media (max-width: 700px) {
    .account {
        justify-content: center;
        width: 100%;
    }
}
header {
    padding: 65px 0 0 0;
    min-height: 100vh;
    background-image: url(@/assets/images/theme.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
}

@media (max-width: 830px) {
    header {
        padding: 50px 0 0 0;
    }
}

@media (max-width: 780px) {
    header {
        min-height: auto;
    }
}

@media (max-width: 670px) {
    header {
        padding: 40px 0 0 0;
    }
}

@media (max-width: 630px) {
    header {
        padding: 30px 0 0 0;
    }
}

.container {
    margin: 0 auto;
    max-width: 1196px;
    padding: 0 20px;
}

nav {
    margin-bottom: 72px;
    padding: 13px 60px;
    -webkit-column-gap: 10px;
    column-gap: 10px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    border-radius: 30px;
    background-color: rgba(255, 255, 255, 0.5);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
}

@media (max-width: 890px) {
    nav {
        margin-bottom: calc(16px + 95.2 * ((100vw - 320px) / 1196));
    }
}

nav a {
    display: block;
    color: #333333;
    font-weight: 500;
    transition: color ease 0.3s;
}

nav a:hover {
    color: #009f81;
}

@media (max-width: 915px) {
    nav a {
        font-size: calc(18px + 3.4 * ((100vw - 725px) / 1196));
    }
}

@media (max-width: 630px) {
    nav a {
        font-size: 20px;
    }
}

@media (max-width: 700px) {
    .logotype {
        display: none;
    }
}

.authorization {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-column-gap: 30px;
    column-gap: 30px;
}

@media (max-width: 700px) {
    .authorization {
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        width: 100%;
    }
}

.logo {
    margin: 0 0 27px 0;
    padding: 67px 10px;
    background-color: rgba(255, 255, 255, 0.5);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    border-radius: 40px;
}

@media (max-width: 900px) {
    .logo {
        padding-top: calc(32px + 59.5 * ((100vw - 320px) / 1196));
        padding-bottom: calc(32px + 59.5 * ((100vw - 320px) / 1196));
    }
}

@media (max-width: 800px) {
    .logo {
        border-radius: 30px;
    }
}

.logo h1 {
    text-align: center;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    font-weight: 700;
    font-size: 128px;
    text-transform: uppercase;
}

@media (max-width: 1040px) {
    .logo h1 {
        font-size: calc(30px + 166.6 * ((100vw - 320px) / 1196));
    }
}

.list {
    margin: 0 0 110px 0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    gap: 20px;
}

@media (max-width: 650px) {
    .list {
        gap: 10px;
    }
}

@media (max-width: 1000px) {
    .list {
        margin-bottom: calc(36px + 125.8 * ((100vw - 320px) / 1196));
    }
}

.list_item {
    text-decoration: none;
    color: inherit;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    text-align: center;
    padding: 12px 20px;
    border-radius: 30px;
    font-weight: 700;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-color: rgba(255, 255, 255, 0.5);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    cursor: pointer;
}

@media (max-width: 1040px) {
    .list_item {
        font-size: calc(14px + 10.2 * ((100vw - 740px) / 1196));
    }
}

.buttons {
    margin-bottom: 45px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-column-gap: 35px;
    column-gap: 35px;
}

.btn {
    padding: 47px 0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-preferred-size: 482px;
    flex-basis: 482px;
    font-weight: 800;
    font-size: 64px;
    color: #ffffff;
    border-radius: 50px;
}

@media (max-width: 830px) {
    .btn {
        font-size: calc(22px + 71.4 * ((100vw - 320px) / 1196));
    }
}

@media (max-width: 900px) {
    .btn {
        padding-top: calc(26px + 35.7 * ((100vw - 320px) / 1196));
        padding-bottom: calc(26px + 35.7 * ((100vw - 320px) / 1196));
    }
}

@media (max-width: 580px) {
    .buttons {
        gap: 20px;
    }
    .btn {
        border-radius: 30px;
    }
}

.btn-buy {
    background: linear-gradient(76.02deg, #26376b 8.38%, #2948ff 91.45%);
    -webkit-box-shadow: 5px 4px 20px rgba(0, 0, 0, 0.25);
    box-shadow: 5px 4px 20px rgba(0, 0, 0, 0.25);
}

.btn-sell {
    background: linear-gradient(75.82deg, #fc4a1a 11.54%, #f7b733 98.7%);
    -webkit-box-shadow: 0px 4px 28px rgba(0, 0, 0, 0.25);
    box-shadow: 0px 4px 28px rgba(0, 0, 0, 0.25);
}

.arrow {
    text-align: center;
}
</style>
