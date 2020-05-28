<template lang="pug">

    form(@submit.prevent="submit").page-scenario-settings-conditions
        base-wait(name="pageScenarioSettingsConditions")

        ul.settings-list

            li.settings-list__item
                h3.settings-list__name Страницы сайта
                ul.settings-list__sub
                    li.settings-list__sub-item
                        base-field.settings-list__control.settings-list__select(
                        type="select",
                        :selectOptions="{value:model.conditions.site_pages_set,label:'name',options:sitePagesSetList,reduce:(e)=>e.value}"
                        name="site_pages_set"
                        v-model="model.conditions.site_pages_set"
                        )

                    li.settings-list__sub-item
                        base-field.settings-list__control.settings-list__field(
                        type="text",
                        placeholder="Введите url страницы",
                        name="site_pages"
                        v-model="model.conditions.site_pages[0]"
                        )
            li.settings-list__item
                h3.settings-list__name Время показа
                ul.settings-list__sub
                    li.settings-list__sub-item
                        .page-scenario-settings-conditions__time-show
                            base-radio-check.settings-list__control(
                                name="guaranteed_show_after"
                                v-model="model.conditions.guaranteed_show_after"
                            ) Гарантированный показ через
                            base-field.settings-list__control.settings-list__field(
                                type="text",

                            name="guaranteed_show_after_time"
                            v-model.number="model.conditions.guaranteed_show_after_time"
                            )
                            select-time-size.settings-list__control.settings-list__select(name="guaranteed_show_after_time_units"  v-model="model.conditions.guaranteed_show_after_time_units")
                    li.settings-list__sub-item
                        .page-scenario-settings-conditions__time-show
                            base-radio-check.settings-list__control( name="show_strictly_not_earlier"
                            v-model="model.conditions.show_strictly_not_earlier") Показ строго не ранее
                            base-field.settings-list__control.settings-list__field(
                                type="text",
                            name="show_strictly_not_earlier_time"  v-model.number="model.conditions.show_strictly_not_earlier_time"
                            )
                            select-time-size.settings-list__control.settings-list__select(name="show_strictly_not_earlier_time_units"  v-model="model.conditions.show_strictly_not_earlier_time_units")





                    li.settings-list__sub-item
                        base-radio-check.settings-list__control(name="branch_off_hours" v-model="model.conditions.branch_off_hours") Нерабочее время отдела
            li.settings-list__item
                h3.settings-list__name Поведение посетителя
                ul.settings-list__sub
                    li.settings-list__sub-item
                        base-radio-check.settings-list__control(name="first_time" v-model="model.conditions.first_time") Впервые на сайте
                    li.settings-list__sub-item
                        base-radio-check.settings-list__control(name="active_button_click" v-model="model.conditions.active_button_click") Нажал на активную кнопку виджета
                    li.settings-list__sub-item
                        base-radio-check.settings-list__control(name="trying_leave" v-model="model.conditions.trying_leave") Пытается уйти с сайта
                    li.settings-list__sub-item
                        base-radio-check.settings-list__control(name="browsing_other_tab" v-model="model.conditions.browsing_other_tab") Начал просмотр других вкладок, не закрывая сайт
                    li.settings-list__sub-item
                        .page-scenario-settings-conditions__time-show
                            base-radio-check.settings-list__control(name="returns_after" v-model="model.conditions.returns_after") Вернулся после закрытия сайта через
                            base-field.settings-list__control.settings-list__field(
                            type="text",
                            name="returns_after_interval"
                            v-model.number="model.conditions.returns_after_interval"
                            )
                            select-time-size.settings-list__control.settings-list__select(name="show_strictly_not_earlier_time_units"  v-model="model.conditions.returns_after_interval_units")
                    li.settings-list__sub-item
                        .page-scenario-settings-conditions__time-show
                            base-radio-check.settings-list__control(name="browsed_not_less" v-model="model.conditions.browsed_not_less") Просмотрел не менее
                            base-field.settings-list__control.settings-list__field(
                            type="text",
                            name="browsed_not_less_pages"
                            v-model.number="model.conditions.browsed_not_less_pages"
                            )
                            span страниц

                    li.settings-list__sub-item
                        base-radio-check.settings-list__control.settings-list__sub-item(name="scrolled_to_end"  v-model="model.conditions.scrolled_to_end") Пролистал до конца страницу
                        base-field.settings-list__control.settings-list__field(
                        type="text",
                        placeholder="Введите url страницы",
                        name="scrolled_to_end_page"
                        v-model="model.conditions.scrolled_to_end_page[0]"
                        )
            li.settings-list__item
                h3.settings-list__name Источники и метки
                ul.settings-list__sub.page-scenario-settings-conditions__sourse
                    li.settings-list__sub-item
                        base-radio-check.settings-list__control.settings-list__sub-item(name="only_if_comes_from" v-model="model.conditions.only_if_comes_from") Выводить сообщение только если перешел с сайта
                        base-field.settings-list__control.settings-list__textarea(
                        type="textarea",
                        maxlength="2000"
                        placeholder="Введите адреса сайтов (url), каждый с новой строки",
                        name="only_if_comes_from_site"
                        v-model="model.conditions.only_if_comes_from_site"
                        )
                    li.settings-list__sub-item
                        base-radio-check.settings-list__control.settings-list__sub-item(name="only_moved_by_tag"   v-model="model.conditions.only_moved_by_tag") Выводить сообщение, только если перешел по метке
                        base-field.settings-list__control.settings-list__textarea(
                        type="textarea",
                        maxlength="2000"
                        placeholder="Ввдите метки без кавычек, каждая с новой строки",
                        name="only_moved_by_tag_value"
                        v-model="model.conditions.only_moved_by_tag_value"

                        )
                    li.settings-list__sub-item
                        base-radio-check.settings-list__control.settings-list__sub-item(name="only_by_key_phrase"  v-model="model.conditions.only_by_key_phrase") Выводить сообщение, только если перешел по ключевой фразе
                        base-field.settings-list__control.settings-list__textarea(
                        type="textarea",
                        maxlength="2000"
                        placeholder="Введите фразы, каждая с новой строки",
                        name="only_by_key_phrase_value"
                        v-model="model.conditions.only_by_key_phrase_value"
                        )
            li.settings-list__item
                h3.settings-list__name Настройка на аудиторные сегменты
                base-radio-check.settings-list__control.settings-list__sub-item(name="only_if_known_name" v-model="model.conditions.only_if_known_name") Выводить сообщение только если известно имя посетителя

            li.settings-list__item
                h3.settings-list__name География посетителя
                .settings-list__item
                ul.settings-list__sub
                    li.settings-list__item

                        select-countries.settings-list__control(v-model="model.conditions.country")
                    li.settings-list__item
                        select-cities-and-regions.settings-list__control(

                            label="Выберите города и регионы"
                            v-model="model.conditions.cities_and_regions"
                            name="cities_and_regions",
                            :country-code="model.conditions.country"
                        )

                    li.settings-list__item
                        select-cities-and-regions.settings-list__control(
                            label="За исключением регионов"
                            v-model="model.conditions.cities_and_regions_excluding"
                            name="cities_and_regions_excluding",
                            :country-code="model.conditions.country"
                        )

        pre {{model}}
        base-btn(type="submit") Сохранить и продолжить
