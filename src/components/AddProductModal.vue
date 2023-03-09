<script setup>
import { ref } from "vue";
import Modal from "@/components/Modal.vue";
import UseDatabase from "@/lib/UseDatabase";
import useAuthUser from "@/lib/UseAuthUser";
import { useToast as toast } from "vue-toastification";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Thumbs, Virtual } from "swiper";
import customSelect from "custom-select";
import "swiper/css";

const thumbsSwiper = ref(null);
const setThumbsSwiper = (swiper) => {
    thumbsSwiper.value = swiper;
};

const emit = defineEmits(["close"]);

const { categories, addNewProduct, uploadImage, imagesList } = UseDatabase();
const { user } = useAuthUser();

const images = ref([]);
const fileInput = ref(null);

const onFilePicked = async (event) => {
    const maxImgs = 5;
    const files = event.target.files;

    if (images.value.length >= maxImgs || files.length > maxImgs) {
        toast().warning(`Максимум ${maxImgs} изображений`);
        return;
    }
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
    category: "0",
    socials: {
        tg: "",
        vk: "",
        wht: "",
    },
});
const isAddBtnDisabled = ref(false);
const handleAddProduct = async () => {
    form.value.user = user.value.id;
    form.value.author = user.value.user_metadata.name;
    if (form.value.photos.length == 0) {
        toast().warning("Добавьте хотя бы одно фото");
        return;
    }
    if (form.value.name == "" || form.value.price == "") {
        toast().warning("Поля имени и цены не должны быть пустыми");
        return;
    }
    if (
        !(
            form.value.socials.tg != "" ||
            form.value.socials.vk != "" ||
            form.value.socials.wht != ""
        )
    ) {
        toast().warning("Оставьте ссылку хотя бы на одну соц.сеть для связи");
        return;
    }
    isAddBtnDisabled.value = true;
    try {
        await addNewProduct(form.value);
        emit("close");
        form.value = {
            name: "",
            price: null,
            user: null,
            description: "",
            date: new Date().toLocaleDateString("ru-Ru"),
            category: "0",
            socials: {
                tg: "",
                vk: "",
                wht: "",
            },
        };
        images.value = [];
        toast().success("Товар добавлен!");
        isAddBtnDisabled.value = false;
    } catch (error) {
        toast().error(error.message);
    }
};
</script>

<template>
    <Modal @close-modal="$emit('close')">
        <template #title>Добавить товар</template>
        <template #body>
            <div class="form">
                <div class="block-top">
                    <div class="block-top-text">
                        <div class="block-top-line1">
                            <input
                                class="block-top-name"
                                type="text"
                                v-model="form.name"
                                placeholder="Название"
                            />
                            <input
                                class="block-top-price"
                                type="text"
                                v-model="form.price"
                                placeholder="Цена"
                            />
                        </div>
                        <select
                            v-model="form.category"
                            class="select-products-modal"
                        >
                            <option
                                :value="category.id"
                                v-for="(category, index) in categories"
                                :key="index"
                            >
                                {{ category.name }}
                            </option>
                        </select>
                        <textarea
                            type="text"
                            v-model="form.description"
                            placeholder="Описание товара"
                        />
                    </div>
                    <div class="block-top-image">
                        <button
                            class="btn-upload"
                            @click="fileInput.click()"
                            v-if="images.length == 0"
                        >
                            <img
                                src="@/assets/images/upload-icon.svg"
                                alt="upload"
                            />
                            <span>Загрузите изображение</span>
                        </button>
                        <swiper
                            v-if="images.length != 0"
                            :modules="[Thumbs, Virtual]"
                            :thumbs="{ swiper: thumbsSwiper }"
                            :slides-per-view="1"
                            :space-between="10"
                            class="main-slider"
                        >
                            <swiper-slide
                                v-for="(img, index) in images"
                                :key="index"
                                :virtualIndex="index"
                                class="main-slider__slide"
                            >
                                <div
                                    class="img-container"
                                    v-bind:class="{
                                        loading: !img.isLoaded,
                                    }"
                                >
                                    <img v-bind:src="img.link" />
                                </div>
                            </swiper-slide>
                        </swiper>
                        <swiper
                            :modules="[Thumbs, Virtual]"
                            watch-slides-progress
                            @swiper="setThumbsSwiper"
                            class="thumb-slider"
                            :space-between="10"
                            :slides-per-view="3"
                        >
                            <swiper-slide
                                v-for="(img, index) in images"
                                :key="index"
                                :virtualIndex="index"
                                class="thumb"
                            >
                                <div
                                    class="img-container"
                                    v-bind:class="{
                                        loading: !img.isLoaded,
                                    }"
                                >
                                    <img v-bind:src="img.link" />
                                </div>
                            </swiper-slide>
                            <swiper-slide class="thumb">
                                <button
                                    class="btn-upload-thumb"
                                    @click="fileInput.click()"
                                    v-if="images.length != 0"
                                >
                                    <img
                                        src="@/assets/images/upload-icon.svg"
                                        alt="upload"
                                    />
                                </button>
                            </swiper-slide>
                        </swiper>
                    </div>
                </div>

                <div class="block-bottom">
                    <input
                        class="tg"
                        type="text"
                        placeholder="@name"
                        v-model="form.socials.tg"
                    />
                    <input
                        class="vk"
                        type="text"
                        placeholder="id"
                        v-model="form.socials.vk"
                    />
                    <input
                        class="wht"
                        type="tel"
                        data-tel-input
                        placeholder="8 (918) 999-99-99"
                        maxlength="18"
                        v-model="form.socials.wht"
                    />
                </div>

                <input
                    type="file"
                    style="display: none"
                    ref="fileInput"
                    accept=".png, .jpg, .jpeg, .gif"
                    @change="onFilePicked"
                    multiple
                />

                <button
                    class="btn"
                    :disabled="isAddBtnDisabled"
                    v-on:click="handleAddProduct()"
                >
                    Отправить
                </button>
            </div>
        </template>
    </Modal>
