<script setup>
import { ref, onMounted, onUpdated } from "vue";
import { HvrSlider } from "@/lib/hvrSlider";
import AuthComponent from "@/components/Auth.vue";
import AddProductModal from "@/components/AddProductModal.vue";
import UseDatabase from "@/lib/UseDatabase";
import Isotope from "isotope-layout";

const { products, getProducts, getCategories, categories, isProductsLoaded } =
    UseDatabase();
function once(fn, context) {
    var result;
    return function () {
        if (fn) {
            result = fn.apply(context || this, arguments);
            fn = null;
        }
        return result;
    };
}
var InitIsotope = once(function () {
    var iso = new Isotope("#products", {
        itemSelector: ".product-card",
        layoutMode: "masonry",
        sortBy: "date",
        sortAscending: false,
        getSortData: {
            date: "[data-date]",
        },
    });
});
onMounted(() => {
    getProducts();
    getCategories();
});
// Подключение слайдера для карточек товараов
onUpdated(() => {
    new HvrSlider(".images");
    if (isProductsLoaded()) {
        InitIsotope();
    }
});

// Модальные окна
let ShowAddProduct = ref(false);
</script>

<template>
    <AuthComponent />
    <AddProductModal v-show="ShowAddProduct" @close="ShowAddProduct = false" />

    <button @click="ShowAddProduct = true">Добавить новый товар</button>

    <div id="products">
        <div
            class="product-card"
            v-for="product in products"
            :key="product.id"
            :data-date="product.date"
        >
            <p>{{ product.name }}</p>
            <p>{{ product.price }}</p>
            <p>{{ product.description }}</p>
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
</template>

<style lang="scss">
.product-card {
    border: 1px solid black;
    margin: 20px;
    width: 30%;
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
/* обязательные стили (слайдер картинок для карточек товаров)*/
.hvr__images {
    position: relative;
    width: 200px;
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
</style>
