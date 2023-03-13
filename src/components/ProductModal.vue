<script setup>
import { ref } from "vue";
import Modal from "@/components/Modal.vue";
import UseDatabase from "@/lib/UseDatabase";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Thumbs, Virtual } from "swiper";

const props = defineProps(["product"]);
const { categories } = UseDatabase();

const thumbsSwiper = ref(null);
const setThumbsSwiper = (swiper) => {
    thumbsSwiper.value = swiper;
};

function handleSocials(soc) {
    let link = "";
    if (soc == "tg") {
        if (/https/.test(props.product?.socials.tg)) {
            link = props.product?.socials.tg;
        } else if (/@/.test(props.product?.socials.tg)) {
            link = "https://t.me/" + props.product?.socials.tg.replace("@", "");
        } else {
            link = "https://t.me/" + props.product?.socials.tg;
        }
    } else if (soc == "vk") {
        link = /https/.test(props.product?.socials.vk)
            ? props.product?.socials.vk.replace("@", "")
            : "https://vk.com/" + props.product?.socials.vk.replace("@", "");
    } else {
        let tel = props.product?.socials.wht;
        if (!tel) {
            return;
        }
        if (tel[0] == "8") {
            link =
                "https://wa.me/" +
                "7" +
                tel.slice(1).replace(/[\s\(\)\+\-]/g, "");
        } else {
            link = "https://wa.me/" + tel.replace(/[\s\(\)\+\-]/g, "");
        }
    }
    return link;
}
</script>
<template>
    <Modal @close-modal="$emit('close')">
        <template #title>{{ props.product?.name }}</template>
        <template #body>
            <div class="product-body">
                <div class="product-column-left">
                    <div class="product-author">
                        Продавец: {{ props.product?.author }}
                    </div>
                    <div class="product-date">
                        Дата публикации:
                        {{
                            new Date(
                                Number(props.product?.date)
                            ).toLocaleString("ru-RU", {
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                            })
                        }}
                    </div>
                    <div class="product-line">
                        <div class="product-price">
                            {{ props.product?.price }}
                        </div>
                        <div class="product-category">
                            {{
                                categories.find(
                                    (i) => i.id == props.product?.category
                                )?.name
                            }}
                        </div>
                    </div>
                    <div class="product-description">
                        {{ props.product?.description }}
                    </div>
                </div>
                <div class="product-column-right">
                    <div class="product-image">
                        <swiper
                            :modules="[Thumbs, Virtual]"
                            :thumbs="{ swiper: thumbsSwiper }"
                            :slides-per-view="1"
                            :space-between="10"
                            class="main-slider"
                        >
                            <swiper-slide
                                v-for="(img, index) in props.product?.photos"
                                :key="index"
                                :virtualIndex="index"
                                class="main-slider__slide"
                            >
                                <img v-bind:src="img" />
                            </swiper-slide>
                        </swiper>
                        <div v-show="props.product?.photos.length > 1">
                            <swiper
                                :modules="[Thumbs, Virtual]"
                                watch-slides-progress
                                @swiper="setThumbsSwiper"
                                class="thumb-slider"
                                :space-between="10"
                                :slides-per-view="3"
                            >
                                <swiper-slide
                                    v-for="(img, index) in props.product
                                        ?.photos"
                                    :key="index"
                                    :virtualIndex="index"
                                    class="thumb"
                                >
                                    <img v-bind:src="img" />
                                </swiper-slide>
                            </swiper>
                        </div>
                    </div>
                    <p class="linkTo">Связаться с продавцом:</p>
                    <div class="product-socials">
                        <a
                            v-if="props.product?.socials.tg != ''"
                            :href="handleSocials('tg')"
                            class="product-social product-social--tg"
                            target="_blank"
                        >
                            <img
                                src="../assets/images/tg-product.svg"
                                alt="tg"
                            />
                        </a>
                        <a
                            :href="handleSocials('vk')"
                            class="product-social product-social--vk"
                            v-if="props.product?.socials.vk != ''"
                            target="_blank"
                        >
                            <img
                                src="../assets/images/vk-product.svg"
                                alt="vk"
                            />
                        </a>
                        <a
                            :href="handleSocials('wht')"
                            class="product-social product-social--wht"
                            v-if="props.product?.socials.wht != ''"
                            target="_blank"
                        >
                            <img
                                src="../assets/images/wht-product.svg"
                                alt="wht"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </template>
    </Modal>
</template>
<style scoped lang="scss">
@mixin adaptiv-font($pcSize, $mobSize, $width, $minWidth) {
    $addSize: $pcSize - $mobSize;
    $addMobSize: $addSize * 1.7;
    @media (max-width: #{$width + px}) {
        font-size: calc(
            #{$mobSize + px} + #{$addMobSize} *
                ((100vw - #{$minWidth + px}) / 1196)
        );
    }
}

* {
    color: #676767 !important;
}
.product-body {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    @media (max-width: 920px) {
        flex-direction: column;
    }
}
.product-column-left {
    max-width: 542px;
    display: flex;
    flex-direction: column;
    flex-grow: 2;
}

.product-author {
    margin-top: -35px;
    margin-bottom: 12px;
    font-weight: 700;
    font-size: 22px;
    @include adaptiv-font(22, 18, 920, 320);
}
.product-date {
    margin-bottom: 35px;
    font-weight: 700;
    font-size: 22px;
    @include adaptiv-font(22, 18, 920, 320);
}
.product-line {
    margin-bottom: 27px;
    column-gap: 20px;
    display: flex;
    justify-content: space-between;
    max-width: 542px;
}
.product-price {
    margin: 0;
    padding: 10px 60px 10px 20px;
    border-radius: 20px;
    background: url(../assets/images/rubl.svg) right 20px center no-repeat,
        #d9d9d9;
    @include adaptiv-font(22, 18, 920, 320);
}
.product-category {
    padding: 10px;
    border-radius: 20px;
    font-weight: 700;
    flex-grow: 1;
    flex-shrink: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #d9d9d9;
    @include adaptiv-font(22, 18, 920, 320);
}
.product-description {
    margin: 0;
    padding: 20px;
    line-height: 1.2;
    background: #d9d9d9;
    border-radius: 20px;
    font-weight: 700;
    font-size: 20px;
    text-align: justify;
    flex-grow: 1;
    @include adaptiv-font(20, 16, 920, 320);
}

.product-image {
    margin-bottom: 40px;
    width: 400px;
    max-width: 100%;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    @media (max-width: 470px) {
        width: 300px;
    }
}
.main-slider {
    margin-bottom: 16px;
    &__slide {
        width: 100%;
        height: 330px;
        border-radius: 20px;
        overflow: hidden;
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
}
.product-socials {
    display: flex;
    column-gap: 25px;
    align-items: center;
    justify-content: start;
    max-width: 317px;
    @media (max-width: 920px) {
        margin: 0;
    }
}
.linkTo {
    font-weight: 500;
    font-size: 20px;
    margin-bottom: 15px;
    @media (max-width: 920px) {
        font-size: calc(16px + 6.8 * ((100vw - 320px) / 1196));
    }
}
.product-social {
    cursor: pointer;
    display: block;
    text-decoration: none;
    padding: 10px;
    flex-grow: 1;
    border-radius: 20px;
    text-align: center;
    color: #fff;
    max-width: 89px;
}
.product-social--vk {
    background: #0077ff;
}
.product-social--tg {
    background: #2ca5e0;
}
.product-social--wht {
    background: #26d366;
    flex-grow: 4;
}
</style>
