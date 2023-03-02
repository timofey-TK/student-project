<script setup>
import Modal from "@/components/Modal.vue";
import { ref } from "vue";
import useAuthUser from "@/lib/UseAuthUser";
import { useToast as toast } from "vue-toastification";
const emit = defineEmits(["close"]);

const { register } = useAuthUser();

const handleRegister = async () => {
    try {
        await register(form.value);
        emit("close");
        toast().warning("Проверьте почту!");
        form.value = {
            name: "",
            email: "",
            password: "",
        };
    } catch (error) {
        toast().error(error.message);
    }
};

const form = ref({
    name: "",
    email: "",
    password: "",
});
</script>
<template>
    <Modal @close-modal="$emit('close')">
        <template #title>Регистрация</template>
        <template #body>
            <div>
                <div class="input-block">
                    <input
                        type="text"
                        v-model="form.name"
                        placeholder="имя"
                        autocomplete="on"
                        id="Rname"
                    />
                </div>
                <div class="input-block">
                    <input
                        autocomplete="on"
                        id="Remail"
                        type="email"
                        v-model="form.email"
                        placeholder="почта"
                    />
                </div>
                <div class="input-block">
                    <input
                        id="Rpassword"
                        autocomplete="on"
                        type="password"
                        v-model="form.password"
                        placeholder="пароль"
                    />
                </div>
                <button class="authorization-modal-btn" @click="handleRegister">
                    Зарегистрироваться
                </button>
            </div>
        </template>
    </Modal>
</template>
