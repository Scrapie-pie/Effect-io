<template lang="pug">

    article
        h1 Ui
        hr
        section
            h2 Елементы
            hr
            ul.ui-list
                li.ui-list__item
                    base-btn(@click="$root.$emit('popup','notFind')") Попап ограничения
                li.ui-list__item
                    base-no-found(name="team")
                    base-no-found(name="visitors")
                    base-no-found(name="process")
                    base-no-found(name="chat")
                li.ui-list__item
                    ul.ul-row
                        li
                            the-chat-main-header
                        li
                            the-chat-main-footer

                li.ui-list__item
                    ul.ul-row
                        li
                            box-controls(:show="true")
                                select-operators
                        li
                            box-controls(:show="true")
                                select-operators(name="mention")

                li.ui-list__item

                li.ui-list__item
                    box-controls(:show="true")
                        the-offer
                li.ui-list__item
                    box-controls(:show="true")
                        the-files-board(name="smiles")
                li.ui-list__item
                    box-controls(:show="true")
                        the-files-board(name="gifs")
                li.ui-list__item
                    box-controls(:show="true")
                        the-chat-main-header-history
                li.ui-list__item
                    ul.ul-row
                        li
                            box-controls(:show="true")
                                the-chat-main-header-actions()
                        li
                            box-controls(:show="true")
                                the-chat-main-header-actions(:showBlockClient="true")

                li.ui-list__item
                    ul.ul-row
                        li
                            box-controls(:show="true")
                                the-phrases-ready
                        li
                            box-controls(:show="true")
                                the-phrases-ready(:showPhrasesNew="true")

                li.ui-list__item
                    base-btn(:icon="{name:'edit',box:true}" theme="default")

                li.ui-list__item
                    base-people(text="текст" name="имя" datetime="12.13.14")
                    base-people(text="текст" name="имя" datetime="12.13.14" :right="true")

                li.ui-list__item
                    upload-avatar
                li.ui-list__item
                    base-avatar
                li.ui-list__item
                    form
                        legend forma
                        ul
                            li
                                base-radio-check(name="notifications") Включить браузерные уведомления

                            li
                                base-field(
                                type="search"
                                name="search",
                                placeholder="theme=soft"
                                theme="soft"

                                )
                            li
                            li
                                base-field(
                                    type="search"
                                    name="search",
                                    placeholder="Поиск..."

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

                            li

                                base-btn() Основная кнопка
                                base-btn(theme="link") theme="link"
                                base-btn(color="error") color="error"
                                base-btn(theme="sign") theme="sign"
                                base-btn(theme="default") theme="default"
                                base-btn(color="info-dark" size="lg") color="info-dark" size="lg"
                                base-btn(color="succsess-dark" size="lg") color="succsess-dark" size="lg"
                                base-btn(:icon="{name:'edit',box:true}" color="info-lighten")

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
import TheChatMainFooter from '@/components/TheChatMainFooter'
import TheChatMainHeader from '@/components/TheChatMainHeader'
import TheOffer from '@/components/TheOffer'
import TheFilesBoard from '@/components/TheFilesBoard'
import TheChatMainHeaderHistory from '@/components/TheChatMainHeaderHistory'
import TheChatMainHeaderActions from '@/components/TheChatMainHeaderActions'
import ThePhrasesReady from '@/components/ThePhrasesReady'
import SelectOperators from '@/components/SelectOperators'
import AccountAuth from '@/components/AccountAuth'
import TextInfo from '@/components/TextInfo'
import UploadAvatar from '@/components/UploadAvatar'

export default {
	components: {
		TheChatMainHeader,
		TheChatMainFooter,
		TheOffer,
		TheFilesBoard,
		TheChatMainHeaderHistory,
		TheChatMainHeaderActions,
		ThePhrasesReady,
		SelectOperators,
		AccountAuth,
		TextInfo,
		UploadAvatar
	}
}
</script>

<style lang="scss">
.ul-row {
	@extend %row-flex;
}
.ui-list {
	flex-flow: wrap;
	&__item {
		outline: 1px solid black;
		padding: 15px;
	}
}
</style>
