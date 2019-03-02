<template lang="pug">
    form.phrases-ready(@submit.prevent="createItem")
        transition(name="fade" mode="out-in")
            fieldset(v-if="!showPhrasesNew" key="showPhrasesNew")
                legend.phrases-ready__text-only-scr Готовый список фраз
                .phrases-ready__btn-add
                    base-btn(
                        @click="showPhrasesNew=true"
                        v-text="'Добавить свой шаблон'"
                    )
                .phrases-ready__inner
                    fieldset.phrases-ready__catalog.phrases-ready__fieldset
                        legend.phrases-ready__name Категория
                        scroll-bar.phrases-ready__scrollbar
                            action-list.phrases-ready__list(
                                :item-list="categories"
                                name="categories"
                                name-field-text="title"
                                name-field-value="id"
                                v-model="categoriesSelectId"
                            )

                    fieldset.phrases-ready__phrases-wrap.phrases-ready__fieldset

                        legend.phrases-ready__name Фраза
                        scroll-bar.phrases-ready__scrollbar.phrases-ready__scrollbar_phrases
                            ul.phrases-ready__phrases
                                li.phrases-ready__phrases-item(
                                    v-for="(item, index) in phrases",
                                    :key="index"
                                )
                                    span.phrases-ready__phrases-text(v-text="item.text")
                                    ul.phrases-ready__phrases-controls
                                        li.phrases-ready__phrases-button.phrases-ready__phrases-edit
                                            base-btn(theme="link" v-text="'Редактировать'" @click="itemEdit(item.id)")
                                        li.phrases-ready__phrases-button.phrases-ready__phrases-remove
                                            base-btn(theme="link" v-text="'Удалить'" @click="itemDelete(item.id)")

            fieldset(v-else)
                legend.phrases-ready__text-only-scr Добавление новой фразы
                ul.phrases-ready__add
                    li.phrases-ready__add-item.phrases-ready__add-item_select
                        label.phrases-ready__label(for="newCategory") Выберите категорию или придумайте свою
                        base-field(
                            type="select",
                            :selectOptions="{label:'title',options:categories,taggable:true}"
                            name="newCategory"
                            v-model="create.category",
                            id="newCategory"
                        )
                    li.phrases-ready__add-item
                        label.phrases-ready__label(for="newPhrase") Введите фразу
                        base-field(
                            id="newPhrase",
                            type="textarea",
                            name="newPhrase"
                            v-model="create.text",

                        )
                    li.phrases-ready__add-item
                        base-radio-check(
                            type="radio"
                            v-model="create.is_common",
                            :value="1"
                            name="is_common"
                        ) Все сотрудники будут видеть данный шаблон
                    li.phrases-ready__add-item
                        base-radio-check(
                            type="radio" ,
                            :value="0"
                            name="is_common"
                        ) Данный шаблон будет виден только мне
                    li.phrases-ready__add-item
                        base-btn.phrases-ready__add-item-button(v-text="'Добавить шаблон'" type="submit")
                        base-btn(v-text="'Отмена'" color="error" @click="showPhrasesNew=false")
</template>

<script>
    import ActionList from '@/components/ActionList'
    export default {
        components:{
            ActionList
        },
        props:{

        },
        data() {
            return {
                showPhrasesNew:false,
                create:{
                    text:'',
                    category:'',
                    is_common:1,
                },



                newCategory:'',
                newPhrase:'',

                VisibleToAll:false,

                categories: [

                ],
                categoriesSelectId:'',


                snippets:[]

            }
        },
        computed:{
            phrases(){
                return this.snippets.filter((item)=>item.category_id === Number(this.categoriesSelectId))
            }
        },
        watch:{
            snippets:{
                handler(val){
                    if(val.length){
                        console.log(val);
                        this.categoriesSelectId=val[0].category_id
                    }

                },
                immediate: true
            },

        },
        created(){
            this.getItemList()
        },
        methods:{
            itemEdit(id){
                let text = 'Отредактированный текст!!!!'
                this.$http.put('snippet-update',{id,text})
                    .then(({ data }) => {
                        console.log(data);
                        let findIndex = this.snippets.find((item)=>item.id===id)
                        if(findIndex!==-1) {
                            console.log(this.snippets[findIndex]);
                            console.log(this.snippets[findIndex].text);
                            console.log(text)
                            this.snippets[findIndex].text = text
                        }
                    })
            },
            itemDelete(id){

                this.$http.delete('snippet-delete',{id})
                    .then(({ data }) => {
                        let findIndex = this.snippets.find((item)=>item.id===id)
                        if(findIndex!=-1) this.snippets.splice(findIndex,1)
                    })
            },
            createItem(){
                this.create.category = this.create.category.title
                this.$http.post('snippet-create',this.create)
                    .then(({ data }) => {

                        this.categories.push({
                            category_id:data.data.category_id,
                            title:this.create.category
                        })
                        this.snippets.push(data.data)
                        console.log(data.data);

                    })
            },
            getItemList(){
                this.$http.get('snippet-read')
                    .then(({ data }) => {
                        this.snippets = data.data.snippets
                        this.categories = data.data.categories

                    })
            }
        }
    }
</script>

<style lang="scss">
    .phrases-ready {
        $color-border:glob-color('info');
        $color-bg:glob-color('info-lighten');
        $transition:$glob-trans;

        $color-text:glob-color('secondary');
        $color-error:glob-color('error');

        $padding:calc-em(8) calc-em(26);
        max-height: 74vh;

        &__scrollbar {
            max-height: 67.5vh;

            &_phrases {
                margin-left:-(calc-em(15));
                padding-left:calc-em(15);
            }
        }

        &__add-item {
            &+& {
                margin-top:calc-em(25);
            }

            &_select {
                max-width:275px;
            }


        }
        &__add-item-button {
            margin-right:calc-em(20);
        }

        &__title {
            font-weight:bold;
        }

        &__inner {
            display:flex;
        }

        &__list {
            margin-left:(calc-em(26) * -1);
        }

        &__btn-add {
            position:absolute;
            right:0;
            top:0;
            margin:calc-em(13) calc-em(45);
        }


        &__catalog {
            padding-right: 9vw;
            flex: 0 0 auto;

            @include media(1600px) {
                padding-right:1vw;
            }
        }

        &__phrases-button {
            padding-left:calc-em(35);
            @include media($width_xl) {
                padding-left:0;
            }
        }
        &__phrases-remove {
            color:$color_error;
        }

        &__phrases-wrap {
            width:100%;
        }
        &__phrases {
            margin-left:(calc-em(10) * -1);
        }

        &__phrases-item {
            display:flex;
            align-items:center;
            padding:$padding;
            padding-left:calc-em(10);
            transition:$transition;
            &:hover {
                background-color:$color-bg;
            }
        }

        &__phrases-controls {
            display:flex;
            align-items:center;
            margin-left:auto;

            @include media($width_xl) {
                flex-direction:column;
                align-items: flex-end;
                padding-left:calc-em(15);
            }
        }

        &__text-only-scr {
            @extend %visuallyhidden;
        }

        &__label {
            font-weight:bold;
            margin-bottom:calc-em(20);
        }
        &__name {
            font-weight:bold;
            margin-bottom:calc-em(50);


        }




    }




</style>