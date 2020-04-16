<template lang="pug">
    base-field(
        v-if="name=='url'"
        name="url"
        placeholder="http://..."
        v-model="url"
        )
    form.filter-drop-menu(v-else v-click-outside="val=>show=false", @submit.prevent="", :class="`filter-drop-menu_${type}`")
        fieldset.filter-drop-menu__fieldset
            legend.filter-drop-menu__title(@click="show=!show")
                |{{title}}
                span.filter-drop-menu__arrow(:class="{'filter-drop-menu__arrow_open':show}")

            .filter-drop-menu__box(:class="{'filter-drop-menu__box_open':show}")
                template(v-if="name==='calendar'")
                    app-calendar(@get="val=>modelradio=val", :options="calendarOptions")

                template(v-else)
                    .filter-drop-menu__controls
                        base-filter-search.filter-drop-menu__controls-search(
                            :item-list="itemList",
                            @result="(val)=>filterSearchResult=val",
                            v-show="name==='operator' || name==='channel'"
                        )
                        scroll-bar.filter-drop-menu__controls-scrollbar
                            ul.filter-drop-menu__controls-list(:class="`filter-drop-menu__controls-list_${type}`")
                                li.filter-drop-menu__controls-item.filter-drop-menu__controls-item_main(v-if="type!=='radio'")
                                    base-radio-check(name="allChecked", v-model="allChecked" @click="allCheckedToggle") Все {{titleName[name]}}
                                li.filter-drop-menu__controls-item(
                                v-for="(item, index) in filterSearchResult" :key="item.id",
                                @click="hideParent(item)"
                                )
                                    base-radio-check(
                                        v-bind="controlOpetions(item)"
                                        v-model="$data['model'+type]"
                                    )



</template>

