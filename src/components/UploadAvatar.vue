<template lang="pug">
    button.upload-avatar(type="button")
        base-avatar(width="lg").upload-avatar__avatar
        .upload-avatar__text Загрузить фото
        base-btn.upload-avatar__icon(:icon="{name:'down'}")
</template>

<script>
    export default {}
</script>

<style lang="scss">
    .upload-avatar{
        border:0;
        padding:0;
        background:none;
        display:flex;
        align-items:center;

        &:hover &__text{text-decoration:none}

        &__text{
            transition:$glob-trans;
            text-decoration:underline;
            font-size:$glob-font-size_h2;
            margin-left:calc-em(15);
            margin-right:calc-em(10);
        }

        &__icon {
            .icon {
                width:35px;
                height:35px;
            }
        }

    }
</style>