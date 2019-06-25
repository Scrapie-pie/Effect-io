<template lang="pug">
    the-layout-table.page-visitors(@scrolldown="scrollLoad")
        base-filter-search.page-visitors__search(
            slot="control",
            :item-list="itemList",
            @result="(val)=>filterSearchResult=val",
            @text="(val)=>search=val"
            placeholder="Поиск... (имя, тел., e-mail)"
            theme="soft"
        )
        base-field(
            slot="control",
            type="select"
            name="channel",
            :selectOptions="{label:'name',options:channelList,value:channel}"
            v-model="channel"
            )

        div(slot="control" v-if="itemListCount")
                |На странице показано {{showItemLength}} из {{ itemListCount}}


        base-wait(name="pageVisitors")
        base-table(v-if="showItemLength" )
            thead
                tr
                    th Имя
                    th Прикреплен сотрудник
                    th Контакты
                    th Регион
            tbody
                tr.page-visitors__tr(v-for="(item, index) in filterSearchResult", :key="item.guest_uuid+item.site_id")
                    td
                        base-people(
                            type="visitor"
                            :name="item.name"
                            avatar-width="md",
                            :avatar-url="item.photo",
                            :avatar-stub="item.photo_stub"
                        )
                    td
                        base-btn.page-visitors__start-chat(
                            v-if="!item.employee",
                            @click="startChat(item)"
                        ) начать диалог
                        span(v-else v-text="item.employee")
                    td
                        a(:href="`tel:${item.phone}`" v-text="item.phone")
                        br(v-if="item.phone")
                        a(:href="`mailto:${item.mail}`" v-text="item.mail")
                    td
                        |{{item.country}}, {{item.region}}, {{item.city}}
        base-no-found(v-else name="visitors")
</template>

<script>
import ContextMenu from '@/components/ContextMenu'
import TheLayoutTable from '@/components/TheLayoutTable'
import { dialogPush } from '@/modules/modules'

import { scrollbar, paginator } from '@/mixins/mixins'
export default {
	components: {
		ContextMenu,
		TheLayoutTable
	},
	mixins: [scrollbar, paginator],
	data() {
		return {
			containerFullFillItemListClassName: {
				scrollBar: 'layout-table__content',
				item: 'base-table__tr'
			},
			channel: ''
		}
	},
	computed: {
		channelList() {
			return this.$store.state.channelList
		},
		paramsComp() {
			return {
				channel_type: this.channel.id
			}
		}
	},
	watch: {
		channel() {
			console.log('channel')
			this.resetSearch()
			this.getItemList()
		}
	},
	created() {
		this.channel = this.channelList[0]
		this.$root.$on('guestNewSession', val => {
			console.log('guestNewSession', val)
			this.itemList.unshift(val)
		})
		this.$root.$on('guestUpdate', val => {
			console.log('guestUpdate')
			let findIndex = this.itemList.findIndex(
				item => item.guest_uuid + item.site_id === val.guest_uuid + val.site_id
			)
			if (findIndex !== -1) {
				let itemUpdate = Object.assign(this.itemList[findIndex], val)
				this.itemList.splice = (findIndex, 1, itemUpdate)
			}
		})
	},
	methods: {
		getItemListUnique() {
			//Пустой для совместимости
		},
		startChat(item) {
			//return console.log(item);
			this.$http
				.put('chat-room-user/take', {
					guest_uuid: item.guest_uuid,
					site_id: item.site_id
				})
				.then(({ data }) => {
					let { guest_uuid, site_id } = item

					dialogPush(this, 'self', item)

					this.$router.push({ name: 'chatId', params: { guest_uuid, site_id } })
				})
		}
	}
}
</script>

<style lang="scss">
.page-visitors {
	&__search {
		width: calc-em(250);
	}

	&__tr:not(:hover) &__start-chat {
		border: 0;
		padding: 0;
		color: inherit;
		background-color: transparent;
		transition-property: color;

		&::before {
			content: 'Вы можете ';
		}
	}
	&__start-chat {
		text-decoration: none;
	}
	&__start-chat:first-letter {
		text-transform: uppercase;
	}
}
</style>
