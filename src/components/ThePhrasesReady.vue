<template lang="pug">
    form.phrases-ready(@submit.prevent="submit")
        base-wait(name="phrasesReady")
        transition(name="fade" mode="out-in")
            fieldset.phrases-ready__wrap(v-if="phrasesEdit===null && categoriesEdit===null", key="phrasesEdit")
                .phrases-ready__filter
                    filter-drop-menu(name="branch",@get="(val)=>filterBranchIds=val")
                    base-filter-search(:item-list="snippetsFilterBranch", @result="(val)=>filterSearchResult=val", field-name="text")
                legend.phrases-ready__text-only-scr Готовый список фраз
                .phrases-ready__btn-add
                    base-btn(
                        @click="phrasesEdit={}"
                        v-text="'Добавить свой шаблон'"
                    )
                .phrases-ready__inner
                    fieldset.phrases-ready__catalog.phrases-ready__fieldset
                        legend.phrases-ready__name Категория

                        ul.phrases-ready__phrases
                            li.phrases-ready__phrases-item(
                            v-for="(item, index) in categories",
                            :key="index",
                            :class="{active:item.id===categoriesSelectId}"
                            )
                                base-btn(theme="text", @click="categoriesSelect(item.id)").phrases-ready__phrases-text(v-text="item.title", :title="item.title")

                                ul.phrases-ready__phrases-controls
                                    li.phrases-ready__phrases-button.phrases-ready__phrases-edit
                                        base-btn(theme="link" v-text="'Редактировать'", @click="categoriesEditShow(item)")
                                    li.phrases-ready__phrases-button.phrases-ready__phrases-remove
                                        base-btn(theme="link" v-text="'Удалить'", @click="categoriesDelete(item.id)")
                        //base-btn( v-text="'Добавить категорию'" @click="itemEditShow(item)")

                    fieldset.phrases-ready__phrases-wrap.phrases-ready__fieldset

                        legend.phrases-ready__name Фраза
                        scroll-bar.phrases-ready__scrollbar.phrases-ready__scrollbar_phrases
                            ul.phrases-ready__phrases
                                li.phrases-ready__phrases-item(
                                    v-for="(item, index) in snippets",
                                    :key="index"
                                )
                                    base-btn(theme="text", @click="selectText(item.text)").phrases-ready__phrases-text(v-text="item.text", :title="item.text")

                                    ul.phrases-ready__phrases-controls
                                        li.phrases-ready__phrases-button.phrases-ready__phrases-edit
                                            base-btn(theme="link" v-text="'Редактировать'", @click="phrasesEditShow(item)")
                                        li.phrases-ready__phrases-button.phrases-ready__phrases-remove
                                            base-btn(theme="link" v-text="'Удалить'", @click="phrasesDelete(item.id)")
            phrases-ready-edit(v-else @cancel="cancel", :phrases-edit="phrasesEdit", :categories-edit="categoriesEdit")


</template>

<script>
import ActionList from '@/components/ActionList'
import FilterDropMenu from "@/components/FilterDropMenu";
import PhrasesReadyEdit from "@/components/PhrasesReadyEdit";
export default {
    components: {
        PhrasesReadyEdit,
        FilterDropMenu,
        ActionList
    },
    props: {},
    data() {
        return {
            filterSearchResult:[],
            filterBranchIds: [],


            phrasesEdit: null,
            categoriesEdit: null,
            categoriesSelectId: ''
        }
    },
    computed: {
        snippetsFilterBranch() {
            if (this.filterBranchIds.length)
                return this.snippetsStore.filter(item =>
                    this.filterBranchIds.includes(item.id)
                )
            else return this.snippetsStore
        },
        snippets() {
            return this.filterSearchResult.filter(
                item => item.category_id === Number(this.categoriesSelectId)
            )
        },
        snippetsStore() {
            return this.$store.state.phrases.snippets
        },
        categories() {
            return this.$store.state.phrases.categories
        },

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
            this.categoriesSelectId=id;
        },
        selectText(val) {
            this.$emit('resultText', val)
            this.$root.$emit('globBoxControlClose')
        },
        cancel() {
            this.phrasesEdit= null;
            this.categoriesEdit= null;
        },
        phrasesEditShow(item) {
            this.phrasesEdit= item

        },
        categoriesEditShow(item) {
            this.categoriesEdit= item

        },

        categoriesDelete(id) {
            this.$store.dispatch('phrases/categoriesDelete', id)
        },

        phrasesDelete(id) {
            this.$store.dispatch('phrases/snippetDelete', id)
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

    $space:$glob-space;

    $padding: calc-em(8) calc-em(26);
    max-height: 74vh;

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
        display:grid;
        grid-template-columns:min-content 1fr;
        grid-gap:calc-em(15);
    }

    &__list {
    }

    &__btn-add {
        position: absolute;
        right: 0;
        top: 0;
        margin: calc-em(13) calc-em(45);
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
        margin-left: (calc-em(10) * -1);
    }

    &__phrases-item {
        display: flex;

        align-items: center;
        padding: $padding;
        padding-left: calc-em(10);
        transition: $transition;
        &.active,&:hover {
            background-color: $color-bg;
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
        display:grid;
        grid-template-columns:max-content max-content;
        align-items:center;
        grid-gap:$space;
        margin-bottom: calc-em(35);

    }

    &__catalog-inner {
        display:grid;
        grid-template-columns:min-content min-content;
    }
}
</style>
