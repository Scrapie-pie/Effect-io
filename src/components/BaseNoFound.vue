<template lang="pug">
    section.no-found

        .no-found__content(v-if="getName=='team'")
            base-icon.no-found__icon.no-found__icon_team(name="no-found-team")
            p.no-found__text.
                Вы – единственный сотрудник. Пригласите коллег, чтобы они так же смогли обрабатывать заявки от клиентов. #[br]
                Так же вы сможете общаться как отдельно с каждым сотрудником, так и в общем совместном чате.
            p: slot(name="team-content")


        .no-found__content(v-if="getName=='visitors'")
            base-icon.no-found__icon(name="no-found-visitors")
            p.no-found__text.
                Здесь будут отображаться посетители из всех каналов (сайт, социальные сети, мессенджеры).#[br]
                Вы сможете самостоятельно начать диалог с любым из них.

        .no-found__content(v-if="getName=='messageAll'")
            base-icon.no-found__icon(name="no-found-messages")
            p.no-found__text.
                Здесь будут отображаться все диалоги, которые Вы ведете с клиентами из различных каналов (сайт, социальные сети, мессенджеры).


        .no-found__content(v-if="getName=='processAll'")
            base-icon.no-found__icon(name="no-found-messages")
            p.no-found__text.
                Здесь будут отображаться сообщения, которые посетители напишут Вам из разных каналов (сайт, социальные сети, мессенджеры). #[br]
                Чтобы проверить как это работает, напишите в чат на сайте, на который Вы установили Effect.

        .no-found__content(v-if="getName=='search'")
            base-icon.no-found__icon(name="no-found-search")
            p.no-found__text.
                По вашему запросу ничего не найдено =(



</template>

<script>
export default {
    props: {
        name: {
            type: String,
            default: ''
        }
    },
    computed: {
        getName() {
            if (this.$route.name === 'processAll') return this.$route.name
            else return this.name
        }
    }
}
</script>

<style lang="scss">
.no-found {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    width: 100%;
    padding-left: calc-em(15);
    padding-right: calc-em(15);
    text-align: center;

    &__content {
    }
    &__text {
        margin-bottom: calc-em(30);
        line-height: 1.5;
    }

    &__icon {
        .icon {
            height: calc-em(100);
            width: calc-em(100);
        }
        &_team {
            margin-bottom: calc-em(10);
        }
    }
}
</style>
