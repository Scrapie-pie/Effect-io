<template lang="pug">
    nav-aside
        form.last-messages
            base-wait(name="lastMessages")
            .last-messages__search()
                base-filter-search(
                    :item-list="itemListSort",
                    @result="(val)=>filterSearchResult=val",
                    @text="(val)=>search=val"
                )
            scroll-bar.last-messages__scrollbar(@ps-scroll-down="scrollLoad" ref="scrollbar")
                ul.last-messages__list
                    li.last-messages__item(
                        v-for="(item, index) in filterSearchResult",
                        :key="item.guest_uuid+item.site_id+item.chat_id",
                        :class="item.classList",
                        @click="router($event,item)"
                    )
                        .last-messages__timer(
                            v-if="timerVisible(item)",
                            v-text="timer(item,timerNow,index)"
                            )

                        //router-link.last-messages__btn(
                            :to="item.rootLinkOptions.link"
                            v-text="item.rootLinkOptions.text"
                            )
                        base-people.last-messages__people(v-bind="item.basePeopleOptions")
                        process-actions(:paramsIds="{guest_uuid:item.guest_uuid,site_id:item.site_id}" v-if="viewModeChat=='process'")



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
                scrollBar: 'last-messages__scrollbar',
                item: 'last-messages__item'
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
        if (!this.itemListStore.length) {
            this.getItemList()
        }
    },
    /*  beforeUpdate(){

            this.timerNowId = setInterval(()=>{
                this.timerNow=new Date().getTime()/1000
                console.log('tic updated');
            },1000)
        },*/
    beforeDestroy() {
        clearInterval(this.timerNowId)
    },
    methods: {
        timerVisible(item) {
            if (!this.timerNow) return
            if (item.hot && item.awaiting_answer_time) return true
        },
        timer(item, timerNow, index) {
            return datetimeStoHMS(Math.round(timerNow - item.awaiting_answer_time), true)
        },
        setName(item, visitorInfo) {
            if (item.very_hot) return item.name
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
            item.classList['last-messages__item_active'] = open
            item.classList['last-messages__item_hot'] = item.hot
            item.classList['last-messages__item_very-hot'] = item.very_hot

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

            if (item.very_hot) {
                ///такое только в не обработанном
                item.avatarName = 'warning'
                item.name = 'Диалог необходимо <br> принять <br> в приоритетном порядке!'
                item.last_authorAndMessage = 'Передача диалога...'
            } else {
                item.last_authorAndMessage = this.authorAndMessage(item)
            }
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

            this.$router.push(item.rootLinkOptions.link)
            //console.log(event);
        }
    }
}
</script>

<style lang="scss">
.last-messages {
    $color_bg-hover: glob-color('border');
    $color_bg-error: glob-color('error');
    $color_bg-info: glob-color('info');
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
            background-color: $color_bg-hover;
        }

        &_hot,
        &_very-hot {
            &::before {
                content: '';
                @extend %full-abs;
                background-color: $color_bg-error;
                opacity: 0.5;
                z-index: 0;
            }
        }
        &_very-hot {
            &::before {
                background-color: $color_bg-info;
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

    //////
    &__timer {
        background-color: $color_bg-error;
        color: $color_light;
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
}
</style>
