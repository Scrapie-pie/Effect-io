<template lang="pug">
    article.page-all
        the-layout-table.page-log-dialogues(@scrolldown="scrollLoad")

            filter-drop-menu(is-save-result-page name="last_days", @get="filterLast_days" slot="control" type="radio" key="last_days")

            filter-drop-menu(
                is-save-result-page
                v-show="showCalendar"
                name="calendar",
                @get="filterCalendar"
                slot="control"
                key="calendar"
               )

            filter-drop-menu(
                name="siteCompany",
                key="siteCompany",
                @get="val=>sites_ids=val"
                slot="control"
                )
            filter-drop-menu(
                name="operator",
                @get="val=>users_ids=val"
                slot="control"
                key="operator"
                )


            filter-drop-menu(
                name="status",
                key="status",
                @get="val=>statuses=val"
                slot="control"
                )
            filter-drop-menu(
                name="ball",
                key="ball",
                @get="val=>rates=val"
                slot="control"
                )
            //base-field(name="url" slot="control"  key="url", placeholder="Страницы", @input="val=>url=[val]", :value="url")

            filter-drop-menu(
                is-save-result-page
                name-alias-for-filter-store="pageAllDialoguesTags"
                name="tag",
                key="tag",
                @get="val=>tags_ids=val"
                slot="control"
            )
            filter-drop-menu(
                name="url",
                key="url",
                @get="val=>url=val"
                slot="control"
                )

            div(slot="control" v-if="itemListCount")
                |На странице показано {{showItemLength}} из {{ itemListCount}}

            base-table(v-if="showItemLength" v-show="last_days || date_from")
                thead(v-if="headList.length")
                    tr: th(v-for="(item, index) in headList" :key="index" v-html="item.text")
                tbody
                    tr(v-for="(item, index) in itemList", :key="item.guest_uuid+item.site_id+item.chat_id")
                        td
                            base-people(
                                type="visitor",
                                :name="item.name"
                                avatar-width="md",
                                :avatar-url="item.photo",
                                :avatar-stub="item.photo_stub"
                            )
                        td
                            base-btn.base-table__show-hover(
                            @click="startChat(item)"
                            ) Просмотреть диалог
                        td
                            |{{item.date | datetimeDMY }}
                        td(v-text="item.channel")
                        td
                            |{{item.queue_time | datetimeStoHMS}}
                        td.page-log-dialogues__ball
                            base-icon(:name="'ball'+item.rating")
                            |{{item.rating| ballText}}
            base-no-found(v-else name="search")


</template>

<script>
import { dialogPush } from '@/modules/modules'
import { datetimeDMY, datetimeStoHMS } from '@/modules/datetime'
import TheLayoutTable from '@/components/TheLayoutTable'
import FilterDropMenu from '@/components/FilterDropMenu'
import NavAside from '@/components/NavAside'

import { scrollbar, paginator, filterLastDaysAndCalendar } from '@/mixins/mixins'
export default {
    components: {
        FilterDropMenu,
        TheLayoutTable,
        NavAside
    },
    filters: {
        datetimeDMY,
        datetimeStoHMS,
        ballText(value) {
            if (value == 1) return 'Плохо'
            if (value == 2) return 'Средне'
            if (value == 3) return 'Хорошо'
        }
    },
    mixins: [scrollbar, paginator, filterLastDaysAndCalendar],
    data() {
        return {
            apiMethod: 'chat/get-all',
            containerFullFillItemListClassName: {
                scrollBar: 'layout-table__content',
                item: 'base-table__tr'
            },

            headList: [
                { text: 'Имя', field: 'name' },
                { text: '', field: 'btn' },
                { text: 'Дата', field: 'date' },
                { text: 'Канал', field: 'channel' },
                { text: 'Ожидание в очереди', field: 'channel' },
                { text: 'Оценка', field: 'bal' }
            ],

            users_ids: null,
            sites_ids: null,

            tags_ids: null,
            statuses: null,
            rates: null,

            url: null,

            limit: 20
        }
    },
    computed: {
        paramsComp() {
            return {
                timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,
                users_ids: this.users_ids,
                sites_ids: this.sites_ids,

                tags_ids: this.tags_ids,
                statuses: this.statuses,
                rates: this.rates,
                date_from: this.date_from,
                date_to: this.date_to,
                time_from: this.time_from,
                time_to: this.time_to,
                last_days: this.last_days,
                url: this.url
            }
        }
    },
    watch: {
        paramsComp() {
            if (
                this.tags_ids &&
                this.users_ids &&
                this.sites_ids &&
                this.statuses &&
                this.rates &&
                this.url !== null &&
                (!!this.last_days ||
                    (this.date_from && this.date_to && this.time_from && this.time_to))
            ) {
                this.resetSearch()
                this.getItemList()
            }
        }
    },
    created() {},
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (
                vm.viewModeChat === 'all' &&
                !vm.$store.getters['user/isRole'](['admin', 'owner', 'operatorSenior'])
            )
                return vm.$router.push({ name: 'processAll' })
        })
    },
    methods: {
        startChat(item) {
            let { guest_uuid, site_id, chat_id } = item

            dialogPush(this, 'visor', item, 'chat_id')

            let routeData = this.$router.resolve({
                name: 'visor',
                params: { guest_uuid, site_id, chat_id }
            })
            window.open(routeData.href, guest_uuid + site_id + chat_id, 'width=800,height=700')
        },





    }
}
</script>

<style lang="scss">
.page-all {
    flex-direction: row;
    &__scrollbar {
        height: 100%;
        padding-left: calc-em(10);
        padding-right: calc-em(10);
    }
    &__filter-list {
        margin-right: calc-em(15);

        .filter-drop-menu {
            &__box {
                opacity: 1;
                visibility: visible;
                -webkit-transform: translateY(0);
                transform: translateY(0);
                position: static;
            }
            &__controls-item {
                white-space: normal;
            }
            margin-bottom: calc-em(20);

            .base-radio-check__text-wrap {
                white-space: normal;
            }
        }
    }
}
.page-log-dialogues {
    &__ball .icon {
        margin-right: calc-em(10);
    }
}
</style>
