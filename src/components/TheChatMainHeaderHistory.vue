<template lang="pug">
    ul.client-history
        li.client-history__item
            |На страницу - https://effect.com/
        li.client-history__item
            | На страницу - Effect.com - феноменальный подход к общению с клиентами на сайте (https://effect.com/)
        li.client-history__item
            | Заказал звонок
        li.client-history__item
            |Написал в чат
</template>

<script>
    export default {

    }
</script>

<style lang="scss">
    .client-history {
        &__item {
            &+& {
                margin-top:calc-em(15);
            }
        }
    }


</style>