<template lang="pug">
    form.files-board
        fieldset(v-if="name=='smiles'")
            legend.files-board__text-only-scr Выберите смайл
            .files-board__board
                smile-picker(
                    :native="true",
                    @select="addSmile",
                    :perLine="30",
                    :showPreview="false",
                    :i18n={search:'Поиск'}
                    )
        fieldset(v-if="name=='gifs'")
            legend.files-board__text-only-scr Выбирите гифку
            .files-board__search
                base-field(type="search" theme="soft")
            .files-board__board
                | тут будут гифки = )
</template>

<script>
    const EmojiMartVue = () => import('emoji-mart-vue')


export default {
    components: {
        'smile-picker': EmojiMartVue.Picker
    },
    props: {
        name: {
            type: String,
            default: 'smiles',
            validator: function(value) {
                return ['smiles', 'gifs'].indexOf(value) !== -1
            }
        }
    },
    data() {
        return {}
    },
    computed: {},
    methods: {
        addSmile(val) {
            this.$emit('getSmile', val)
        }
    }
}
</script>

<style lang="scss">
.files-board {
    .emoji-mart {
        width: 100% !important;
    }
    &__search {
        width: 275px;
        margin-bottom: calc-em(20);
    }
    &__text-only-scr {
        @extend %visuallyhidden;
    }
}
</style>
