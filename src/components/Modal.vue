<script setup>
const emits = defineEmits(["close-modal"]);
</script>
<template>
    <Transition name="fade">
        <div class="authorization-modal">
            <div class="authorization-modal-window">
                <div class="authorization-modal-line">
                    <h2><slot name="title"></slot></h2>
                    <button
                        class="authorization-modal-close"
                        @click="$emit('close-modal')"
                    >
                        <svg
                            width="36"
                            height="36"
                            viewBox="0 0 36 36"
                            fill="white"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M30.9344 0L17.675 13.2563L4.41875 0L0 4.41875L13.2562 17.675L0 30.9313L4.41875 35.35L17.675 22.0938L30.9344 35.35L35.3531 30.9313L22.0969 17.675L35.3531 4.41875L30.9344 0Z"
                            />
                        </svg>
                    </button>
                </div>
                <slot name="body"></slot>
            </div>
            <div class="overlay" @click="$emit('close-modal')"></div>
        </div>
    </Transition>
</template>

<style lang="scss">
.close {
    cursor: pointer;
}

.authorization-modal {
    will-change: opacity;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    padding-top: 20px;
    padding-bottom: 5px;
    overflow-y: auto;
}
.overlay {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    background-color: #00000089;
    cursor: pointer;
}

.authorization-modal::-webkit-scrollbar {
    width: 0;
}

.authorization-modal-close {
    width: 70px;
    height: 70px;
    border-radius: 100%;
    background: #009f81;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background ease 0.3s;
}
.authorization-modal-close:hover {
    background: none;
    border: 4px solid #009f81;
}
.authorization-modal-close:hover svg {
    fill: #009f81;
}

@media (max-width: 530px) {
    .authorization-modal-close {
        width: 40px;
        height: 40px;
    }
    .authorization-modal-close svg {
        width: 20px;
        height: 20px;
    }
}

.authorization-modal-window {
    position: relative;
    z-index: 20;
    margin: 0 20px;
    padding: 40px;
    background-color: #ffffff;
    border-radius: 40px;
    -ms-flex-preferred-size: 1137px;
    flex-basis: 1137px;
    cursor: auto;
    overflow-y: auto;
    max-height: 99%;
    @media (min-width: 1000px) {
        &::-webkit-scrollbar {
            display: none;
        }
        -ms-overflow-style: none; /* Internet Explorer 10+ */
        scrollbar-width: none; /* Firefox */
    }
    @media (max-width: 800px) {
        border-radius: 30px;
    }
}

@media (max-width: 500px) {
    .authorization-modal-window {
        padding: 20px;
    }
}

.authorization-modal-line {
    margin-bottom: 60px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    overflow-y: auto;
}

@media (max-width: 900px) {
    .authorization-modal-line {
        margin-bottom: calc(40px + 119 * ((100vw - 320px) / 1196));
    }
}

.authorization-modal-line h2 {
    font-weight: 700;
    font-size: 48px;
    line-height: 59px;
    color: #000000;
}

@media (max-width: 720px) {
    .authorization-modal-line h2 {
        font-size: calc(24px + 40.8 * ((100vw - 320px) / 1196));
        line-height: 40px;
    }
}

.input-block {
    margin-bottom: 55px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
}

@media (max-width: 740px) {
    .input-block {
        margin-bottom: calc(35px + 34 * ((100vw - 320px) / 1196));
    }
}

.input-block input {
    padding: 14px 14px 14px 50px;
    background: #d9d9d9;
    border-radius: 20px;
    max-width: 572px;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
}

@media (max-width: 600px) {
    .input-block input {
        max-width: 400px;
    }
}

@media (max-width: 512px) {
    .input-block input {
        max-width: 320px;
        padding: 14px 14px 14px 28px;
    }
}

.input-block input[type="email"] {
    font-family: inherit;
    font-weight: 700;
    font-size: 32px;
}

@media (max-width: 720px) {
    .input-block input[type="email"] {
        font-size: calc(16px + 27.2 * ((100vw - 320px) / 1196));
    }
}

.input-block input[type="text"],
.input-block input[type="password"] {
    font-family: inherit;
    font-weight: 700;
    font-size: 32px;
}

@media (max-width: 720px) {
    .input-block input[type="text"] {
        font-size: calc(16px + 27.2 * ((100vw - 320px) / 1196));
    }
}

@media (max-width: 720px) {
    .input-block input[type="password"] {
        font-size: calc(16px + 27.2 * ((100vw - 320px) / 1196));
    }
}

.authorization-modal-btn {
    max-width: 100%;
    margin: 0 auto;
    padding: 16px 45px;
    display: block;
    font-weight: 700;
    font-size: 24px;
    color: #fff;
    background: #009f81;
    border-radius: 20px;
    @media (max-width: 440px) {
        font-size: 20px;
    }
    @media (max-width: 385px) {
        font-size: 18px;
    }
}
</style>