<script>
import AppCalendar from '@/components/AppCalendar'
import ClickOutside from 'vue-click-outside'
import branchesBr from '@/modules/branchesBr'
import lodash_once from 'lodash/once'
import lodash_debounce from 'lodash/debounce'
import lodash_isArray from 'lodash/isArray'
export default {
    components: {
        AppCalendar
    },
    directives: {
        ClickOutside
    },
    filters: {
        branchesBr
    },
    props: {
        isSaveResultPage: {
            type: Boolean,
            default: false
        },
        allOutput: {
            type: Boolean,
            default: false
        },
        immediateOutput: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'checkbox'
        },
        calendarOptions: {
            type: Object,
            default: () => {
                return {}
            }
        },
        filterShowIds: {
            type: Array,
            default: () => {
                return []
            }
        },
        setValueIds:{

            default: null
        }
    },

    data() {
        return {
            url: null,
            filterSearchResult: [],
            show: false,
            modelradio: null,
            modelcheckbox: [],
            allChecked: 1,
            last_daysList: [
                { id: '1', name: 'За сутки' },
                { id: '7', name: 'За 7 дней' },
                { id: '30', name: 'За 30 дней' },
                { id: '-1', name: 'Выбрать интервал' }
            ],
            ballList: [
                { id: 0, name: 'Без оценки' },
                { id: 1, name: 'С оценкой "плохо"' },
                { id: 2, name: 'С оценкой "средне"' },
                { id: 3, name: 'С оценкой "хорошо"' }
            ],
            statusList: [
                { id: 'active', name: 'Текущие (онлайн)' },
                { id: 'auto_finished', name: 'Завершенные автоматически' },
                { id: 'manually_finished', name: 'Завершенные вручную' },
                { id: 'missed', name: 'Пропущенные' },
                { id: 'overdue', name: 'Просроченные (более 30 сек.)' }
            ],
            urlListData: [],
            titleName: {
                branch: 'отделы',
                url: 'страницы',
                operator: 'сотрудники',
                ball: 'оценки',
                status: 'статусы',
                siteCompany: 'каналы'
            },
            modelPrev: [],
            startOnce: true
        }
    },
    computed: {
        getFilterSelectStore() {
            if (this.name in this.filterSelectStore === false) return false
            return this.itemList.filter(item => this.filterSelectStore[this.name].includes(item.id))
        },
        filterSelectStore() {
            return this.$store.state.filterSelect
        },
        title() {
            if (this.type === 'radio') {
                if (this.modelradio) return this.modelradio.name
            }

            if (this.name === 'calendar') {
                let strDate = ''
                if (this.modelradio) {
                    if (this.calendarOptions?.mode === 'single') {
                        strDate = `${this.modelradio.date_from} | ${this.modelradio.time_from} - ${this.modelradio.time_to}`
                    } else {
                        strDate = `${this.modelradio.date_from} - ${this.modelradio.date_to}`
                    }
                } else {
                    if (this.calendarOptions?.mode === 'single') strDate = 'Выбрать дату'
                    else strDate = 'Интервал не выбран'
                }

                return strDate
            }

            let preffix = 'Все '
            let title = this.titleName[this.name]
            if (this.allChecked) return preffix + title
            else return title + ' (' + this.modelcheckbox.length + ')'
        },
        itemList() {
            //console.log(this.name,this[this.name+'List']);
            if (!this.filterShowIds.length) {
                return this[this.name + 'List']
            } else {
                return this[this.name + 'List']?.filter(item =>
                    this.filterShowIds.includes(item.id)
                )
            }
        },
        calendarList() {
            return []
        },
        urlList() {
            return this.urlListData
        },
        operatorList() {
            return this.$store.getters['operators/all'].map(item => {
                item.name =
                    item.fullName +
                    ' (' +
                    this.$options.filters.branchesBr(item.branches_names) +
                    ')'
                return item
            })
        },
        branchList() {
            return this.$store.getters['user/branchListAll'].map(item => {
                item.name = item.titleAndSite
                return item
            })
        },
        siteCompanyList() {
            return this.$store.state.user.siteCompanyList.map(item => {
                let chanalName = ''
                item.name = item.url + chanalName
                return item
            })
        },
        getStart() {
            if (this.type === 'checkbox' && this.name !== 'calendar' && this.modelcheckbox.length) {
                return this.modelcheckbox
            }
            if (this.type === 'radio' && this.modelradio) {
                return this.modelradio
            }
            return null
        }
    },
    watch: {
        url: lodash_debounce(function(val, oldVal) {
            this.$emit('get', val)
            this.$store.commit('setFilter', {
                url: val
            })
        }, 500),

        getStart(val) {
            // отправляем один раз при инициализации
            if (this.startOnce) {
                if (this.type === 'checkbox' && this.name !== 'calendar') {
                    if (this.allChecked && !this.allOutput) this.$emit('get', [])
                    else
                        this.$emit(
                            'get',
                            val.map(item => item.id)
                        )
                }
                if (this.type === 'radio') {
                    this.$emit('get', val.id)
                }

                this.startOnce = false
            }
        },
        show(val) {
            if (this.type === 'checkbox' && this.name !== 'calendar') {
                if (val === false) {
                    if (
                        this.modelPrev.map(item => item.id).join() !==
                        this.modelcheckbox.map(item => item.id).join()
                    ) {
                        //если результат не меняли, ничего не отправляем
                        if (this.allChecked && !this.allOutput) this.$emit('get', [])
                        else {
                            this.$emit(
                                'get',
                                this.modelcheckbox.map(item => item.id)
                            )
                        }
                    }
                } else {
                    // открыл фильтр первый раз изменил результат, закрыл вкладку,ушел ответ, открыл вкладку, ничего не менял, закрыл, все равно ответ ушел - это исправляет ситуацию
                    this.modelPrev = this.modelcheckbox
                }
            }
        },
        itemList: {
            handler(val, oldval) {
                if (this.type === 'checkbox') {
                    if (this.getFilterSelectStore.length) {
                        this.modelcheckbox = this.getFilterSelectStore
                    } else if (this.allChecked) {
                        //если нет query п умолчанию выставляем все
                        //console.log(this.name,val);
                        this.modelcheckbox = val
                        if(this.setValueIds) {

                            this.modelcheckbox = this.itemList.filter(item=>this.setValueIds.includes(item.id))
                        }

                    }
                } else {
                    if (this.getFilterSelectStore.length && this.isSaveResultPage) {
                        this.modelradio = this.getFilterSelectStore[0]
                    } else {
                        this.modelradio = val[0]
                        if(this.setValueIds) {
                            this.modelradio = this.itemList.find(item=>this.setValueIds===item.id)
                        }
                    }
                }
            },
            immediate: true
        },
        modelradio: {
            handler(val) {
                if (this.type === 'radio') {
                    if (!val) return
                    this.$emit('get', val.id)
                    if (this.isSaveResultPage)
                        this.$store.commit('setFilter', { [this.name]: [val.id] })
                }
                if (this.name === 'calendar') {
                    if (val && val.date_from && val.date_to) {
                        this.$emit('get', val)
                        this.$store.commit('setFilter', {
                            [this.name]: [val]
                        })
                    }

                    this.show = false
                }
            },
            immediate: true
        },
        modelcheckbox: {
            handler(val, valOld = []) {
                //if(this.name==='url' && !this.itemList.length) return       console.log('modelcheckbox',val, valOld);

                if (val.length !== this.itemList.length) this.allChecked = false
                if (!this.show && this.immediateOutput) {
                    console.log('this.filterShowIds',this.filterShowIds);
                     this.$emit(
                         'get',
                         val.map(item => item.id)
                     )
                    //this.$store.commit('setFilter', { [this.name]: val.map(item=>item.id) })
                }

                this.modelPrev = valOld
            },
            immediate: true
        }
    },
    created() {
        if (this.name === 'url') {
            this.url = this.filterSelectStore[this.name]
            /* this.$http.get('site/pages').then(({ data }) => {
                data = data.data.map(item => {
                    return { id: item, name: item }
                })

                this.urlListData = [...data]
            })*/
        }
    },
    mounted() {
        this.popupItem = this.$el
    },

    methods: {
        controlOpetions(item) {
            let obj = {
                type: this.type,
                name: this.name,
                value: item,
                text: item.name
            }
            return obj
        },
        allCheckedToggle() {
            this.allChecked = !this.allChecked
            if (this.allChecked) {
                this.modelcheckbox = this.itemList
            } else this.modelcheckbox = []
        },
        hideParent(item) {
            if (this.type === 'radio') {
                this.show = false
            }
        }
    }
}
</script>

