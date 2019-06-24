<template lang="pug">
    base-table.stats-pages
        thead
            tr
                th URL
                th
                th Получено диалогов
                th
                    |Процент от общего количества обращений (%) #[btn-sort(:toggle="sortFieldsComp['sortPercentLarger']", @result="val=>sortFieldsSetSortField(val,'sortPercentLarger')")]

        tbody
            tr(v-for="(item, index) in itemList" :key="item.url")
                td.stats-pages__url(:title="item.url"): a(:href="item.url" v-text="item.url" target="_blank")
                td
                    base-btn.base-table__show-hover(
                        @click="nextLink(item)"
                    ) Открыть журнал
                td
                    | {{item.dialogues_requests | format}}
                td
                    |{{item.dialogues_percents}} %


</template>

<script>
import BtnSort from '@/components/BtnSort'

import { stats, sortFields } from '@/mixins/mixins'

export default {
	components: {
		BtnSort
	},
	mixins: [stats, sortFields],
	data() {
		return {}
	},
	computed: {
		bodyListFormat() {
			return this.sortFieldsListGet
		},
		sortFieldsListSet() {
			return this.bodyList.map(item => {
				item.name = item.url //base-filter-search сейчас ищет по name

				return item
			})
		}
	},
	methods: {
		nextLink(item) {
			this.$store.commit('setFilter', { url: [item.url] })
			this.$router.push({
				name: 'all'
			})
		}
	}
}
</script>

<style lang="scss">
.stats-pages {
	width: auto;

	&__url {
		@extend %text-overflow;
	}
}
</style>