</template>

<style lang="scss" scoped>
.main-slider {
    margin-bottom: 16px;
    &__slide {
        width: 100%;
        height: 328px;
        border-radius: 20px;
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        @media (max-width: 800px) {
            height: 260px;
        }
    }
}
.thumb {
    &.swiper-slide-thumb-active {
        border: 5px solid #009f81;
    }
    transition: border ease 0.3s;
    width: 75px !important;
    height: 75px !important;
    cursor: pointer;
    border-radius: 20px;
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
.btn-upload-thumb {
    width: 100% !important;
    height: 100% !important;
    display: block;
    img {
        width: 44px;
        object-fit: contain;
    }
}
.form {
    .img-container {
        width: 100%;
        height: 100%;
    }
    .img-container.loading {
        position: relative;
        &::before {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            content: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3Csvg xmlns:svg='http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.0' width='50px' height='50px' viewBox='0 0 128 128' xml:space='preserve'%3E%3Cg%3E%3Cpath d='M64 9.75A54.25 54.25 0 0 0 9.75 64H0a64 64 0 0 1 128 0h-9.75A54.25 54.25 0 0 0 64 9.75z' fill='%23ffffff'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 64 64' to='360 64 64' dur='1800ms' repeatCount='indefinite'%3E%3C/animateTransform%3E%3C/g%3E%3C/svg%3E");
            z-index: 1000;
        }

        img {
            filter: brightness(40%);
        }
    }
}
input {
    padding: 20px;
    background: #d9d9d9;
    border-radius: 20px;
    font-weight: 700;
    font-size: 24px;
    max-width: 100%;
    font-family: inherit;
    color: #676767;
    @media (max-width: 720px) {
        font-size: calc(16px + 27.2 * ((100vw - 320px) / 1196));
    }
}
.block-bottom {
    margin-bottom: 50px;
    display: flex;
    column-gap: 40px;
    input {
        font-size: 20px;
        padding-left: 70px;
        max-width: 300px;
    }
    @media (max-width: 1090px) {
        column-gap: 20px;
    }
    @media (max-width: 1050px) {
        flex-wrap: wrap;
        row-gap: 15px;
    }
    @media (max-width: 500px) {
        max-width: 100%;
        input {
            max-width: 100%;
        }
    }
}
.tg {
    background: url(../assets/images/tg.svg) left center no-repeat, #d9d9d9;
}
.vk {
    background: url(../assets/images/vk.svg) left center no-repeat, #d9d9d9;
}
.wht {
    background: url(../assets/images/wht.svg) 15px center no-repeat, #d9d9d9;
}

.block-top {
    column-gap: 95px;
    display: flex;
    @media (max-width: 1090px) {
        column-gap: 30px;
    }
    @media (max-width: 1050px) {
        flex-direction: column-reverse;
        row-gap: 15px;
        .block-top-image {
            align-self: center;
        }
    }
    @media (max-width: 500px) {
        .block-top-image {
            max-width: 100%;
            align-self: center;
        }
    }
}
.block-top-text {
    display: flex;
    flex-direction: column;
}

.block-top-image {
    max-width: 370px;
    flex-grow: 2;
}
.block-top-line1 {
    margin-bottom: 25px;
    column-gap: 35px;
    row-gap: 20px;
    display: flex;
    flex-wrap: wrap;
}

.block-top-name {
    max-width: 338px;
    flex-grow: 1;
    @media (max-width: 500px) {
        max-width: 100%;
    }
}

.block-top-price {
    max-width: 174px;
    flex-grow: 1;
    padding-right: 50px;
    background: url(../assets/images/rubl.svg) right 20px center no-repeat,
        #d9d9d9;
}

.customSelect {
    margin-bottom: 25px;
    padding: 20px;
    max-width: 338px;
    background: url(../assets/images/down-arrow.svg) right 20px center no-repeat,
        #d9d9d9;
    border-radius: 20px;
    font-weight: 700;
    font-size: 24px;
    color: #676767;
    cursor: pointer;
}

textarea {
    margin-bottom: 25px;
    padding: 18px 0 0 20px;
    border-radius: 20px;
    height: 235px;
    background: #d9d9d9;
    font-weight: 700;
    font-size: 24px;
    color: #676767;
    resize: none;
    max-width: 100%;
    @media (max-width: 720px) {
        font-size: calc(16px + 27.2 * ((100vw - 320px) / 1196));
    }
}

.btn {
    padding: 16px 45px;
    background: #009f81;
    border-radius: 20px;
    font-weight: 700;
    font-size: 24px;
    color: #ffffff;
}
.btn-upload {
    padding: 15px;
    display: flex;
    flex-direction: column;
    font-size: 16px;
    font-weight: 500;
    width: 100%;
    height: 328px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: none;
    color: #878787;
    border: 15px solid #d9d9d9;
    border-radius: 30px;
    img {
        width: 80px;
    }
    @media (max-width: 800px) {
        height: 260px;
    }
}
</style>
