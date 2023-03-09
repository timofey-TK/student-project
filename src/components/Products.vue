<script setup>
import { ref, onMounted, watch } from "vue";
import { HvrSlider } from "@/lib/hvrSlider";
import UseDatabase from "@/lib/UseDatabase";
import useAuthUser from "@/lib/UseAuthUser";
import { useToast as toast } from "vue-toastification";
import customSelect from "custom-select";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper";
import "@/lib/isotop.js";

const { products, getProducts, getCategories, categories, categorySelect } =
    UseDatabase();
const { user } = useAuthUser();

const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
};

function kitcut(text, limit) {
    text = text.trim().split(" ");

    if (text.length <= limit) return text.join(" ");
    text = text.slice(0, limit);

    return text.join(" ") + "...";
}

const searchInput = ref("");

watch(categorySelect, (cat) => {
    try {
        document.querySelector(
            ".products-section .custom-select-opener span"
        ).innerHTML = categories.value.find(
            (el) => el.id == categorySelect.value
        ).name;
        document
            .querySelector(".products-section .is-selected")
            .classList.remove("is-selected");
    } catch (err) {}
    filterProducts();
});
function filterProducts() {
    if (categorySelect.value == "user") {
        if (!user.value) {
            toast().warning("Для просмотра войдите в аккаунт!");
            return true;
        }
    }
    iso.arrange({
        filter: function (el) {
            if (categorySelect.value == "user") {
                return el.getAttribute("data-user") == user.value.id;
            }
            var category = el.getAttribute("data-category");
            return categorySelect.value == "*"
                ? true
                : categorySelect.value == category;
        },
    });
}
function searchProducts(e) {
    iso.arrange({
        filter: function (el) {
            var text =
                el.querySelector(".product-name").textContent.toLowerCase() +
                el
                    .querySelector(".product-description")
                    .textContent.toLowerCase();
            return text.includes(searchInput.value.toLowerCase());
        },
    });
}

