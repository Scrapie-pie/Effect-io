<template lang="pug">

    article.grid
        h1 Ui
        base-icon(name="calendar")
        hr
        section
            h2 Елементы
            hr
            ul.ui-list
                li.ui-list__item
                    the-select-operator
                li.ui-list__item

                li.ui-list__item
                    base-btn(:icon="{name:'edit',box:true}" theme="default")

                li.ui-list__item
                    base-people(text="текст" name="имя")
                li.ui-list__item
                    account-auth
                li.ui-list__item
                    upload-avatar
                li.ui-list__item
                    base-avatar
                li.ui-list__item
                    form
                        legend forma
                        ul
                            li
                                base-field(
                                type="search"
                                name="search",
                                placeholder="Поиск..."
                                v-model="search"
                                )
                            li
                                base-field(
                                type="select",
                                :selectOptions="{label:'name',options:voiceList,taggable:true,pushTags:true}"
                                name="voice"
                                multiple
                                )
                            li
                                base-field(
                                type="select",
                                :selectOptions="{label:'name',options:[{name:'Телефон'},{name:'Связь'}],default:{name:'Телефон'}}"
                                name="phones"
                                )
                            li
                                base-field(
                                type="text"
                                name="sirname"
                                label="Введите имя сотрудника"
                                )
                            li
                                base-field(
                                type="text"
                                name="sirname"
                                placeholder="Введите имя сотрудника"
                                theme="soft"
                                )
                            li
                                base-field(
                                type="textarea"
                                name="textarea"
                                label="Введите имя сотрудника"
                                )
                            li
                                base-btn() Основная кнопка
                            li
                                base-btn(theme="sign") theme="sign"
                                base-btn(theme="default") theme="default"
                                base-btn(theme="default") theme="default"
        hr
        section
            h2 Типографика
            section
                h1 H1 Заголовок #[br] с переносом строки
                text-info Загрузите фото, которое будут видеть Ваши коллеги и клиенты. Реальное фото всегда вызывает больше доверия.
                p обычный текст #[strong жирненький текст ] #[i курсив текст ] #[small small текст ] #[a(href="javascript:") ссылка ] #[a(href="tel:88008000000") 88008000000]
                h2 H1 Заголовок #[br] с переносом строки
                p обычный текст #[strong жирненький текст ] #[i курсив текст ] #[small small текст]
                h3 H3 Заголовок #[br] с переносом строки
                p обычный текст #[strong жирненький текст ] #[i курсив текст ] #[small small текст]
                h4 H4 Заголовок #[br] с переносом строки
                p обычный текст #[strong жирненький текст ] #[i курсив текст ] #[small small текст]
                h5 H5 Заголовок #[br] с переносом строки
                p обычный текст #[strong жирненький текст ] #[i курсив текст ] #[small small текст]
                h6 H6 Заголовок #[br] с переносом строки
                p обычный текст #[strong жирненький текст ] #[i курсив текст ] #[small small текст]
                p: img(src="@/assets/img/logo.png" alt="лого")
                p: img(src="@/assets/img/logo.png" alt="лого")
                p обычный текст #[strong жирненький текст ] #[i курсив текст] #[small small текст]
                p: img(src="@/assets/img/logo.png" alt="лого")
            hr

            hr
            section
                p параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф
                p параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф
            section
                dl
                    dt dl dt пункт списка без переноса строки
                    dd dl dd пункт списка с #[br] переноса строки
                    dt dl dt пункт списка без переноса строки
                    dd dl dd пункт списка с #[br] переноса строки
                p параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф

                ol
                    li ol li пункт списка без переноса строки
                    li ol li пункт списка с #[br] переноса строки
                    li ol li пункт списка без переноса строки
                p параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф
                ul
                    li ul li пункт списка без переноса строки
                    li ul li пункт списка с #[br] переноса строки
                    li ul li пункт списка без переноса строки
                p параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф
                ol
                    li ol li пункт списка без переноса строки
                    li ol li пункт списка с #[br] переноса строки
                    li ol li пункт списка без переноса строки
                ul
                    li ul li пункт списка без переноса строки
                    li ul li пункт списка с #[br] переноса строки
                    li ul li пункт списка без переноса строки
                blockquote Блочная цитата Блочная цитата Блочная цитата Блочная цитата Блочная цитата Блочная цитата Блочная цитата Блочная цитата
                table
                    caption Таблица
                    thead
                        tr
                            th th
                            th th
                            th th
                    tbody
                        tr
                            td th
                            td th
                            td th
                p параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф параграф
                p: a(href="javascript:") ссылка
                p: a(href="tel:88008000000") 88008000000
</template>

<script>

    import TheSelectOperator from '@/components/TheSelectOperator'
    import AccountAuth from '@/components/AccountAuth'
    import TextInfo from '@/components/TextInfo'
    import UploadAvatar from '@/components/UploadAvatar'

    export default {

        components: {
            TheSelectOperator,
            AccountAuth,
            TextInfo,
            UploadAvatar
        }
    }
</script>

<style lang="scss">
    .ui-list{
        display:flex;
        flex-flow:wrap;
        &__item{
            outline:2px solid #f5f5f5;
            padding:15px;
            margin:5px;
        }
    }
</style>
