<script setup>
import { ref, onMounted, onUpdated } from "vue";
import { HvrSlider } from "@/lib/hvrSlider";
import UseDatabase from "@/lib/UseDatabase";
import Filterizr from "filterizr";

const { products, getProducts, getCategories, categories } = UseDatabase();

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

const categorySelect = ref("0"),
    searchInput = ref("");

function filterProducts(e) {
    filterizr.filter(categorySelect.value);
}
function searchProducts(e) {
    filterizr.search(searchInput.value);
}

let filterizr;
onMounted(() => {
    getProducts().then(() => {
        new HvrSlider(".images");
        filterizr = new Filterizr("#products", {
            layout: "sameWidth",
            gridItemsSelector: ".product-card",
            gutterPixels: 25,
            spinner: {
                // Configuration for built-in spinner
                enabled: true,
                fillColor: "#2184D0",
                styles: {
                    height: "75px",
                    margin: "0 auto",
                    width: "75px",
                    "z-index": 2,
                },
            },
        });
    });
    getCategories();
});
const isEmpty = ref(false);
onUpdated(() => {
    isEmpty.value = document.querySelector("#products").style.height == "0px";
});
</script>
<template>
    <section class="products-section">
        <div class="products-ui">
            <input
                type="text"
                v-model="searchInput"
                class="search"
                @input="searchProducts(e)"
            />
            <select v-model="categorySelect" @change="filterProducts(e)">
                <option value="0" disabled>Категория</option>
                <option
                    :value="category.id"
                    v-for="(category, index) in categories"
                    :key="index"
                >
                    {{ category.name }}
                </option>
            </select>
        </div>
        <div id="products">
            <div
                class="product-card"
                v-for="product in products"
                :key="product.id"
                :data-date="product.date"
                :data-category="product.category"
                :data-name="product.name"
            >
                <p>{{ product.name }}</p>
                <p>{{ product.price }}</p>
                <p>
                    {{
                        categories.find((el) => el.id == product.category).name
                    }}
                </p>
                <p class="clamp">{{ kitcut(product.description, 25) }}</p>
                <p>
                    {{
                        new Date(Number(product.date)).toLocaleString(
                            "ru-RU",
                            options
                        )
                    }}
                </p>
                <div class="images">
                    <img
                        v-bind:src="src"
                        alt="preview"
                        v-for="(src, index) in product.photos"
                        :key="index"
                    />
                </div>
            </div>
        </div>
    </section>
</template>
<style lang="scss">
.products-ui {
    display: flex;
    gap: 30px;
    margin: 20px;
    align-items: center;
}
.search {
    height: 50px;

    background: #cacaca;
    padding: 10px;
}
.products-section {
    min-height: 50vh;
}

.product-card {
    background: #009f81;
    border-radius: 30px;
    width: 362px;
    padding: 7px;
    overflow: hidden;
    height: fit-content;
}
/* обязательные стили (слайдер картинок для карточек товаров)*/
.hvr__dots {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    position: relative;
    top: -20px;
}
.hvr__dot {
    width: 10px;
    height: 10px;
    border-radius: 100%;
    border: 2px solid #fff;
}
.hvr__dot--active {
    background: #fff;
}
.hvr {
    width: 200px;
    position: relative;
}
.hvr__images {
    position: relative;
    width: 100%;
}
.hvr__sectors {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
}
.hvr__sector {
    flex-grow: 1;
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
.images img {
    object-fit: cover;
    width: 100%;
    height: 100%;
}
.images {
    width: 200px;
    height: 200px;
    overflow: hidden;
}
</style>
