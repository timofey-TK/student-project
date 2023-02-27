<script setup>
const emits = defineEmits(["close-modal"]);
</script>
<template>
    <Transition name="fade">
        <div class="modal-overlay" @click="$emit('close-modal')">
            <div class="modal" @click.stop>
                <button class="close" @click="$emit('close-modal')">
                    <img class="close" src="@/assets/images/cross.svg" alt="" />
                </button>
                <slot></slot>
            </div>
        </div>
    </Transition>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
.modal-overlay {
    z-index: 100;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000000bb;
    cursor: pointer;
}

.modal {
    z-index: 200;
    background-color: white;
    width: 500px;
    cursor: auto;
}
.close {
    cursor: pointer;
}
</style>
