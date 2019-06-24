<template lang="pug">
    section.stats-once-chat
        .stats-once-chat__list
            .stats-once-chat__item
                .stats-once-chat__table
                    stats-branches(v-bind="payload('branches')", @itemList="(val)=>itemBranches=val")
                p.stats-once-chat__all
                    | Всего принято диалогов по выбранным отделам: {{totalBranches}}
            .stats-once-chat__item
                .stats-once-chat__table
                    stats-operators(v-bind="payload('employees')", @itemList="(val)=>itemEmployees=val")
                p.stats-once-chat__all
                    | Всего принято диалогов по выбранным сорудникам: {{totalEmployees}}

</template>

<script>
const StatsOperators = () => import('@/components/StatsOperators')
const StatsBranches = () => import('@/components/StatsBranches')

import { stats } from '@/mixins/mixins'
export default {
	components: {
		StatsOperators,
		StatsBranches
	},
	mixins: [stats],
	data() {
		return {
			itemBranches: [],
			itemEmployees: []
		}
	},
	computed: {
		totalBranches() {
			if (!this.itemBranches.length) return 0
			//console.log(this.itemBranches);

			return this.itemBranches
				.map(item => item.dialogues_accepted)
				.reduce((accumulator, currentItem) => accumulator + currentItem)
		},
		totalEmployees() {
			if (!this.itemEmployees.length) return 0
			return this.itemEmployees
				.map(item => item.dialogues_accepted)
				.reduce((accumulator, currentItem) => accumulator + currentItem)
		}
	},
	methods: {
		get() {
			//переписываем из stats
		},
		payload(type) {
			let obj = {
				type
			}

			if (type === 'branches') {
				;(obj.caption = 'По отделам'), (obj.filterBranchIdsOn = true)
			}
			if (type === 'employees') {
				;(obj.caption = 'По сотрудникам'), (obj.filterOperatorIdsOn = true)
			}
			let main = {
				date_from: this.date_from,
				date_to: this.date_to,
				time_from: this.time_from,
				time_to: this.time_to,
				last_days: this.last_days,
				btnDetailHide: true,
				order: 'dialogues_accepted',
				is_one_time_chat: 1
			}

			return Object.assign(main, obj)
		}
	}
}
</script>

<style lang="scss">
.stats-once-chat {
	$color_border: glob-color('border');
	&__list {
		display: flex;

		@extend %row-flex;
		@include media($width_xl) {
			flex-flow: wrap;
		}
	}
	&__item {
		@extend %row-flex-col;
		min-width: 570px;
		margin-bottom: calc-em(20);
	}
	&__table {
		border: 2px solid $color_border;
		margin-bottom: calc-em(20);
		padding: calc-em(15);

		@include media($width_xl, 1) {
			height: 100%;
		}
	}
	&__all {
		@extend %h4;
	}
}
</style>
