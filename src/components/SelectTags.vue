<template lang="pug">
    form.select-tags
        base-wait(name="pageTags")
        fieldset.select-tags__box
            legend.select-tags__title Выберите тэг
            .select-tags__controls
                base-filter-search.select-tags__controls-search(
                    :item-list="itemList",
                    @result="(val)=>filterSearchResult=val",
                    field-name="tag"
                )

                action-list.select-tags__controls-scrollbar(
                    :title="true"
                    text-line="2"
                    key="tags-list",

                    :item-list="filterSearchResult"
                    name="tags"
                    name-field-text="tag"
                    name-field-value="id"
                    v-model="model"
                )
            .select-tags__coment-wrap(v-if="$store.getters['user/isRole'](['admin', 'owner', 'operatorSenior'])")
                label.select-tags__label Оставьте комментарий
                base-field.select-tags__coment(
                    type="textarea"
                    name="comment",

                    maxLength="5000"
                    v-model="comment"
                )

</template>

<script>
import ActionList from '@/components/ActionList'
import { httpParams } from '@/mixins/mixins'
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'SelectTags',
    components: {
        ActionList
    },
    mixins: [httpParams],
    data() {
        return {
            comment: null,
            model: '',
            filterSearchResult: []
        }
    },
    computed: {
        ...mapGetters('tags', ['itemList'])
    },
    watch: {
        model(val) {
            if (val) {
                let data = this.httpParams.params
                data.tag_id = +val
                data.comment = this.comment
                this.setTagChat(data)
                this.$root.$emit('globBoxControlClose', data.tag_id)
            }
        }
    },
    created() {
        /*  setTimeout(()=>{
            this.$wait.start('pageTags');
        },1000)*/
    },
    methods: {
        ...mapActions('tags', ['setTagChat'])
    }
}
</script>

<style lang="scss">
.select-tags {
    $el: '.select-tags';
    $color_hover: glob-color('info-lighten');
    $transition: $glob-trans;
    position: relative;

    text-align: left;

    width: 100%;
    max-width: 415px;

    &__coment-wrap {
        margin-top: 5em;
    }

    &__label,
    &__coment {
        margin-bottom: calc-em(15);
    }

    &__box {
        min-width: 0;
    }

    .action-list {
        &__text {
            padding: calc-em(2) 0;
            border: 0;
            & {
                max-height: 2.6em; /* exactly three lines */
            }
            position: relative;
            @extend %text-truncate;
        }
    }

    &__title {
        text-align: left;
        margin-bottom: 2em;
    }

    &__controls {
        &-scrollbar {
            margin-right: -1 * calc-em(15);
            padding-right: calc-em(15);
            max-height: 75vh;
        }
        &-search {
            margin-bottom: calc-em(15);
            max-width: 244px;
        }
    }
}
</style>
