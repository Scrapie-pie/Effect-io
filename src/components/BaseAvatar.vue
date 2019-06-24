<template lang="pug">
    .base-avatar(:class="classObject", :style="style")
        transition(name="fade" mode="out-in")
        base-icon.base-avatar__icon(v-if="name", :name="name")
        base-icon.base-avatar__icon(v-else-if="!url", :name="setStub")


</template>

<script>
export default {
	props: {
		url: {
			type: String,
			default: ''
		},
		stub: {
			type: Number,
			default: 1
		},
		name: {
			type: String,
			default: ''
		},
		width: {
			validator: function(value) {
				return ['lg', 'md', ''].indexOf(value) !== -1
			},
			type: String,
			default: ''
		}
	},
	computed: {
		style() {
			return `backgroundImage:url(${this.url})`
		},
		classObject() {
			if (this.width) return `base-avatar_${this.width}`
			return ''
		},
		setStub() {
			return 'n' + this.stub
		}
	},
	methods: {
		randomInteger(min, max) {
			let rand = min - 0.5 + Math.random() * (max - min + 1)
			rand = Math.round(rand)
			return rand
		}
	}
}
</script>

<style lang="scss">
.base-avatar {
	$sz: calc-em(52);
	$color_bg: glob-color('info-lighten');

	position: relative;
	display: inline-block;
	vertical-align: middle;
	width: $sz;
	height: $sz;
	border-radius: 50%;
	background: $color_bg no-repeat center/cover;

	.base-avatar__icon .icon {
		@extend %full-abs;
		width: 100%;
		height: 100%;
	}

	&_lg {
		$sz: calc-em(70);
		width: $sz;
		height: $sz;
	}

	&_md {
		$sz: calc-em(36);
		width: $sz;
		height: $sz;
	}
}
</style>