</template>

<script>
import browserNotification from '@/modules/browserNotification'
import SelectTimeSize from '@/components/SelectTimeSize'
import SelectCitiesAndRegions from '@/components/SelectCitiesAndRegions'
import SelectCountries from '@/components/SelectCountries'
import { scenarioSettings } from '@/mixins/mixins'

export default {
    components: {
        SelectCountries,
        SelectCitiesAndRegions,
        SelectTimeSize
    },
    mixins: [scenarioSettings],
    data() {
        return {
            countryList: [],
            citiesAndRegionsList: [],
            timeSizeList: [
                { name: 'Минут', value: 1 },
                { name: 'Секунд', value: 0 }
            ],

            sitePagesSetList: [
                { name: 'На всех страницах сайта', value: 0 },
                { name: 'Только на главной', value: 1 },
                { name: 'На указанной', value: 2 },
                { name: 'На всех кроме', value: 3 }
            ],
            model: {
                conditions: {
                    site_pages_set: 0,
                    site_pages: [],
                    guaranteed_show_after: 0,
                    guaranteed_show_after_time: 0,
                    guaranteed_show_after_time_units: 0,
                    show_strictly_not_earlier: 0,
                    show_strictly_not_earlier_time: 0,
                    show_strictly_not_earlier_time_units: 0,
                    branch_off_hours: 0,
                    first_time: 0,
                    active_button_click: 0,
                    trying_leave: 0,
                    browsing_other_tab: 0,
                    returns_after: 0,
                    returns_after_interval: 0,
                    returns_after_interval_units: 0,
                    browsed_not_less: 0,
                    browsed_not_less_pages: '',
                    scrolled_to_end: 0,
                    scrolled_to_end_page: [],
                    only_if_comes_from: 0,
                    only_if_comes_from_site: [],
                    only_moved_by_tag: 0,
                    only_moved_by_tag_value: [],
                    only_by_key_phrase: 0,
                    only_by_key_phrase_value: '',
                    only_if_known_name: 0,
                    country: '',
                    cities_and_regions: [],
                    cities_and_regions_excluding: []
                }
            }
        }
    },

    computed: {},
    watch: {},
    created() {},
    methods: {
        submit() {
            this.model.cities_and_regions.map(objectAndId => {
                if (objectAndId.id) return objectAndId.id
                else return objectAndId
            })
            this.model.cities_and_regions_excluding.map(objectAndId => {
                if (objectAndId.id) return objectAndId.id
                else return objectAndId
            })
            this.$store.dispatch('scenario/changeItem', this.model).then(() => {
                browserNotification('Сохранено')
                this.$router.push({ name: 'scenarioSettingsTimeTable' })
            })
        }
    }
}
</script>
<style lang="scss">
.page-scenario-settings-conditions {
    &__time-show {
        display: grid;
        grid-template-columns: minmax(max-content, 221px) 60px 107px;
        align-items: center;
        gap: calc-em(15);
    }

    &__sourse {
        .settings-list__textarea {
            margin-left: 2.5em;
        }
    }
}
</style>
