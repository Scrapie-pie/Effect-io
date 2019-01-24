<template lang="pug">
    section.no-found

        .no-found__content(v-if="name=='team'")
            base-icon.no-found__icon(name="team")
            p.no-found__text.
                Вы – единственный сотрудник. Пригласите коллег, чтобы они так же смогли обрабатывать заявки от клиентов. #[br]
                Так же вы сможете общаться как отдельно с каждым сотрудником, так и в общем совместном чате.
            p: base-btn() Добавить сотрудника

        .no-found__content(v-if="name=='visitors'")
            base-icon.no-found__icon(name="visitors")
            p.no-found__text.
                Здесь будут отображаться посетители из всех каналов (сайт, социальные сети, мессенджеры).#[br]
                Вы сможете самостоятельно начать диалог с любым из них.

</template>

<script>
    export default {
        props:{
            name:''
        }
    }
</script>

<style lang="scss">
    .no-found {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
        width:100%;
        padding-left:calc-em(15);
        padding-right:calc-em(15);
        text-align:center;

        &__content {

        }
        &__text {
            margin-bottom:calc-em(30);
            line-height:1.5;
        }
        &__icon .icon {
            height:calc-em(100);
            width:calc-em(100);
        }
    }
</style>