<style lang="scss">
.filter-drop-menu {
    $el: '.filter-drop-menu';
    $color_hover: glob-color('info-lighten');
    $transition: $glob-trans;

    position: relative;

    &__title {
        @extend %h4;
        display: inline-block;
        position: relative;
        width: auto;
        padding-right: 40px;
        cursor: pointer;
        margin-bottom: 0;
        &:first-letter {
            text-transform: uppercase;
        }
    }
    &__arrow {
        @extend %g-icon-down;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        &_open {
            @extend %g-icon-down_open;
        }
    }
    &__box {
        margin-top: calc-em(10);
        transform: translateY(25%);
        @include box-decor();
        position: absolute;
        left: 0;
        top: 100%;
        z-index: 1;
        padding: calc-em(15) calc-em(15);
        opacity: 0;
        visibility: hidden;

        transition: $transition;

        &_open {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
    }

    &__text {
    }

    &_radio {
        .base-radio-check {
            &__input:checked + .base-radio-check__text-wrap {
                background-color: $color_hover;
            }
            &__text-wrap {
                padding: calc-em(5) calc-em(15);
                white-space: nowrap;
                transition: $transition;
                &:before {
                    display: none;
                }
            }
            &__check {
                display: none;
            }
            &__text {
                margin-left: 0;
            }
        }
        #{$el}__box {
            padding-left: 0;
            padding-right: 0;
        }
    }
    &__controls {
        &-scrollbar {
            margin-right: -1 * calc-em(15);
            padding-right: calc-em(15);
            max-height: 35vh;
        }
        &-search {
            margin-bottom: calc-em(15);
        }

        &-item {
            #{$el}_checkbox &:not(&_main) {
                margin-left: calc-em(25);
            }

            & + & {
                margin-top: calc-em(5);
            }
            white-space: nowrap;
        }
    }
}
</style>
