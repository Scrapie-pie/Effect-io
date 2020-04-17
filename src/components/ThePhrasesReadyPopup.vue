<template lang="pug">
    form.phrases-ready(@submit.prevent="submit", :class="{'phrases-ready_is-absolute':isAbsolute}")
        base-wait(name="phrasesReady")
        transition(name="fade" mode="out-in")
            .phrases-ready__wrap
                .phrases-ready__filter
                    .phrases-ready__filter-item
                        base-filter-search(:item-list="snippetsStore", @result="(val)=>filterSearchResult=val", field-name="text")
                .phrases-ready__text-only-scr Готовый список фраз
                .phrases-ready__inner
                    .phrases-ready__catalog.phrases-ready__fieldset
                        legend.phrases-ready__name Категория
                        scroll-bar.phrases-ready__phrases-scroll-bar
                            ul.phrases-ready__phrases
                                li.phrases-ready__phrases-item(
                                v-for="(item, index) in categories",
                                :key="index",
                                :class="{active:item.id===categoriesSelectId}"
                                )
                                    base-btn(theme="text", @click="categoriesSelect(item.id)").phrases-ready__phrases-text(v-text="item.titleAndUrl", :title="item.titleAndUrl")
                    .phrases-ready__phrases-wrap.phrases-ready__fieldset
                        legend.phrases-ready__name Фраза
                        scroll-bar.phrases-ready__scrollbar.phrases-ready__scrollbar_phrases
                            ul.phrases-ready__phrases
                                li.phrases-ready__phrases-item(
                                    v-for="(item, index) in snippets",
                                    :key="index"
                                )
                                    base-btn(theme="text", @click="selectText(item)").phrases-ready__phrases-text(v-text="item.text", :title="item.text")
</template>

<script>
import ActionList from '@/components/ActionList'
import FilterDropMenu from '@/components/FilterDropMenu'

export default {
    components: {
        FilterDropMenu,
        ActionList
    },
    props: {
        isAbsolute:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            filterSearchResult:[],
            categoriesSelectId: ''
        }
    },
    computed: {
        snippets() {
            return this.filterSearchResult.filter(
                item => item.category_id === Number(this.categoriesSelectId)
            )
        },
        snippetsStore() {
            if(this.$route.params.site_id) return this.$store.state.phrases.use.snippets
            return []
        },
        categories() {
            let list = this.$store.getters['phrases/categoriesUse']
            return list
        }
    },
    watch: {
        categories: {
            handler(val) {
                if (val.length) {
                    this.categoriesSelectId = val[0].id
                }
            },
            immediate: true
        }
    },
    created() {},
    methods: {

        categoriesSelect(id) {
            this.categoriesSelectId = id
        },
        selectText(val) {

            this.$store.commit('phrases/setSelectSnippetId',val.id)
            this.$emit('resultText', val.text)
            this.$root.$emit('globBoxControlClose')
        },




    }
}
</script>

<style lang="scss">
.phrases-ready {
    $color-border: glob-color('info');
    $color-bg: glob-color('info-lighten');
    $transition: $glob-trans;

    $color-text: glob-color('secondary');
    $color-error: glob-color('error');

    $space: $glob-space;

    $padding: calc-em(8) calc-em(26);


    &_is-absolute {
        max-height:70vh;
    }

    &,&__wrap {
        display:flex;
        flex-direction:column;
        height:100%;
        min-height: 0;
        min-width:0;
    }

    &__wrap,
    &__phrases-wrap {
        min-width: 0;
    }

    &__scrollbar {
        max-height: 67.5vh;
        margin-left: (calc-em(26) * -1);

        &_phrases {
            margin-left: -(calc-em(15));
            padding-left: calc-em(15);
        }
    }

    &__inner {
        display: grid;
        grid-template-columns: min-content 1fr;
        grid-template-rows: 100%;
        grid-gap: calc-em(15);
        min-height: 0;
        min-width: 0;

        @include media($width_md) {
            grid-template-columns: 1fr 1fr;

        }
    }

    &__fieldset {
        overflow: hidden;
        display:flex;
        flex-direction:column;
    }

    &__list {
    }



    &__catalog {
        flex: 0 0 auto;

        width: 100%;
        min-width: 0;
    }

    &__phrases-button {
        padding-left: calc-em(35);
        @include media($width_xl) {
            padding-left: 0;
        }
    }
    &__phrases-remove {
        color: $color_error;
    }

    &__phrases-wrap {
        width: 100%;
    }
    &__phrases {


        &-scroll-bar {

            height:100%;
            overflow:auto;
        }
    }

    &__phrases-item {
        display: flex;

        align-items: center;
        padding: $padding;
        padding-left: calc-em(10);
        transition: $transition;
        &.active,
        &:hover {
            background-color: $color-bg;
        }
        @include media($width_md) {
            flex-wrap:wrap;
            align-items: inherit;

        }
    }
    &__phrases-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &__phrases-controls {
        display: flex;
        align-items: center;
        margin-left: auto;

        @include media($width_xl) {
            flex-direction: column;
            align-items: flex-end;
            padding-left: calc-em(15);
        }
        @include media($width_md) {
            width:100%;
            align-items: inherit;
            padding-left: 0;
            margin-left:0;
        }
    }

    &__text-only-scr {
        @extend %visuallyhidden;
    }

    &__label {
        font-weight: bold;
        margin-bottom: calc-em(20);
    }
    &__name {
        font-weight: bold;
        margin-bottom: calc-em(50);
    }

    &__filter {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        @extend %row-flex;

        &-item {
            @extend %row-flex-col;
            margin-bottom: calc-em(35);
        }
    }

    &__catalog-inner {
        display: grid;
        grid-template-columns: min-content min-content;
    }
}
</style>
