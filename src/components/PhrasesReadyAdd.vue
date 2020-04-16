<template lang="pug">
    form.phrases-ready-edit-edit(@submit.prevent="submit")
        fieldset
            ul.phrases-ready-edit__add
                template
                    li.phrases-ready-edit__add-item(v-if="isViewAdmin")
                        base-radio-check(
                        :false-value="1",
                        :true-value="0",
                        v-model="create.is_common",
                        name="is_common"
                        ) Данный шаблон будет виден только мне
                    li.phrases-ready-edit__add-item(v-if="create.is_common")
                        p Выбрать сайт к которому относится шаблон
                        filter-drop-menu(

                        name="siteCompany",

                        @get="filterChannel"
                        all-output
                        immediate-output
                        )

                    li.phrases-ready-edit__add-item(v-if="create.is_common")
                        p Добавить шаблон только для выбранных отделов:

                        filter-drop-menu(name="branch", @get="setFilterBranchIds", :filter-show-ids="filterBranchShowIds" all-output immediate-output)

                template
                    li.phrases-ready-edit__add-item.phrases-ready-edit__add-item_select


                        label.phrases-ready-edit__label(for="newCategory") Выберите категорию или придумайте свою
                        base-field(
                        type="select",
                        :selectOptions="{label:'title',options:categories,taggable:true,value:create.category}"
                        name="newCategory"
                        v-model="create.category",
                        id="newCategory"
                        v-validate="'required'"
                        data-vv-as="\"Категория\""
                        )

                    li.phrases-ready-edit__add-item
                        label.phrases-ready-edit__label(for="newPhrase") Введите фразу
                        base-field(
                        id="newPhrase",
                        type="textarea",
                        name="newPhrase"
                        v-model="create.text",
                        maxLength="2000"
                        v-validate="'required'",
                        data-vv-as="Введите фразу"

                        )


                li.phrases-ready-edit__add-item
                    base-btn.phrases-ready-edit__add-item-button(type="submit") Добавить шаблон
                    base-btn(v-text="'Отмена'" color="error", @click="cancel")

</template>

<script>
    import FilterDropMenu from '@/components/FilterDropMenu'

    export default {
        components: {
            FilterDropMenu
        },
        data() {
            return {
                filterChannelIds: [],
                filterSearchResult: [],
                filterBranchIds: [],
                filterBranchShowIds: [],

                create: {
                    text: '',
                    category: '',
                    is_common: 1,
                    branches_ids: [],

                },


            }
        },
        computed: {
            isViewAdmin() {
                return this.$store.getters['user/isRole'](['admin', 'owner', 'operatorSenior'])
            },

            categories() {
                let list = this.$store.getters['phrases/categories']
                if(this.$route.params.site_id) return list = this.$store.getters['phrases/categoriesUse']

                return list.filter(item => {
                    if(this.create.is_common===0) return this.create.is_common === item.is_common

                    return item.branches_ids.some(id => this.filterBranchIds.includes(id))
                })
            }


        },
        watch: {


            isViewAdmin: {
                handler(val) {

                    if (!val) {
                        console.log('isViewAdmin', val)
                        this.create.is_common = 0
                    } else {
                        this.create.is_common = 1
                    }
                },
                immediate: true
            }
        },
        created() {},
        methods: {
            setFilterBranchIds(ids){
                this.filterBranchIds = ids
                this.create.branches_ids = ids

            },
            filterChannel(ids) {
                this.filterChannelIds = ids
                this.filterBranchShowIds = this.$store.getters['user/branchListAll']
                    .filter(item => ids.includes(item.site_id))
                    .map(item => {
                        return item.id
                    })
            },

            cancel() {
                this.$emit('cancel')
            },




            submit() {
                this.$validator.validateAll().then(success => {
                    if (success) {
                        console.log(this.create);
                        this.$store.dispatch('phrases/snippetCreate', this.create)
                        this.$emit('cancel')
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .phrases-ready-edit {
        &__label {
            font-weight: bold;
            margin-bottom: calc-em(20);
        }

        &__add-item {
            & + & {
                margin-top: calc-em(25);
            }

            &_select {
                max-width: 275px;
            }
        }
        &__add-item-button {
            margin-right: calc-em(20);
        }
    }
</style>
