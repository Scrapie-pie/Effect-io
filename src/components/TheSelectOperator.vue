<template lang="pug">
    form.select-operator
        fieldset
            legend Выберите сотрудника, которому Вы хотите передать диалог
        base-field(type="search" name="search" v-model="search" theme="soft")
        ul.select-operator__list
            li.select-operator__item(v-for="(item, index) in itemList",:key="index")
                base-people(
                    :bg-text-no-fill="true"

                    :name="item.name" ,
                    :text="item.text" ,
                    :datetime="item.datetime"
                )
        .select-operator__footer
            p Оставьте комментарий
            base-field(
                type="textarea"
                name="comment"
                placeholder="Данный комментарий увидит сотрудник, которому Вы передаете диалог. Это не обязательное поле. Вы можете передать диалог без указания комментария."
                v-model="comment"
            )
            base-btn() Пригласить
</template>

<script>
    export default {
        data(){
            return {
                search:'',
                comment:'',
                itemList: [
                    {name: 'Петр Иванов', text: 'Главный отдел'},
                    {name: 'Зеленков Александр', text: 'Главный отдел'},
                    {name: 'Зеленков Александр', text: 'Главный отдел'},
                    {name: 'Зеленков Александр', text: 'Главный отдел'},
                    {name: 'Петр Иванов', text: 'Главный отдел'},

                ],
            }
        }
    }
</script>

<style lang="scss">
    .select-operator {

    }
</style>