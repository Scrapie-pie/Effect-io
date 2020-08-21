<template lang="pug">
    nav-aside.the-last-messages
        form.last-messages-v
            base-wait(name="lastMessages")
            .last-messages-v__search()
                base-filter-search(
                    :item-list="itemListSort",
                    @result="(val)=>filterSearchResult=val",
                    @text="(val)=>search=val"
                )
            scroll-bar.last-messages-v__scrollbar(@ps-scroll-down="scrollLoad" ref="scrollbar")
                ul.last-messages-v__list
                    li.last-messages-v__item(
                        v-for="(item, index) in filterSearchResult",
                        :key="item.guest_uuid+item.site_id+item.chat_id",
                        :class="item.classList",
                        @click="router($event,item)"
                    )
                        .last-messages-v__timer(
                            v-if="timerVisible(item)",
                            v-text="timer(item)"
                            )

                        //router-link.last-messages-v__btn(
                            :to="item.rootLinkOptions.link"
                            v-text="item.rootLinkOptions.text"
                            )
                        base-people.last-messages-v__people(v-bind="item.basePeopleOptions")
                        .last-messages-v__tag-info(v-if="item.no_tag && viewModeChat==='visitors'") Нет тега
                        process-actions(:paramsIds="{guest_uuid:item.guest_uuid,site_id:item.site_id}" v-if="viewModeChat==='process'")



</template>

<script>
import NavAside from '@/components/NavAside'
import ProcessActions from '@/components/ProcessActions'
import lodash_sortBy from 'lodash/sortBy'
import lodash_difference from 'lodash/difference'

import { viewModeChat, httpParams, scrollbar, paginator } from '@/mixins/mixins'
import { wrapTextUrls } from '@/modules/modules'
import { datetimeStoHMS } from '@/modules/datetime'

