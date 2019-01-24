<template lang="pug">
    form.files-board
        fieldset(v-if="name=='smiles'")
            legend.files-board__text-only-scr Выберите смайл
            .files-board__search
                base-field(type="search" theme="soft")
            .files-board__board
                | тут будут смайлы = )
        fieldset(v-if="name=='gifs'")
            legend.files-board__text-only-scr Выбирите гифку
            .files-board__search
                base-field(type="search" theme="soft")
            .files-board__board
                | тут будут гифки = )
</template>

<script>
    export default {
        props:{
            name:{
                type:String,
                validator: function (value) {
                    return ['smiles', 'gifs'].indexOf(value) !== -1
                }
            }
        }
    }
</script>

<style lang="scss">
    .files-board {
        &__search {
            width:275px;
            margin-bottom:calc-em(20);
        }
        &__text-only-scr {
            @extend %visuallyhidden
        }
    }
</style>