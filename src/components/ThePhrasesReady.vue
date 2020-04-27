<template lang="pug">
    form.phrases-ready(@submit.prevent="submit", :class="{'phrases-ready_is-absolute':isAbsolute}")
        base-wait(name="phrasesReady")
        transition(name="fade" mode="out-in")
            .phrases-ready__wrap(v-if="showComponent===null", key="phrasesEdit")
                .phrases-ready__filter
                    .phrases-ready__filter-item
                        filter-drop-menu(
                        name="siteCompany",
                        @get="filterChannel"
                        all-output
                        immediate-output
                        )
                    .phrases-ready__filter-item
                        filter-drop-menu( name="branch", @get="(val)=>filterBranchIds=val", :filter-show-ids="filterBranchShowIds" all-output immediate-output)
                    .phrases-ready__filter-item
                        base-filter-search(:item-list="snippetsFilterBranch", @result="(val)=>filterSearchResult=val", field-name="text")
                    .phrases-ready__filter-item.phrases-ready__btn-add
                        base-btn(
                        @click="showComponent='phrasesAdd'"
                        v-text="'Добавить свой шаблон'"
                        )
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
                                    ul.phrases-ready__phrases-controls(v-if="isViewAdmin || !item.is_common")
                                        li.phrases-ready__phrases-button.phrases-ready__phrases-edit
                                            base-btn(theme="link" v-text="'Редактировать'", @click="categoriesEditShow(item)")
                                        li.phrases-ready__phrases-button.phrases-ready__phrases-remove
                                            base-btn(theme="link" v-text="'Удалить'", @click="categoriesDelete(item.id)")
                        //base-btn( v-text="'Добавить категорию'" @click="itemEditShow(item)")
                    .phrases-ready__phrases-wrap.phrases-ready__fieldset

                        legend.phrases-ready__name Фраза
                        scroll-bar.phrases-ready__scrollbar.phrases-ready__scrollbar_phrases
                            ul.phrases-ready__phrases
                                li.phrases-ready__phrases-item(
                                    v-for="(item, index) in snippets",
                                    :key="index"
                                )
                                    base-btn(theme="text", @click="selectText(item)").phrases-ready__phrases-text(v-text="item.text", :title="item.text")

                                    ul.phrases-ready__phrases-controls(v-if="isViewAdmin || !item.is_common")
                                        li.phrases-ready__phrases-button.phrases-ready__phrases-edit
                                            base-btn(theme="link" v-text="'Редактировать'", @click="phrasesEditShow(item)")
                                        li.phrases-ready__phrases-button.phrases-ready__phrases-remove
                                            base-btn(theme="link" v-text="'Удалить'", @click="phrasesDelete(item.id)")

            phrases-ready-add(v-if="showComponent==='phrasesAdd'", @cancel="cancel")
            phrases-ready-phrases-edit(v-if="showComponent==='phrasesEdit'", @cancel="cancel", :phrases-edit="phrasesEdit",)
            phrases-ready-category-edit(v-if="showComponent==='categoryEdit'", @cancel="cancel", :categories-edit="categoriesEdit")

</template>

<script>
import ActionList from '@/components/ActionList'
import FilterDropMenu from '@/components/FilterDropMenu'

import PhrasesReadyAdd from '@/components/PhrasesReadyAdd'
import PhrasesReadyPhrasesEdit from "@/components/PhrasesReadyPhrasesEdit";
import PhrasesReadyCategoryEdit from "@/components/PhrasesReadyCategoryEdit";
export default {
    components: {
        PhrasesReadyCategoryEdit,
        PhrasesReadyPhrasesEdit,
        PhrasesReadyAdd,
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
            showComponent:null,
            filterSearchResult: [],
            filterBranchIds: [],
            filterBranchShowIds: [],
            filterChannelIds: [],

            phrasesEdit: null,
            categoriesEdit: null,
            categoriesSelectId: ''
        }
    },
    computed: {
        isViewAdmin() {
            return this.$store.getters['user/isRole'](['admin', 'owner', 'operatorSenior'])
        },
        snippetsFilterBranch() {
            return this.snippetsStore.filter(item => {
                if (!item.is_common) return true
                return item.branches_ids.some(id => this.filterBranchIds.includes(id))
            })
        },
        snippets() {
            return this.filterSearchResult.filter(
                item => item.category_id === Number(this.categoriesSelectId)
            )
        },
        snippetsStore() {
            if(this.$route.params.site_id) return this.$store.state.phrases.use.snippets
            return this.$store.state.phrases.snippets
        },
        categories() {
            let list = this.$store.getters['phrases/categories']


            return list.filter(item => {
                if (!item.is_common) return true
                return this.filterBranchIds.every(id=>{
                    return item.branches_ids.includes(id)
                })
            })
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
    created() {
        this.$store.dispatch('phrases/getItemList')
    },
    methods: {
        filterChannel(ids) {
            this.filterChannelIds = ids
            this.filterBranchShowIds = this.$store.getters['user/branchListAll']
                .filter(item => ids.includes(item.site_id))
                .map(item => {
                    return item.id
                })
        },
        categoriesSelect(id) {
            this.categoriesSelectId = id
        },
        selectText(val) {

            this.$store.commit('phrases/setSelectSnippetId',val.id)
            this.$emit('resultText', val.text)
            this.$root.$emit('globBoxControlClose')
        },
        cancel() {
            this.showComponent= null
        },
        phrasesEditShow(item) {

            this.showComponent='phrasesEdit'
            this.phrasesEdit = item

        },
        categoriesEditShow(item) {
            this.showComponent='categoryEdit'
            this.categoriesEdit = item
        },

        categoriesDelete(id) {
            this.$store.dispatch('phrases/categoriesDelete', id)
        },

        phrasesDelete(id) {
            this.$store.dispatch('phrases/snippetDelete', id)
        }
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
        @include media($width_xs,1) {
            max-height:70vh;


        }

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

        @include media($width_xs) {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 1fr;

        }
    }

    &__fieldset {
        overflow: hidden;
        display:flex;
        flex-direction:column;
    }

    &__list {
    }

    &__btn-add {
        margin-left: auto;
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
        @include media($width_xs){
            margin-bottom:calc-em(20);
        }
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
