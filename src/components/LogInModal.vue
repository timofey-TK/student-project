<script setup>
import Modal from "@/components/Modal.vue";
import { ref } from "vue";
import useAuthUser from "@/lib/UseAuthUser";
import { useToast as toast } from "vue-toastification";
const emit = defineEmits(["close"]);

const { login } = useAuthUser();
const handleLogin = async () => {
    try {
        var v = await login(form.value);
        emit("close");
    } catch (error) {
        toast().error(error.message);
    }
};
const form = ref({
    email: "",
    password: "",
});
</script>
<template>
    <Modal @close-modal="$emit('close')">
        <template #title>Авторизация</template>
        <template #body>
            <div class="input-block">
                <input
                    type="email"
                    v-model="form.email"
                    id="email"
                    autocomplete="on"
                    placeholder="почта"
                />
            </div>
            <div class="input-block">
                <input
                    type="password"
                    id="password"
                    autocomplete="on"
                    v-model="form.password"
                    placeholder="пароль"
                />
            </div>
            <button class="authorization-modal-btn" @click="handleLogin">
                Войти
            </button>
        </template>
    </Modal>
</template>
