<template lang="pug">
    form.phrases-ready-edit-edit(@submit.prevent="submit")
        fieldset
            ul.phrases-ready-edit__add
                template(v-if="categoriesEdit")
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

                template(v-else-if="phrasesEdit")
                    li.phrases-ready-edit__add-item.phrases-ready-edit__add-item_select(v-if="!showPhrasesEdit")
                        label.phrases-ready-edit__label(for="newCategory") Выберите категорию или придумайте свою
                        base-field(
                            type="select",
                            :selectOptions="{label:'title',options:categories,taggable:true}"
                            name="newCategory"
                            v-model="create.category",
                            id="newCategory"
                            v-validate="'required'"
                            data-vv-as="\"Категория\""
                            )

                    li.phrases-ready-edit__add-item
                        label.phrases-ready-edit__label(for="newPhrase" v-text="(!showPhrasesEdit)?'Введите фразу':'Редактировать фразу'")
                        base-field(
                            id="newPhrase",
                            type="textarea",
                            name="newPhrase"
                            v-model="create.text",
                            maxLength="2000"
                            v-validate="'required'",
                            :data-vv-as="(!showPhrasesEdit)?'\"Введите фразу\"':'\"Редактировать фразу\"'"

                        )

                    template(v-if="!showPhrasesEdit")
                        li.phrases-ready-edit__add-item
                            base-radio-check(
                                :false-value="1",
                                :true-value="0",
                                v-model="create.is_common",
                                name="is_common"
                            ) Данный шаблон будет виден только мне
                        li.phrases-ready-edit__add-item(v-if="create.is_common")
                            | Добавить шаблон только для выбранных отделов

                            filter-drop-menu(

                            name="branch",
                            @get="(val)=>filterBranchIds=val"
                            )
                li.phrases-ready-edit__add-item
                    base-btn.phrases-ready-edit__add-item-button(v-text="(!showPhrasesEdit)?'Добавить шаблон':'Сохранить'" type="submit")
                    base-btn(v-text="'Отмена'" color="error", @click="cancel")

</template>

<script>

import FilterDropMenu from "@/components/FilterDropMenu";

export default {
    components: {
        FilterDropMenu

    },
    props: {
        phrasesEdit:{
            type:Object,
            default:()=>{},
        },
        categoriesEdit:{
            type:Object,
            default:()=>{},
        }
    },
    data() {
        return {
            is_common: 1,
            create: {
                text: '',
                category: '',
                is_common: 1
            },
            newCategory: '',
            newPhrase: '',
            modelCategoryEdit:{}

        }
    },
    computed: {

        snippets() {
            return this.$store.state.phrases.snippets
        },
        categories() {
            return this.$store.state.phrases.categories
        },

        showPhrasesEdit() {
            return this.phrasesEdit?.id
        }

    },
    watch: {

        categoriesEdit: {
            handler(object) {
                this.modelCategoryEdit= object
            },
            immediate: true
        },
        phrasesEdit: {
            handler(object) {
                this.create = object
            },
            immediate: true
        },


    },
    created() {},
    methods: {

        cancel() {
            this.$emit('cancel')
        },

        apiCategoryEdit() {

            this.$store.dispatch('phrases/categoriesUpdate', this.modelCategoryEdit)
        },
        snippetEdit() {

            this.$store.dispatch('phrases/snippetUpdate', this.create)
        },
        snippetCreate() {
            this.create.is_common = this.is_common;
            this.$store.dispatch('phrases/snippetCreate', this.create)
        },

        submit() {
            this.$validator.validateAll().then(success => {
                if (success) {
                    if(this.categoriesEdit) {
                        this.apiCategoryEdit()
                        return this.$emit('cancel')
                    }
                    if (this.showPhrasesEdit) this.snippetEdit()
                    else this.snippetCreate()
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