const isEmpty = ref(true);
let iso;
onMounted(() => {
    getProducts().then(() => {
        setTimeout(() => {
            new HvrSlider(".images");
            iso = new Isotope("#products", {
                itemSelector: ".product-card",
                getSortData: {
                    date: "[data-date]",
                },
                sortBy: "date",
                sortAscending: false,

                layoutMode: "masonry",
                masonry: {
                    fitWidth: true,
                    columnWidth: ".product-card",
                    gutter: 35,
                },
            });
        }, 200);
        isEmpty.value = false;
    });
    getCategories().then(() => {
        customSelect(document.querySelector(".select-products"));
        customSelect(document.querySelector(".select-products-modal"));
        const smoothLinks = document.querySelectorAll(".smooth");
        for (let smoothLink of smoothLinks) {
            smoothLink.addEventListener("click", function (e) {
                e.preventDefault();
                const id = smoothLink.getAttribute("href");
                document.querySelector(id).scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            });
        }
    });
});
</script>
<template>
    <section class="products-section" id="products-section">
        <div class="products-ui">
            <input
                placeholder="поиск..."
                type="text"
                v-model="searchInput"
                class="search"
                @input="searchProducts(e)"
            />
            <select class="select-products" v-model="categorySelect">
                <option value="*">Все товары</option>
                <option value="user">Мои товары</option>
                <option
                    :value="category.id"
                    v-for="(category, index) in categories"
                    :key="index"
                >
                    {{ category.name }}
                </option>
            </select>
        </div>
        <Transition name="fade">
            <div class="products-skeleton" v-show="isEmpty">
                <div class="product-skeleton-card">
                    <div class="image skeleton"></div>
                    <div class="text">
                        <div class="name skeleton"></div>
                        <div class="price skeleton"></div>
                    </div>
                </div>
                <div class="product-skeleton-card">
                    <div class="image skeleton"></div>
                    <div class="text">
                        <div class="name skeleton"></div>
                        <div class="price skeleton"></div>
                    </div>
                </div>
                <div class="product-skeleton-card">
                    <div class="image skeleton"></div>
                    <div class="text">
                        <div class="name skeleton"></div>
                        <div class="price skeleton"></div>
                    </div>
                </div>

                <div class="product-skeleton-card">
                    <div class="image skeleton"></div>
                    <div class="text">
                        <div class="name skeleton"></div>
                        <div class="price skeleton"></div>
                    </div>
                </div>
                <div class="product-skeleton-card">
                    <div class="image skeleton"></div>
                    <div class="text">
                        <div class="name skeleton"></div>
                        <div class="price skeleton"></div>
                    </div>
                </div>
                <div class="product-skeleton-card">
                    <div class="image skeleton"></div>
                    <div class="text">
                        <div class="name skeleton"></div>
                        <div class="price skeleton"></div>
                    </div>
                </div>
            </div>
        </Transition>
        <Transition name="fade">
            <div id="products" v-show="!isEmpty">
                <div
                    class="product-card"
                    v-for="product in products"
                    :key="product.id"
                    :data-date="product.date"
                    :data-category="product.category"
                    :data-name="product.name"
                    :data-user="product.user"
                >
                    <swiper
                        :modules="[Navigation, Pagination]"
                        :slides-per-view="1"
                        :space-between="10"
                        navigation
                        :pagination="{ clickable: true }"
                        class="product-card__images"
                        v-if="product.photos.length > 1"
                    >
                        <swiper-slide
                            v-for="(src, index) in product.photos"
                            :key="index"
                            :virtualIndex="index"
                        >
                            <img v-bind:src="src" alt="preview" />
                        </swiper-slide>
                    </swiper>
                    <div class="image" v-else>
                        <img v-bind:src="product.photos[0]" alt="preview" />
                    </div>
                    <div class="product-text">
                        <p class="product-name">{{ product.name }}</p>
                        <p class="product-price">{{ product.price + "₽" }}</p>
                        <p class="product-description">
                            {{ kitcut(product.description, 25) }}
                        </p>
                        <div class="card-bottom">
                            <p class="product-author">{{ product.author }}</p>
                            <p class="product-date">
                                {{
                                    new Date(
                                        Number(product.date)
                                    ).toLocaleString("ru-RU", options)
                                }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </section>
</template>
<style lang="scss">
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

.product-card__images {
    &:hover {
        .swiper-button-next,
        .swiper-button-prev {
            opacity: 0.7;
        }
    }
    @media (max-width: 800px) {
        .swiper-button-next,
        .swiper-button-prev {
            display: none;
        }
    }
    border-radius: 30px;
    height: 250px;
    margin-bottom: 10px;
    position: relative;
    img {
        image-rendering: crisp-edges;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .swiper-pagination {
        position: absolute;
        bottom: 10px;
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        gap: 5px;
        z-index: 1;
        &-bullet {
            cursor: pointer;
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 100%;
            border: 2px solid #fff;
            &-active {
                background: #fff;
            }
        }
    }

    .swiper-button-next,
    .swiper-button-prev {
        position: absolute;
        cursor: pointer;
        width: 40px;
        height: 40px;
        z-index: 1;
        top: 50%;
        transform: translateY(-50%);
        opacity: 0;
        transition: opacity ease 0.3s;
        &:hover {
            opacity: 0.9;
        }
    }
    .swiper-button-disabled {
        opacity: 0 !important;
        cursor: auto;
    }
    .swiper-button-next {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' style='fill: rgba(255, 255, 255, 1);transform: ;msFilter:;'%3E%3Cpath d='M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z'%3E%3C/path%3E%3C/svg%3E");
        right: 0;
    }
    .swiper-button-prev {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' style='fill: rgba(255, 255, 255, 1);transform: ;msFilter:;'%3E%3Cpath d='M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z'%3E%3C/path%3E%3C/svg%3E");
        left: 0;
    }
}
.product-card .image {
    border-radius: 30px;
    height: 250px;
    margin-bottom: 10px;
    position: relative;
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.products-skeleton {
    max-width: 1200px;
    width: 100%;
    @media (max-width: 1250px) {
        justify-content: center;
    }
    @media (max-width: 400px) {
        position: relative;
    }
    display: flex;
    gap: 35px;
    position: absolute;
    flex-wrap: wrap;
}
.product-skeleton-card {
    width: 360px;
    max-width: 100%;
    box-sizing: border-box;
    background: #dddbdd;
    margin-bottom: 35px;
    border-radius: 30px;
    padding: 10px;
    overflow: hidden;
    .image {
        border-radius: 30px;
        width: 100%;
        height: 230px;
        background: #a9a9a9;
    }
    .text {
        padding: 15px;
    }
    .name,
    .price {
        height: 30px;
        background: #a9a9a9;
        margin-top: 20px;
        border-radius: 10px;
    }
    .name {
        width: 90%;
    }
    .price {
        width: 40%;
    }
}

.products-ui {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    margin: 20px 0;
    align-items: center;
    @media (max-width: 807px) {
        justify-content: center;
        gap: 15px;
    }
}
.search {
    background: url(../assets/images/search.svg) 20px center no-repeat, #fff;
    box-sizing: border-box;
    padding: 14px 0 14px 80px;
    border: 4px solid #009f81;
    border-radius: 20px;
    font-weight: 700;
    font-size: 26px;
    @include adaptiv-font(26, 18, 720, 375);
}
.authorization-modal .customSelect {
    margin-bottom: 25px;
    background: url(../assets/images/down-arrow.svg) right 20px center no-repeat,
        #d9d9d9;
    border-radius: 20px;
    color: #676767;
    .custom-select-opener {
        padding: 20px;
    }
    .custom-select-panel {
        background-color: #bdbdbd;
    }
    .custom-select-option:hover,
    .custom-select-option.is-selected {
        background-color: #d9d9d9;
    }
}
.customSelect {
    z-index: 10;
    background: url(../assets/images/down-arrowWhite.svg) left 20px center
            no-repeat,
        #009f81;
    border-radius: 20px;
    font-weight: 700;
    font-size: 24px;
    color: #fff;
    cursor: pointer;
    width: 310px;
    max-width: 100%;
    transition: border-radius 0.3s ease;
    @media (max-width: 720px) {
        font-size: calc(16px + 27.2 * ((100vw - 320px) / 1196));
    }
}
.select-products {
    padding: 20px 20px 20px 60px;
    width: 310px;
    max-width: 100%;
    background: url(../assets/images/down-arrowWhite.svg) left 20px center
            no-repeat,
        #009f81;
    border-radius: 20px;
    appearance: none;
    font-weight: 700;
    font-size: 24px;
    color: #fff;
    cursor: pointer;
}
option {
    padding: 0;
}
.products-section {
    position: relative;
    overflow-x: hidden;
    min-height: 100vh;
    padding: 0 calc(50% - 600px);
    @media (max-width: 1250px) {
        padding: 0 20px;
    }
}
#products {
    @media (max-width: 1250px) {
        margin: 0 auto;
    }
    width: 100%;
    overflow: hidden;
}
.product-card {
    background: #009f81;
    border-radius: 30px;
    width: 362px;
    max-width: 100%;
    padding: 8px;
    overflow: hidden;
    height: fit-content;
    margin-bottom: 35px;
}

.product-text {
    color: #fff;
    padding: 0 13px;
}
.product-name {
    margin-bottom: 5px;
    font-weight: 800;
    font-size: 26px;
}
.product-price {
    margin-bottom: 8px;
    font-weight: 700;
    font-size: 24px;
}
.product-description {
    margin-bottom: 16px;
    font-weight: 500;
    font-size: 16px;
}
.card-bottom {
    display: flex;
    justify-content: space-between;
}
.product-date,
.product-author {
    font-weight: 700;
    font-size: 16px;
    color: #d9d9d9;
}

.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}
</style>
