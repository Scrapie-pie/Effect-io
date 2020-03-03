<template lang="pug">

    the-layout-table.page-log-dialogues(@scrolldown="scrollLoad")

        filter-drop-menu(name="last_days", key="last_days", @get="filterLast_days" slot="control" type="radio")

        filter-drop-menu(
        v-show="showCalendar"
        name="calendar",
        key="calendar",
        @get="filterCalendar"
        slot="control"

        )
        base-filter-search(
        slot="control",
        placeholder="Введите ID",

        @text="(val)=>search=val",
        )
        div(slot="control" v-if="itemListCount")
            |На странице показано {{showItemLength}} из {{ itemListCount}}

        base-table(v-if="showItemLength" v-show="last_days || date_from")
            thead
                tr
                    th Дата поступления
                    th
                    th ID
                    th Продолжительность
                    th Имя клиента

                    th Сообщения в диалоге
            tbody
                tr(v-for="(item, index) in itemList", :key="item.chat_id")
                    td
                        |{{item.date | datetimeDMY}}
                        br
                        |{{item.date | datetimeHMS}}
                    td
                        base-btn.base-table__show-hover(
                        @click="startChat(item)"
                        ) Просмотреть диалог
                    td(v-text="item.chat_id")
                    td {{item.time | datetimeStoHMS}}
                    td(v-text="item.name")
                    td(v-text="item.messages_count")
        base-no-found(v-else name="search")




</template>

<script>
import { dialogPush } from '@/modules/modules'
import { datetimeDMY, datetimeHMS, datetimeStoHMS } from '@/modules/datetime'
import TheLayoutTable from '@/components/TheLayoutTable'
import FilterDropMenu from '@/components/FilterDropMenu'

import { scrollbar, paginator, filterLastDaysAndCalendar } from '@/mixins/mixins'
export default {
    components: {
        TheLayoutTable,
        FilterDropMenu
    },
    filters: {
        datetimeDMY,
        datetimeStoHMS,
        datetimeHMS
    },
    mixins: [scrollbar, paginator, filterLastDaysAndCalendar],
    data() {
        return {
            apiMethod: 'chat/get-all',
            containerFullFillItemListClassName: {
                scrollBar: 'layout-table__content',
                item: 'base-table__tr'
            }
        }
    },
    computed: {
        paramsComp() {
            return {
                with_messages_count: 1,
                date_from: this.date_from,
                date_to: this.date_to,
                time_from: this.time_from,
                time_to: this.time_to,
                last_days: this.last_days
            }
        }
    },
    watch: {
        paramsComp() {
            if (
                this.last_days ||
                (this.date_from && this.date_to && this.time_from && this.time_to)
            ) {
                console.log('paramsComp')
                this.resetSearch()
                this.getItemList()
            }
        }
    },
    created() {},
    methods: {
        getItemList() {
            if (!this.search) return //Из за этой строчки пришлось продублировать всю функцию из paginator
            if (!this.getItemListStart) return
            this.getItemListStart = false

            if (this.showItemLength < this.itemListCount || this.itemListCount === 0) {
                this.$http.get(this.apiMethod, this.requestData).then(({ data }) => {
                    this.getItemListStart = true
                    if (data.data.count) {
                        this.itemList.push(...data.data.list)
                        this.itemListCount = data.data.count
                        this.getItemListUnique()
                        this.pageN += 1
                        this.containerFullFillItemList()
                    }
                })
            }
        },
        startChat(item) {
            let { guest_uuid, site_id, chat_id } = item

            //dialogPush(this, 'search', item, 'chat_id')

            let routeData = this.$router.resolve({
                name: 'search',
                params: { guest_uuid, site_id, chat_id }
            })
            window.open(routeData.href, guest_uuid + site_id + chat_id, 'width=1100,height=500')
        }
    }
}
</script>

<style lang="scss"></style>
