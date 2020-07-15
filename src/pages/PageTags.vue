<template lang="pug">
    scroll-bar.page-tags(tag="section")
        base-wait(name="pageTags")
        form
            fieldset
                .page-tags__filter
                    .page-tags__filter-item

                        filter-drop-menu(
                        name-alias-for-filter-store="siteCompanyPageTags"
                        is-save-result-page
                        name="siteCompany",
                        @get="filterChannel"
                        all-output
                        immediate-output
                        )
                    .page-tags__filter-item
                        filter-drop-menu(
                        type="radio"
                        name-alias-for-filter-store="branchPageTags"
                        is-save-result-page
                        name="branch", @get="(val)=>filterBranchIds=[val]", :filter-show-ids="filterBranchShowIds" all-output immediate-output)

            fieldset
                legend.page-tags__title Тэги
                ul.page-tags__list
                    li.page-tags__item
                        label.page-tags__label Введите кажный новый тэг в новой строке.
                        base-field.page-tags__textarea(
                            ref="textarea"
                            name="tags"
                            type="textarea"
                            rows="10"
                            v-model="textarea"
                            maxlength="2000"
                        )
                    li.page-tags__item
                        base-radio-check(name="obligationTag" v-model="is_tag_required") Выберите для каких разделов проставление тэгов будет обязательно
                    li.page-tags__item.page-tags__item_btn
                        base-btn(@click="save") Сохранить

</template>

<script>
import autosize from 'autosize'
import { mapGetters, mapActions } from 'vuex'

import browserNotification from '@/modules/browserNotification'
import FilterDropMenu from '@/components/FilterDropMenu'
export default {
    components: { FilterDropMenu },
    data() {
        return {
            filterBranchIds: [],
            filterBranchShowIds: [],
            filterChannelIds: [],
            autosizeInit: true,
            textarea: '',
            is_tag_required: 0
        }
    },
    computed: {
        ...mapGetters('tags', ['itemList']),
        ...mapGetters('user', ['settings']),

        itemListText() {
            let list = this.itemList

            return list.filter(item =>{
                console.log(item.branch_id,this.filterBranchIds[0]);
                return item.branch_id===this.filterBranchIds[0]
            }).map(item => item.tag)
        },
        itemListTextArea() {
            if (!this.itemListText.length) return ''
            return this.itemListText.join('\n')
        },
        tags() {
            return this.textarea.split('\n')
        }
    },
    watch: {
        textarea(val) {
            if (val) {
                setTimeout(() => {
                    autosize(this.$refs.textarea.$el.querySelector('textarea'))
                }, 500)
            }
        },
        itemListTextArea: {
            handler(val) {
                this.textarea = val
            },

            immediate: true
        },

        filterBranchIds: {
            handler(val) {
                if (val.length) {
                    let find = this.$store.getters['user/branchListAll'].find(item=>item.id===val[0])
                    if(find) {
                        console.log(find.options);
                        this.is_tag_required = find.options.tag_required
                    }
                }
            },

            immediate: true
        },


    },
    created() {
        this.$store.dispatch('tags/get')
    },
    mounted() {
        //console.log(this.$refs.textarea.$el.querySelector('textarea'));
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
        save() {
            this.$store
                .dispatch('tags/update', {
                    tags: this.tags,
                    is_tag_required: this.is_tag_required,
                    branch_id:this.filterBranchIds[0]
                })
                .then(() => {
                    browserNotification('Сохранено')
                    //this.$router.push({name: 'processAll'});
                    this.$store.commit('user/settingsUpdateFields', {
                        is_tag_required: this.is_tag_required
                    })
                })
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (!vm.$store.getters['user/isRole'](['admin', 'owner', 'operatorSenior']))
                return vm.$router.push({ name: 'processAll' })
        })
    }
}
</script>

<style lang="scss">
.page-tags {
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
    &__title {
        @extend %h4;
        margin-bottom: calc-em(40);
    }
    &__label {
        margin-bottom: calc-em(15);
    }
    &__item {
        margin-bottom: calc-em(20);
        &_btn {
            margin-top: calc-em(40);
        }
    }
    &__textarea {
        .field__input {
            min-height: calc-em(100);
            height: auto;
        }
    }
}
</style>
