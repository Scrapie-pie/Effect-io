<template lang="pug">
    form.phrases-ready
        fieldset
            legend.phrases-ready__title Готовый список фраз

            .phrases-ready__inner
                fieldset.phrases-ready__catalog.phrases-ready__fieldset
                    legend.phrases-ready__name Категория
                    ul.phrases-ready__list.nav-main__list
                        li.nav-main__item(
                            v-for="(item, index) in categories",
                            :key="index"
                        )
                            button.nav-main__link.nav-main__link_active(
                                type="button"
                                v-text="item.name"
                            )

                fieldset.phrases-ready__phrases-wrap.phrases-ready__fieldset
                    legend.phrases-ready__name.phrases-ready__name_phrases Фраза
                        base-btn.phrases-ready__add(v-text="'Добавить свой шаблон'")
                    ul.phrases-ready__phrases
                        li.phrases-ready__phrases-item(
                            v-for="(item, index) in phrases",
                            :key="index"
                        )
                            span.phrases-ready__phrases-text(v-text="item.text")
                            .phrases-ready__phrases-controls
                                base-btn.phrases-ready__phrases-button.phrases-ready__phrases-edit(theme="link" v-text="'Редактировать'")
                                base-btn.phrases-ready__phrases-button.phrases-ready__phrases-remove(theme="link" v-text="'Удалить'")





</template>

<script>
    export default {
        data() {
            return {
                phrases: [
                    {text:'Здравствуйте! Чем я могу Вам помочь?'},
                    {text:'Добрый день! Отвечу на Ваши вопросы. '},
                    {text:'Здравствуйте! Какой вопрос Вас интересует? '},
                    {text:'Еще категория'},
                ],
                categories: [
                    {name:'Приветствие'},
                    {name:'Прощание'},
                    {name:'Название своего варианта'},
                    {name:'Еще категория'},
                ],




            }
        },
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

        &__inner {
            display:flex;
        }

        &__list {
            margin-left:(calc-em(26) * -1);
        }

        &__add {
            margin-left:auto;
            margin-right:calc-em(20);

            margin-top: (calc-em(16) * -1);
            top: calc-em(7);
        }


        &__catalog {
            padding-right: 16%;
        }

        &__phrases-button {
            padding:0 1em;
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
        }

        &__title {
            @extend %visuallyhidden;
        }

        &__name {
            font-weight:bold;
            margin-bottom:calc-em(50);

            &_phrases {
                display:flex;
            }
        }

        .nav-main{
            $self:'.nav-main';



            &__item{
            }
            &__link{
                position:relative;
                border:0;
                border-left:3px solid transparent;
                background-color:transparent;
                color:$color-text;
                padding:$padding;
                white-space:nowrap;
                text-decoration:none;
                display:block;
                padding-right:calc-em(20);



                &_active{
                    border-color:$color-border;
                    background-color:$color-bg;
                    font-weight:700;
                }
            }


        }
    }




</style>