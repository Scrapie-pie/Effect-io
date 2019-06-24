<template lang="pug">
    nav-aside
        form.last-messages
            .last-messages__search
                base-filter-search(
                    :item-list="itemListSort",
                    @result="(val)=>filterSearchResult=val",
                    fieldName="fullName" ,
                )
            scroll-bar.last-messages__scrollbar(ref="scrollbar")
                ul.last-messages__list
                    li.last-messages__item
                        base-wait(name="lastMessages" position="r")
                    li.last-messages__item(
                        v-for="(item, index) in filterSearchResult",
                        :key="item.id",
                        :class="item.classList"
                    )
                        router-link.last-messages__btn(
                            :to="item.rootLinkOptions.link"
                            v-text="item.rootLinkOptions.text"
                        )
                        base-people.last-messages__people(v-bind="item.basePeopleOptions")
</template>

<script>
import NavAside from '@/components/NavAside'
import lodash_sortBy from 'lodash/sortBy'

import { viewModeChat, httpParams } from '@/mixins/mixins'
import wrapTextUrls from '@/modules/wrapTextUrls'
export default {
	components: { NavAside },
	mixins: [viewModeChat, httpParams],

	data() {
		return {
			filterSearchResult: [],
			sortMas: [item => -item.basePeopleOptions.count, item => -item.last_message_time]
		}
	},
	computed: {
		itemListStore() {
			let itemList = []

			itemList = this.$store.getters['operators/all']

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
				list = this.itemListSortUnread.filter((item, index) => {
					if (item.id === this.httpParams.params.id) {
						itemActive = item
						return false
					} else return true
				})
			if (list.length) list.unshift(itemActive)
			return list
		}
	},
	created() {},
	methods: {
		lastMessage: function(value, item) {
			if (!value) return ''
			if (item.first_name !== item.last_message_author) return 'Вы: ' + value
			return value
		},
		itemFormatSetOptions(item) {
			let text = this.lastMessage(item.last_message, item)
			text = wrapTextUrls(item.last_message)
			item.basePeopleOptions = {
				status: item.online,
				avatarUrl: item.photo,
				name: item.fullName,
				text: text,
				bgTextNoFill: true,
				count: item.unread.length,
				hidden: true
			}

			return item
		},
		itemFormatSetLink(item) {
			item.rootLinkOptions = {
				link: { name: 'teamChat', params: { id: item.id } },
				text: `${item.fullName}:${item.last_message}`
			}
			return item
		},
		itemFormatSetClassList(item) {
			item.classList = {}
			item.classList['last-messages__item_active'] = item.id === this.httpParams.params.id
			return item
		},
		itemFormat(item) {
			item = Object.assign({}, item)
			item = this.itemFormatSetClassList(item)
			item = this.itemFormatSetLink(item)
			item = this.itemFormatSetOptions(item)
			return item
		}
	}
}
</script>

<style lang="scss">
.last-messages {
	$color_bg-hover: glob-color('border');
	$color_bg-error: glob-color('error');
	$transition: $glob-trans;

	display: flex;
	flex-direction: column;
	height: 100%;

	.ps__scrollbar-y-rail {
		z-index: 2;
	}

	&__search {
		padding-left: calc-em(10);
		padding-right: calc-em(10);
	}

	&__scrollbar {
	}

	&__list {
		padding-top: calc-em(10);
	}

	&__item {
		position: relative;
		transition: $transition;
		padding-left: calc-em(10);
		padding-top: calc-em(10);
		padding-bottom: calc-em(10);

		&:hover,
		&_active {
			background-color: $color_bg-hover;
		}

		&:hover,
		&_active {
			//background-color:$color_bg-hover;
		}

		&_warning {
			&::before {
				content: '';
				@extend %full-abs;
				background-color: $color_bg-error;
				opacity: 0.5;
				z-index: 0;
			}
		}
	}

	&__people {
		z-index: 2;
		position: relative;
		pointer-events: none;

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
}
</style>
