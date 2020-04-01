<template lang="pug">

        .phrases-select(
            v-show="show"
        )


            base-filter-search(
                v-show="0",
                :item-list="snippets"
                fieldName="text" ,
                @result="(val)=>filterSearchResult=val",
                :external-search="filterSearch",
                :startAll="false"
            )

            action-list.phrases-select__scroll-bar(
                :title="true"
                text-line="2"
                key="action-list"
                v-if="!!filterSearchResult.length",
                :item-list="filterSearchResult"
                name="snippets"
                name-field-text="text"
                name-field-value="id"
                v-model="text",

            )

</template>

<script>
import ActionList from '@/components/ActionList'

export default {
    components: {
        ActionList
    },
    props: {
        filterSearch: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            filterSearchResult: [],
            text: ''
        }
    },
    computed: {
        show() {
            return !!this.filterSearchResult.length && !this.fullMatch
        },
        fullMatch() {
            return (
                this.filterSearchResult.length === 1 &&
                this.filterSearchResult[0].text === this.filterSearch
            )
        },
        snippets() {
            return this.$store.state.phrases.use.snippets
        }
    },
    watch: {
        show(val) {
            this.$emit('show', val)
        },
        text(snippet_id) {
            if (snippet_id) {

                let {text} = this.filterSearchResult.find(item=>item.id===+snippet_id)
                this.$store.commit('phrases/setSelectSnippetId',+snippet_id)
                this.$emit('resultText', text)
                setTimeout(() => {
                    this.filterSearchResult = []
                    this.text = ''
                }, 50)
            } else this.$root.$emit('globBoxControlClose')
        }
    },
    mounted() {},
    methods: {}
}
</script>

<style lang="scss">
.phrases-select {
    $color_bg: glob-color('info-light');
    $trans: $glob-trans;
    padding-right: calc-em(10);

    .action-list {
        &__item {
            /* white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;*/
        }
        &__text {
            padding: calc-em(2) 0;
            color: glob-color('placeholder');
            font-style: italic;
            border: 0;

            white-space: normal;

            & {
                max-height: 2.6em; /* exactly three lines */
            }
            position: relative;

            &:before {
                @extend %full-abs;
                z-index: -1;
                border-radius: $glob-border-radius;
                content: '';

                transition: $trans;
                display: block;
            }

            /*  &:hover:before {
                    background:$color_bg;
                }
                &:hover:after {display:none}*/
            @extend %text-truncate;
        }
        &__button {
            width: 100%;
        }
        &__input {
            display: none;
        }
    }

    &__scroll-bar {
        max-height: 12em;
    }
}
</style>
