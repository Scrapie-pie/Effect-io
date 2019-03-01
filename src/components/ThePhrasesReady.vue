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
                            action-list.phrases-ready__list(:item-list="categories")

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
                                            base-btn(theme="link" v-text="'Редактировать'")
                                        li.phrases-ready__phrases-button.phrases-ready__phrases-remove
                                            base-btn(theme="link" v-text="'Удалить'")

            fieldset(v-else)
                legend.phrases-ready__text-only-scr Добавление новой фразы
                ul.phrases-ready__add
                    li.phrases-ready__add-item.phrases-ready__add-item_select
                        label.phrases-ready__label(for="newCategory") Выберите категорию или придумайте свою
                        base-field(
                            type="select",
                            :selectOptions="{label:'name',options:categories}"
                            name="newCategory"
                            v-model="newCategory",
                            id="newCategory"
                        )
                    li.phrases-ready__add-item
                        label.phrases-ready__label(for="newPhrase") Введите фразу
                        base-field(
                            id="newPhrase",
                            type="textarea",
                            name="newCategory"
                            v-model="newPhrase",

                        )
                    li.phrases-ready__add-item
                        base-radio-check(
                            type="radio"
                            v-model="VisibleToAll"
                            value="true"
                            name="VisibleToAll"
                        ) Все сотрудники будут видеть данный шаблон
                    li.phrases-ready__add-item
                        base-radio-check(type="radio" value="false") Данный шаблон будет виден только мне
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
            showPhrasesNew:false,
        },
        data() {
            return {
                create:{
                    text:'122345',
                    category:'Новая категория',
                    is_common:1,
                },



                newCategory:'',
                newPhrase:'',

                VisibleToAll:false,
                phrases: [
                    {text:'Здравствуйте! Чем я могу Вам помочь?'},
                    {text:'Добрый день! Отвечу на Ваши вопросы. '},
                    {text:'Здравствуйте! Какой вопрос Вас интересует? '},
                    {text:'Еще категория'},


                ],
                categories: [
                    {text:'Приветствие'},
                    {text:'Прощание'},
                    {text:'Название своего варианта'},
                    {text:'Еще категория'},

                ],




            }
        },
        created(){
            this.getItemList()
        },
        methods:{
            createItem(){

                this.$http.post('snippet-create',this.create)
                    .then(({ data }) => {
                        console.log(data);

                    })
            },
            getItemList(){
                this.$http.get('snippet-read')
                    .then(({ data }) => {
                        console.log(data);

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