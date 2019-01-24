<template lang="pug">
    article.chat-dialog
        aside.chat-page__last-messages
                the-last-messages.chat-page__padding
        main.chat-page__main
                the-chat-main
        footer.chat-page__info.chat-page__padding
            the-client-info

</template>

<script>
    import TheLastMessages from '@/components/TheLastMessagess';
    import TheClientInfo from '@/components/TheClientInfo';
    import TheChatMain from '@/components/TheChatMain';
    export default {
        components: {
            TheChatMain,
            TheLastMessages,
            TheClientInfo,


        },
    }
</script>

<style lang="scss">
    .chat-dialog {
        flex-direction:row;
    }
</style>