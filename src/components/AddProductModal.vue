<script setup>
import { ref } from "vue";
import Modal from "@/components/Modal.vue";
import vSelect from "vue-select";
import UseDatabase from "@/lib/UseDatabase";
import useAuthUser from "@/lib/UseAuthUser";
import { useToast as toast } from "vue-toastification";

const emit = defineEmits(["close"]);

const { categories, addNewProduct, uploadImage, imagesList } = UseDatabase();
const { user } = useAuthUser();

const images = ref([]);
const fileInput = ref(null);

const onFilePicked = async (event) => {
    const files = event.target.files;
    try {
        for (let file of files) {
            let url = URL.createObjectURL(file);
            images.value.push({
                name: file.name,
                link: url,
                isLoaded: false,
            });
        }
        for (let file of files) {
            images.value.find((el) => el.name == file.name).isLoaded =
                await uploadImage(file);
        }
    } catch (error) {
        toast().error(error.message);
    }
};

const form = ref({
    name: "",
    price: null,
    user: null,
    description: "",
    photos: imagesList.value,
    date: new Date().getTime(),
    category: null,
    socials: {
        tg: "",
        vk: "",
        wht: "",
    },
});

const handleAddProduct = async () => {
    form.value.user = user.value.id;
    try {
        await addNewProduct(form.value);
        emit("close");
        form.value = {
            name: "",
            price: null,
            user: null,
            description: "",
            date: new Date().toLocaleDateString("ru-Ru"),
            category: null,
            socials: {
                tg: "",
                vk: "",
                wht: "",
            },
        };
        toast().success("Товар добавлен!");
    } catch (error) {
        toast().error(error.message);
    }
};
</script>

<template>
    <Modal @close-modal="$emit('close')">
        <div class="form">
            <input type="text" v-model="form.name" placeholder="Имя" />
            <input type="text" v-model="form.price" placeholder="Цена" />
            <v-select
                :options="categories"
                label="name"
                v-model="form.category"
                :reduce="(category) => category.id"
            ></v-select>
            <textarea
                type="text"
                v-model="form.description"
                placeholder="описание"
            />
            <input type="text" v-model="form.socials.tg" placeholder="тг" />
            <input type="text" v-model="form.socials.vk" placeholder="vk" />
            <input
                type="text"
                v-model="form.socials.wht"
                placeholder="whatsapp"
            />
            <button class="btn" @click="fileInput.click()">
                Upload profile picture
            </button>
            <input
                type="file"
                style="display: none"
                ref="fileInput"
                accept="image/*"
                @change="onFilePicked"
                multiple
            />
            <div class="photos-prev">
                <img
                    v-bind:src="img.link"
                    alt=""
                    v-for="(img, index) in images"
                    :key="index"
                    v-bind:class="{ loading: !img.isLoaded }"
                />
            </div>
            <button v-on:click="handleAddProduct()">Отправить</button>
        </div>
        {{ images }}

        <br />
    </Modal>
</template>

<style lang="scss" scoped>
.form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 40px;
    img {
        height: 75px;
    }
    img.loading {
        filter: brightness(40%);
    }
}
input,
textarea {
    border: 2px solid #333;
}
</style>
