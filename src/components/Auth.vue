<script setup>
import { ref } from "vue";
import useAuthUser from "@/lib/UseAuthUser";
import { useToast as toast } from "vue-toastification";

const { register, login, user, isLoggedIn, logout } = useAuthUser();

const form = ref({
    name: "",
    email: "",
    password: "",
});

const handleRegister = async () => {
    try {
        await register(form.value);
        toast().warning("Проверьте почту!");
    } catch (error) {
        toast().error(error.message);
    }
};
const handleLogin = async () => {
    try {
        await login(form.value);
    } catch (error) {
        toast().error(error.message);
    }
};
</script>

<template>
    <div class="auth-modal modal" v-if="!isLoggedIn()">
        <label>Name <input v-model="form.name" type="text" /></label>

        <label>Email <input v-model="form.email" type="email" /></label>
        <label
            >Password <input v-model="form.password" type="password"
        /></label>
        <button v-on:click="handleRegister()">Register</button>
        <button v-on:click="handleLogin()">Login</button>
    </div>
    <div v-if="isLoggedIn()">
        <button v-on:click="logout()">logout</button>
        <h1>{{ user.user_metadata.name }}</h1>
        <br />
        <div class="avatar">
            <img
                :src="
                    'https://api.dicebear.com/5.x/bottts-neutral/svg?radius=50&seed=' +
                    user.id
                "
                alt="avatar"
            />
        </div>
    </div>
</template>

<style lang="scss">
.avatar {
    width: 100px;
}
.auth-modal {
    background: #000;
    color: #fff;
    padding: 20px;
    display: flex;
    gap: 30px;
}
</style>
