<template lang="pug">
    form.phrases-ready-edit-edit(@submit.prevent="submit")
        fieldset
            ul.phrases-ready-edit__add
                li.phrases-ready-edit__add-item(v-if="modelCategoryEdit.is_common")
                    p Выбрать сайт к которому относится шаблон
                    filter-drop-menu(
                    name="siteCompany",
                    all-output
                    @get="filterChannel"
                    immediate-output
                    :set-value-ids="setFilterChannelIdsValue"
                    )

                li.phrases-ready-edit__add-item(v-if="modelCategoryEdit.is_common")
                    p Добавить шаблон только для выбранных отделов:

                    filter-drop-menu(
                    :filter-show-ids="filterBranchShowIds"
                    name="branch",
                    @get="(val)=>modelCategoryEdit.branches_ids=val",
                    :set-value-ids="setFilterBranchIdsValue",
                    all-output
                    immediate-output
                    )

                li.phrases-ready-edit__add-item
                    label.phrases-ready-edit__label(for="categoriesEdit") Редактировать категорию
                    base-field(
                    id="categoriesEdit",
                    name="categoriesEdit"
                    v-model="modelCategoryEdit.title",
                    maxLength="2000"
                    v-validate="'required'",
                    data-vv-as="Редактировать категорию"
                    )


                li.phrases-ready-edit__add-item
                    base-btn.phrases-ready-edit__add-item-button(type="submit") Сохранить категорию
                    base-btn(v-text="'Отмена'" color="error", @click="cancel")

</template>

<script>
    import FilterDropMenu from '@/components/FilterDropMenu'

    export default {
        components: {
            FilterDropMenu
        },
        props: {

            categoriesEdit: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                filterChannelIds: [],
                filterSearchResult: [],
                filterBranchIds: [],
                filterBranchShowIds: [],

                setFilterChannelIdsValue:[],
                setFilterBranchIdsValue:[],



                modelCategoryEdit: {
                    title: '',
                    id: '',

                    branches_ids: [],
                }
            }
        },

        watch: {
            categoriesEdit: {
                handler(object) {

                    let branchListFilter = this.$store.getters['user/branchListAll']
                        .filter(item=>object.branches_ids.includes(item.id))

                    this.setFilterBranchIdsValue = branchListFilter.map(item=>item.id)

                    this.setFilterChannelIdsValue =  branchListFilter.map(item=>item.site_id)

                    this.modelCategoryEdit = object


                },
                immediate: true
            },


        },
        created() {},
        methods: {
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
            snippetCreate() {
                this.$store.dispatch('phrases/categoriesUpdate', this.modelCategoryEdit)
            },
            submit() {
                this.$validator.validateAll().then(success => {
                    if (success) {
                        this.snippetCreate()
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
