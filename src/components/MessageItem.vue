<template lang="pug">
    .message-item(:class="messageClass")
        .message-item__time-wrap
            time.message-item__time {{time | datetimeHMS}}
            loader-message.message-item__loader-message(:status="loaderMessage")
        .message-item__text-wrap
            strong.message-item__name(v-html="name" v-if="name")
            p.message-item__text(
                v-if="text"
            )
                input-emoji(type="text" :text="text")
            figure.message-item__files(v-if="files.length")
                ul.message-item__files-list
                    li.message-item__files-item(v-for="(item, index) in files" :key="item.link")
                        img(
                        v-if="item.link_min",
                        :src="item.link_min",
                        :alt="item.name",
                        @click="$root.$emit('popup-img',item.link)"
                        )
                        div(v-else)
                            base-icon.message-item__files-icon(name="file")
                            a(

                            v-text="item.name",
                            :href="item.link"
                            target="_blank"
                            )

</template>

<script>
import inputEmoji from '@/components/inputEmoji'
import LoaderMessage from '@/components/LoaderMessage'
import { datetimeHMS } from '@/modules/datetime'
export default {
	components: {
		inputEmoji,
		LoaderMessage
	},
	filters: {
		datetimeHMS
	},
	props: {
		roleId: {
			default: 0,
			type: Number
		},
		count: {
			type: Number,
			default: 0
		},

		name: {
			type: String,
			default: ''
		},
		text: {
			type: String,
			default: ''
		},
		time: {
			type: Number,
			default: 0
		},

		files: {
			type: Array,
			default: function() {
				return []
			}
		},
		loaderMessage: {
			type: Number,
			default: -1
		}
	},
	data() {
		return {}
	},
	computed: {
		messageClass() {
			if (this.roleId === 8) return 'message-item_visitor'
			if (this.roleId === 9) return 'message-item_system'
			return ''
		}
	}
}
</script>

<style lang="scss">
.message-item {
	$color_operator: glob-color('info');
	$color_visitor: glob-color('success');
	$color_text: glob-color('secondary');
	$color_system: glob-color('main');
	display: flex;
	text-align: left;
	align-items: flex-start;
	&__time-wrap {
		margin-right: calc-em(15);
		display: flex;

		align-items: flex-end;
	}
	&__name {
		font-weight: 700;
		color: $color_operator;
	}
	&__text {
		color: $color_text;
	}

	&__time {
		margin-right: calc-em(5);
	}

	&_visitor &__name {
		color: $color_visitor;
	}
	&_system &__text {
		color: $color_system;
	}

	&__loader-message {
		position: relative;
	}

	&__files-list {
	}
	&__files-icon {
		.icon_file {
			margin-top: -5px;
			margin-bottom: -5px;
		}
	}
}
</style>