export default {
    components: { NavAside, ProcessActions },
    mixins: [viewModeChat, httpParams, scrollbar, paginator],

    data() {
        return {
            timerNowId: '',
            timerNow: new Date().getTime() / 1000,

            filterSearchResult: [],
            sortMas: [
                item => !item.very_hot,
                item => !item.hot,
                item => -item.basePeopleOptions.count,
                item => -item.last_message_time
            ],
            containerFullFillItemListClassName: {
                scrollBar: 'last-messages-v__scrollbar',
                item: 'last-messages-v__item'
            },

            pageNBeforeSearch: null,
            type: ''
        }
    },
    computed: {
        itemListStore() {
            let itemList = []

            if (this.viewModeChat === 'process') itemList = this.$store.state.visitors.process
            if (this.viewModeChat === 'visitors') itemList = this.$store.state.visitors.self
            if (['search', 'visor'].includes(this.viewModeChat))
                itemList = this.$store.state.visitors[this.viewModeChat]

            return itemList.slice()
        },
        itemListStoreFormat() {
            return this.itemListStore.map(item => this.itemFormat(item))
        },
        itemListSort() {
            return lodash_sortBy(this.itemListStoreFormat, this.sortMas)
        },
        itemListSortActiveFirst() {
            let itemActive,
                list = this.itemListSort.filter((item, index) => {
                    if (item.guest_uuid === this.httpParams.params.guest_uuid) {
                        //Todo у оператора id
                        itemActive = item
                        return false
                    } else return true
                })
            if (list.length) list.unshift(itemActive)

            return list
        },

        paramsComp() {
            return {
                type: this.type
            }
        },
        visitorInfo() {
            return this.$store.state.visitors.itemOpen
        },
        itemListStoreItemPush() {
            if (this.visitorInfo) return [this.visitorInfo, this.itemListStore]
            return []
        }
    },
    watch: {
        pageN(val) {
            if (!this.search) {
                if (this.viewModeChat === 'process')
                    this.$store.commit('visitors/setProcessLastPageN', val)
                if (this.viewModeChat === 'visitors')
                    this.$store.commit('visitors/setSelfLastPageN', val)
            }
        },
        filterSearchResult(val) {
            if (
                val.length &&
                (this.$route.name === 'processAll' || this.$route.name === 'messageAll')
            ) {
                if (val[0].rootLinkOptions.link) {
                    this.$router.push(val[0].rootLinkOptions.link)
                }
            }
            if (!val.length && this.$route.name === 'process') {
                console.log("!val.length && this.$route.name==='process'push({name:'processAll")
                setTimeout(() => {
                    this.$router.push({ name: 'processAll' })
                }, 200) //иначе происходит переход делается запрос, и бэк отдает как будто список есть, начинается зацикливание
            }
        },
        $route(to, from) {
            if (['search', 'visor'].includes(this.viewModeChat)) {
                return
            }

            if (this.viewModeChat === 'process') this.type = 'unprocessed'
            if (this.viewModeChat === 'visitors') this.type = 'self'

            if (to.name !== from.name) {
                this.setLastPageN()
                if (this.itemListStore.length) return
                this.resetSearch()
                this.getItemList()
            }
        },
        search: 'debounceSearch'
    },

    created() {
        this.timerNowId = setInterval(() => {
            this.timerNow = new Date().getTime() / 1000
        }, 1000)
        if (['search', 'visor'].includes(this.viewModeChat)) return

        if (this.viewModeChat === 'process') this.type = 'unprocessed'
        if (this.viewModeChat === 'visitors') this.type = 'self'
        this.setLastPageN()
        //if (!this.itemListStore.length) {
        this.getItemList()
        //}

        this.$root.$on('lastMessageVResetItemList', this.resetItemList)
    },
    /*  beforeUpdate(){

            this.timerNowId = setInterval(()=>{
                this.timerNow=new Date().getTime()/1000
                console.log('tic updated');
            },1000)
        },*/
    beforeDestroy() {
        this.$root.$off('lastMessageVResetItemList', this.resetItemList)
        clearInterval(this.timerNowId)
    },
    methods: {
        resetItemList() {
            //Используею в компоненте processActions
            this.resetSearch()
            this.getItemList()
        },
        timerVisible(item) {
            if (!this.timerNow || item.very_hot || item.chat_ended) return false
            if (item.hot && item.awaiting_answer_timeFormat) return true
        },
        timerHotLevel(item) {
            let seconds = Math.round(this.timerNow - item.awaiting_answer_timeFormat)
            let level = 0
            if (seconds > 30) level = 1
            if (seconds > 60) level = 2
            if (seconds > 120) level = 3
            if (seconds > 180) level = 4

            return level
        },
        timer(item) {
            return datetimeStoHMS(Math.round(this.timerNow - item.awaiting_answer_timeFormat), true)
        },
        setName(item, visitorInfo) {
            if (item.very_hot || item.hot===5) return item.name
            if (item.guest_uuid + item.site_id === visitorInfo.guest_uuid + visitorInfo.site_id)
                return visitorInfo.regRuLogin || visitorInfo.name
            else return item.name
        },
        setLastPageN() {
            if (this.viewModeChat === 'process' && this.$store.state.visitors.processLastPageN)
                this.pageN = this.$store.state.visitors.processLastPageN
            if (this.viewModeChat === 'visitors' && this.$store.state.visitors.selfLastPageN)
                this.pageN = this.$store.state.visitors.selfLastPageN
        },
        itemFormatSetClassList(item) {
            let open
            if (this.httpParams) {
                let { guest_uuid, site_id, chat_id } = this.httpParams.params
                open =
                    item.guest_uuid + item.site_id + item.chat_id === guest_uuid + site_id + chat_id
            }
            item.classList = {}
            item.classList['last-messages-v__item_active'] = open
            item.classList['last-messages-v__item_chat_ended'] = item.chat_ended

            if(!item.chat_ended) {
                item.classList['last-messages-v__item_hot'] = item.hot
                item.classList[`last-messages-v__item_hot_status_`+item.hot] = true
                item.classList['last-messages-v__item_very-hot'] = item.very_hot
                item.classList['last-messages-v__item_very-hot_status_'+item.very_hot] = true
            }
            item.classList['last-messages-v__item_no_tag'] = item.no_tag

            return item
        },
        itemFormatSetOptions(item) {
            item.basePeopleOptions = {
                avatarUrl: item.photo,
                avatarStub: item.photo_stub,
                avatarName: item.avatarName,
                name: this.setName(item, this.visitorInfo),
                regRuLogin: item.regRuLogin,
                text: wrapTextUrls(item.last_authorAndMessage),
                channelName: this.$store.getters.channelName(item.channel_type),

                bgTextNoFill: true,
                count: item.unread.length
                //hidden: true
            }

            return item
        },
        itemFormatSetLink(item) {
            let routName = ''
            if (this.viewModeChat === 'process') routName = this.viewModeChat
            if (this.viewModeChat === 'visitors') routName = 'chatId'
            item.rootLinkOptions = {
                link: {
                    name: routName,
                    params: {
                        guest_uuid: item.guest_uuid,
                        site_id: item.site_id,
                        chat_id: item.chat_id
                    }
                },
                text: item.last_message
            }
            return item
        },
        itemFormat(item) {
            item = Object.assign({}, item) //Очень важная строчка, иначе в хранилище все поля форматирования попадали

            item = this.itemFormatSetClassList(item)
            item = this.itemFormatSetLink(item)


            if(!item.chat_ended) {
                if (item.very_hot===1) {
                    ///такое только в не обработанном
                    item.avatarName = 'warning'
                    item.name = 'Диалог необходимо <br> принять <br> в приоритетном порядке!'
                    item.last_authorAndMessage = 'Передача диалога...'

                    item = this.itemFormatSetOptions(item)
                    return item

                }

                if (!item.very_hot && item.hot===5) {
                    item.name = 'Гость <br> Возможно диалог <br> требует ответа'
                    console.log(item.name);
                    item = this.itemFormatSetOptions(item)
                    return item
                }
            }



                item.last_authorAndMessage = this.authorAndMessage(item)



            item = this.itemFormatSetOptions(item)
            return item
        },
        authorAndMessage({ last_message_author, last_message, files }) {
            let author = ''
            if (!last_message && files && files.length) last_message = 'Прикреплены файлы'
            if (last_message_author) author = last_message_author + ': '
            if (author && last_message) last_message = author + last_message
            return last_message
        },

        debounceSearchMethods(val, oldVal) {
            if (['search', 'visor'].includes(this.viewModeChat)) return

            if (!oldVal) this.pageNBeforeSearch = this.pageN //запоминаем загруженную страницу

            this.resetSearch()

            if (!val) {
                // что бы после поиска начать загружать дальше, а не завного
                this.pageN = this.pageNBeforeSearch
                return
            }

            this.getItemList()
            this.scrollbarScrollerPush(this.$refs.scrollbar, 0)
        },
        getItemListUnique() {
            let itemListStore = this.itemListStore.slice()

            let itemListNew = []
            let itemListOld = []

            this.itemList.filter(item => {
                let findIndex = this.itemListStore.findIndex(
                    itemStore =>
                        itemStore.guest_uuid + itemStore.site_id === item.guest_uuid + item.site_id
                )
                if (findIndex !== -1) {
                    itemListStore[findIndex] = item
                    let { guest_uuid, site_id } = item
                    itemListOld.push({ guest_uuid, site_id })
                } // обновляем в базе элемент если такой пришел из поиска
                else {
                    itemListStore.push(item) // если в базе нет, добавляем в базу
                    let { guest_uuid, site_id } = item
                    itemListNew.push({ guest_uuid, site_id }) // если в базе нет, добавляем в базу
                }
            })

            if (this.viewModeChat === 'process')
                this.$store.commit('visitors/process', { list: itemListStore })
            if (this.viewModeChat === 'visitors')
                this.$store.commit('visitors/self', { list: itemListStore })
        },
        router(event, item) {
            //console.log(event,item);

            let query = {
                forMobileShowChat:true
            }
            item.rootLinkOptions.link.query=query
            this.$router.push(item.rootLinkOptions.link)
            //console.log(event);
        }
    }
}
</script>

