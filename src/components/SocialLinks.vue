<template lang="pug">
    ul.social-links
        li.social-links__item: a.social-links(:href="link" target="blank"): base-icon.social-links__icon(:name="name")
        //li.social-links__item: a.social-links(:href="link" target="blank"): base-icon.social-links__icon(name="tg")
            li.social-links__item: a.social-links(:href="link" target="blank"): base-icon.social-links__icon(name="fbme")
            li.social-links__item: a.social-links(:href="link" target="blank"): base-icon.social-links__icon(name="chat")
</template>

<script>
export default {
    props: {
        link: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss">
.social-links {
    display: flex;
    align-items: center;

    .icon {
        width: 24px;
        height: 24px;
        margin: 0 calc-em(2);
    }
}
</style>
