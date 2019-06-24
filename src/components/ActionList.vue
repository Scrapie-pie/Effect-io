<template lang="pug">
    ul.action-list
        li.action-list__item(
            v-for="(item, index) in itemList",
            :key="item.id+item[nameFieldText]"
        )
            label.action-list__button
                input(
                    type="radio",
                    :name="name",
                    :value="nameFieldValue | setValue(item)",
                    :checked="value | getChecked(item.id)"
                    v-on="inputListeners"
                ).action-list__input
                span.action-list__text(:title="nameFieldText | setValue(item) |setTitle(title)")
                    |{{nameFieldText | setValue(item)}}
</template>

<script>
export default {
	filters: {
		getChecked: function(value, id) {
			return value === id
		},
		setTitle: function(text, title) {
			if (!title) return ''
			return text
		},
		setValue: function(nameField, item) {
			if (!nameField) return ''
			return item[nameField]
		}
	},
	inheritAttrs: false,
	props: {
		itemList: {
			type: Array,
			default: () => []
		},
		nameFieldText: {
			type: String,
			default: ''
		},
		nameFieldValue: {
			type: String,
			default: ''
		},
		value: {
			default: ''
		},
		name: {
			type: String,
			default: ''
		},
		title: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {}
	},
	computed: {
		inputListeners: function() {
			var vm = this
			// `Object.assign` объединяет объекты вместе, чтобы получить новый объект
			return Object.assign(
				{},
				// Мы добавляем все слушатели из родителя
				this.$listeners,
				// Затем мы можем добавить собственные слушатели или
				// перезаписать поведение некоторых существующих.
				{
					// Это обеспечит, что будет работать v-model на компоненте
					input: function(event) {
						vm.$emit('input', event.target.value)
					}
				}
			)
		}
	},
	mounted() {},
	methods: {}
}
</script>

<style lang="scss">
.action-list {
	$self: &;
	$color-border: glob-color('info');
	$color-bg: glob-color('info-lighten');
	$transition: $glob-trans;
	$color-text: glob-color('secondary');
	$padding: calc-em(8) calc-em(25);

	&__input {
		@extend %visuallyhidden;

		&:checked ~ #{$self}__text {
			border-color: $color-border;
			background-color: $color-bg;
			font-weight: 700;
		}
	}

	&__button {
		display: inline-block;
		width: 100%;
	}
	&__text {
		transition: $transition;
		position: relative;
		border: 0;
		border-left: 3px solid transparent;
		background-color: transparent;
		color: $color-text;
		padding: $padding;
		white-space: nowrap;
		text-decoration: none;
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: left;
	}
}
</style>
