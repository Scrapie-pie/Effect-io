<template lang="pug">
    form.select-operator
        fieldset(v-if="count")
            legend.select-operator__title Выберите сотрудника, которому Вы хотите передать диалог
            .select-operator__search-operators
                base-field.select-operator__search(type="search" name="search" v-model="search" theme="soft")
                scroll-bar.select-operator__scrollbar
                    ul.select-operator__list
                        li.select-operator__item(v-for="(item, index) in itemList",:key="index")
                            .select-operator__checkbox
                                base-radio-check()
                            base-people(
                                :bg-text-no-fill="true"

                                :name="item.name" ,
                                :text="item.text" ,
                                :datetime="item.datetime"
                            )
            .select-operator__footer
                label.select-operator__label Оставьте комментарий
                base-field.select-operator__input(
                    type="textarea"
                    name="comment"
                    placeholder="Данный комментарий увидит сотрудник, которому Вы передаете диалог. Это не обязательное поле. Вы можете передать диалог без указания комментария."
                    v-model="comment"
                )
                base-btn() Пригласить

        fieldset(v-else)
            p.select-operator__count-no К сожалению, сейчас нет доступных сотрудников
</template>

<script>
    export default {
        data(){
            return {
                count:1,
                search:'',
                comment:'',
                itemList: [
                    {name: 'Петр Иванов', text: 'Главный отдел'},
                    {name: 'Зеленков Александр', text: 'Главный отдел'},
                    {name: 'Зеленков Александр', text: 'Главный отдел'},
                    {name: 'Зеленков Александр', text: 'Главный отдел'},
                    {name: 'Петр Иванов', text: 'Главный отдел'},

                    {name: 'Петр Иванов', text: 'Главный отдел'},
                    {name: 'Зеленков Александр', text: 'Главный отдел'},
                    {name: 'Зеленков Александр', text: 'Главный отдел'},
                    {name: 'Зеленков Александр', text: 'Главный отдел'},
                    {name: 'Петр Иванов', text: 'Главный отдел'},

                ],
            }
        },
        created(){

        }
    }
</script>

<style lang="scss">
    .select-operator {


        &__title {
            /*padding-top:2.5em;*/
            margin-bottom:2em;
        }

        &__search {
            margin-bottom:calc-em(20);
        }

        &__scrollbar {
            max-height: calc(80vh - 20em);
            margin-bottom:calc-em(50);
        }

        &__list {

        }

        &__item {
            display:flex;
            align-items:center;
        }

        &__label {
            margin-bottom:calc-em(15);
        }

        &__input {
            margin-bottom:calc-em(15);

            .field__input {
                height:calc-em(75);
            }
        }

        &__search-operators {
            max-width:245px;
        }
    }
</style>