<style lang="scss">
.last-messages-v {
    $el:'.last-messages-v';
    $color_bg-hover: glob-color('border');
    $color_bg-error: glob-color('error');
    $color_bg-accent: glob-color('accent');
    $color_bg-info: glob-color('info');
    $color_bg-info-dark: glob-color('info-dark');
    $color_light: glob-color('light');
    $transition: $glob-trans;

    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;

    .ps__scrollbar-y-rail {
        z-index: 2;
    }

    &__search {
        padding-left: calc-em(10);
        padding-right: calc-em(10);
    }

    &__scrollbar {
        height: 100%;
    }

    &__list {
        padding-top: calc-em(10);
    }

    &__item {
        position: relative;
        transition: $transition;
        padding-left: calc-em(10);
        padding-right: calc-em(10);
        padding-top: calc-em(10);
        padding-bottom: calc-em(10);
        cursor: pointer;

        &:hover,
        &_active {
           // background-color: $color_bg-hover;
            filter: brightness(0.9);
        }

        &_chat_ended#{$el}__item_no_tag {

            border:4px solid $color_bg-info-dark;

            #{$el}__tag-info {
                background-color:$color_bg-info-dark;
                color:$color_light;
            }
        }

        &_hot,
        &_very-hot {
            &::before {
                content: '';
                @extend %full-abs;

                opacity: 0.5;
                z-index: 0;
            }
        }

        &_hot {
            &_status_3:before {
                background-color: $color_bg-accent;
                //opacity: 1;
            }
            &_status_4:before {
                background-color: $color_bg-error;
            }
            &_status_5:before {
                opacity:1;
                background-color: #c4f2ff ;
            }
        }


        &_very-hot {
            &_status_1::before {
                background-color: $color_bg-info;
            }
            &_status_2::before,
            &_status_3::before {
                background-color: #e3ecfb;
                opacity:1;
            }
        }
    }

    &__people {
        z-index: 2;
        position: relative;
        pointer-events: all;

        .base-people__inner {
            flex: 1 0 60%;
            width: 60%;
            min-width: 0;
        }
    }

    &__btn {
        @extend %full-abs;
        z-index: 2;
        width: 100%;
        height: 100%;
        border-color: transparent;
        font-size: 0;
    }
    &__item_hot_status_2 &__timer,
    &__item_hot_status_3 &__timer,
    &__item_hot_status_4 &__timer,
    &__item_hot_status_5 &__timer {
        background-color: $color_bg-error;
        color: $color_light;
    }
    &__timer {
        position: absolute;
        right: 0;
        top: 0;
        //font-size:$glob-font-size_small;
        padding: calc-em(3) calc-em(10);
    }

    .process-actions {
        &__list {
            justify-content: flex-end;
        }
        &__item_no {
            display: none;
        }

        .btn {
            font-size: inherit;
        }
    }

    &__tag-info {
        position: absolute;
        bottom: 0;
        right: 0;
        display: inline-block;
        background-color:$color_light;

        padding:.1em .75em;
    }
}
</style>
