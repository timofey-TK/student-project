<script setup>
import { onMounted } from "vue";
import Products from "@/components/Products.vue";
import Header from "@/components/Header.vue";
</script>

<template>
    <Header />
    <Products />
</template>

<style lang="scss">
body {
    overflow-x: hidden;
}
body::-webkit-scrollbar {
    width: 12px; /* ширина scrollbar */
}
body::-webkit-scrollbar-track {
    background: #d9d9d9; /* цвет дорожки */
}
body::-webkit-scrollbar-thumb {
    background-color: #545454; /* цвет плашки */
    border-radius: 20px; /* закругления плашки */
}
body {
    scrollbar-width: thin; /* "auto" или "thin"  */
    scrollbar-color: #545454 #d9d9d9; /* плашка скролла и дорожка */
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.skeleton {
    position: relative;
    overflow: hidden;
    &::after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        background-image: linear-gradient(
            90deg,
            rgba(#fff, 0) 0,
            rgba(#fff, 0.2) 20%,
            rgba(#fff, 0.5) 60%,
            rgba(#fff, 0)
        );
        animation: shimmer 2s infinite;
        content: "";
    }

    @keyframes shimmer {
        100% {
            transform: translateX(100%);
        }
    }
}
</style>
