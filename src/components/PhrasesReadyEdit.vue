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
                        base-field(type="text" value="Свои шаблоны" v-if="!create.is_common" disabled)
                        base-field(
                            v-else
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
                            p Выбрать сайт к которому относится шаблон
                            filter-drop-menu(
                            name="siteCompany",
                            type="radio",
                            @get="filterChannel"

                            )

                        li.phrases-ready-edit__add-item(v-if="create.is_common")
                            p Добавить шаблон только для выбранных отделов:

                            filter-drop-menu(
                            :filter-show-ids="filterChannelIds"
                            name="branch",
                            @get="(val)=>create.branches_ids=val"
                            all-output
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
            filterChannelIds:[],
            create: {
                text: '',
                category: '',
                is_common: 1,
                branches_ids:[],
                site_id:null
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

            return this.$store.state.phrases.categories.filter(item=>item.is_common)
        },

        showPhrasesEdit() {
            return this.phrasesEdit?.id
        }

    },
    watch: {
       /* 'create.is_common'(val){
            console.log(val);
            if(!val) this.create.category = this.categories[0]
        },*/
        categoriesEdit: {
            handler(object) {
                this.modelCategoryEdit= object
            },
            immediate: true
        },
        phrasesEdit: {
            handler(object) {
                Object.assign(this.create,object)

            },
            immediate: true
        },


    },
    created() {},
    methods: {
        filterChannel(id){
            this.create.site_id = id
            this.filterChannelIds = this.$store.getters['user/branchListAll'].filter(item => id===item.site_id).map(item=>item.id)
        },

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
            console.log('snippetCreate');
            //this.create.is_common = this.is_common;
            console.log(this.create);
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
