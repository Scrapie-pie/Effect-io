<template lang="pug">

    label.base-radio-check(:class="classObject")
        input(
            v-bind="getInputOptions",
            v-on="inputListeners",
        ).base-radio-check__input
        span.base-radio-check__text-wrap
            base-icon(name="check").base-radio-check__check
            span.base-radio-check__text

                span(v-html="text")
                slot

</template>

<script>
export default {
	name: 'BaseRadioCheck',
	inject: ['$validator'],
	inheritAttrs: false,
	model: {
		prop: 'modelValue',
		event: 'change'
	},
	props: {
		/*     textTrue:null,
            textFalse:null,*/
		text: {
			type: String,
			required: false,
			default: ''
		},
		value: {
			required: false,
			default: 1
		},
		name: {
			type: String,
			required: true
		},
		type: {
			type: String,
			required: false,
			default: 'checkbox'
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		checked: {
			type: Boolean,
			required: false,
			default: false
		},
		modelValue: {
			default: ''
		},
		trueValue: {
			type: Number,
			default: 1
		},
		falseValue: {
			type: Number,
			default: 0
		}
	},

	computed: {
		classObject() {
			let parentClass = 'base-radio-check'
			let obj = {}
			obj[`${parentClass}_disabled`] = this.disabled === '' || this.disabled ? true : false
			obj[`${parentClass}_error`] = this.errors.has(this.name)
			obj[`${parentClass}_checked`] = this.getChecked

			obj[`${parentClass}_${this.type}`] = !!this.type

			return obj
		},
		getChecked() {
			if (this.type === 'radio') return this.modelValue == this.value

			if (this.type === 'checkbox') {
				if (Array.isArray(this.modelValue)) {
					return this.modelValue.includes(this.value)
				} else {
					return this.modelValue == this.trueValue
				}
			}
			return false
		},
		getInputOptions() {
			//console.log(checked);
			let obj = {
				trueValue: this.trueValue,
				falseValue: this.falseValue,
				disabled: !!this.disabled,
				type: this.type,
				checked: this.getChecked,
				value: this.value,
				name: this.name
			}

			return Object.assign({}, this.$attrs, obj)
		},
		inputListeners: function() {
			var vm = this
			return Object.assign({}, this.$listeners, {
				change: function(event) {
					if (vm.type == 'radio') {
						return vm.$emit('change', vm.value)
					}

					if (Array.isArray(vm.modelValue)) {
						let newValue = [...vm.modelValue]

						if (event.target.checked) {
							newValue.push(vm.value)
						} else {
							newValue.splice(newValue.indexOf(vm.value), 1)
						}

						vm.$emit('change', newValue)
					} else {
						vm.$emit('change', event.target.checked ? vm.trueValue : vm.falseValue)
					}

					/*  if(event.target.checked) vm.$emit('change', vm.value) // На сервере строгая типизация
                            else vm.$emit('change', null)*/
				}
			})
		}
	}
}
</script>

<style lang="scss">
.base-radio-check {
	$self: &;
	$sz: calc-em(24);
	$color_border: glob-color('border');
	$color_main: glob-color('main');
	$transition: $glob-trans;

	&_disabled {
		cursor: default;
	}
	//&_checked &__check {transform:scale(1);}
	&__input {
		@extend %visuallyhidden;

		&:checked ~ #{$self}__text-wrap {
			#{$self}__check {
				transform: scale(1);
			}
		}
		&:disabled ~ #{$self}__text-wrap {
			opacity: 0.7;
		}
	}
	&__text:not(:empty) {
		margin-left: calc-em(10);
	}

	&__text-wrap {
		position: relative;
		display: flex;
		align-items: center;
		min-width: 0;

		&::before {
			content: '';
			display: block;
			width: $sz;
			height: $sz;
			border: 1px solid $color_border;
			border-radius: 50%;
			flex: 0 0 auto;
		}

		&::after {
			content: '';
			display: block;
		}
	}
	&__check {
		position: absolute;
		left: 0;
		top: 50%;
		margin-top: -7px;
		margin-left: 0.4em;
		transform: scale(0);
		transition: $transition;

		.icon {
			width: 15px;
			height: 15px;
			fill: $color_main;
		}
	}
}
</style>
