<template lang="pug">
    form.phrases-ready-edit-edit(@submit.prevent="submit")
        fieldset
            ul.phrases-ready-edit__add
                li.phrases-ready-edit__add-item(v-if="create.is_common")
                    p Выбрать сайт к которому относится шаблон
                    filter-drop-menu(
                        name="siteCompany",
                        all-output
                        @get="filterChannel"
                        immediate-output
                        :set-value-ids="setFilterChannelIdsValue"
                    )

                li.phrases-ready-edit__add-item(v-if="create.is_common")
                    p Добавить шаблон только для выбранных отделов:

                    filter-drop-menu(
                        name="branch",
                        @get="setFilterBranchIds",
                        :set-value-ids="setFilterBranchIdsValue",
                        :filter-show-ids="filterBranchShowIds"
                        all-output
                        immediate-output
                    )
                li.phrases-ready-edit__add-item.phrases-ready-edit__add-item_select

                    label.phrases-ready-edit__label(for="newCategory") Категория
                    base-field(

                        type="select",
                        :selectOptions="{label:'title',options:categories,value:create.category}"
                        name="newCategory"
                        v-model="create.category",
                        id="newCategory"
                        v-validate="'required'"
                        data-vv-as="\"Категория\""
                        )

                li.phrases-ready-edit__add-item
                    label.phrases-ready-edit__label Редактировать фразу
                    base-field(
                        id="newPhrase",
                        type="textarea",
                        name="newPhrase"
                        v-model="create.text",
                        maxLength="2000"
                        v-validate="'required'",
                        data-vv-as="Редактировать фразу"

                    )


                li.phrases-ready-edit__add-item
                    base-btn.phrases-ready-edit__add-item-button( type="submit") Сохранить шаблон
                    base-btn(v-text="'Отмена'" color="error", @click="cancel")

</template>

<script>
import FilterDropMenu from '@/components/FilterDropMenu'

export default {
    components: {
        FilterDropMenu
    },
    props: {
        phrasesEdit: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            filterChannelIds: [],
            filterSearchResult: [],
            filterBranchIds: [],
            filterBranchShowIds: [],

            setFilterChannelIdsValue: [],
            setFilterBranchIdsValue: [],
            create: {
                category: '',
                text: '',
                id: '',
                category_id: 1,
                is_common: null
            }
        }
    },
    computed: {
        categories() {
            let list = this.$store.getters['phrases/categories']
            if (this.$route.params.site_id)
                return (list = this.$store.getters['phrases/categoriesUse'])

            return list.filter(item => {
                if (this.create.is_common === 0) return this.create.is_common === item.is_common
                console.log(item.branches_ids, this.filterBranchIds)

                return this.filterBranchIds.every(id => {
                    return item.branches_ids.includes(id)
                })
            })
        }
    },
    watch: {
        phrasesEdit: {
            handler(object) {
                let list = this.$store.getters['phrases/categories']
                if (this.$route.params.site_id) list = this.$store.getters['phrases/categoriesUse']
                let findCategory = list.find(item => item.id === object.category_id)

                object.category = findCategory

                this.create.is_common = findCategory.is_common

                console.log(findCategory.branches_ids)

                let branchListFilter = this.$store.getters['user/branchListAll'].filter(item =>
                    findCategory.branches_ids.includes(item.id)
                )

                this.setFilterBranchIdsValue = branchListFilter.map(item => item.id)

                this.setFilterChannelIdsValue = branchListFilter.map(item => item.site_id)

                console.log('phrasesEdit watch')

                Object.assign(this.create, object)
            },
            immediate: true
        }
    },
    created() {},
    methods: {
        setFilterBranchIds(ids) {
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
        snippetEdit() {},
        submit() {
            this.$validator.validateAll().then(success => {
                if (success) {
                    this.$store.dispatch('phrases/snippetUpdate', this.create)
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
