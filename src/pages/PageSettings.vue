<template lang="pug">
        the-layout(:header-padding-no="true").settings-page
            template(slot="title") Настройки
            template(slot="nav" v-if="menuList.length")
                nav-main(:item-list="menuList")
            template(slot="main")
                 router-view
</template>

<script>
import { hideHeader, httpParams } from '@/mixins/mixins'
import TheLayout from '@/components/TheLayout'
import NavMain from '@/components/NavMain'
export default {
	components: { NavMain, TheLayout },
	mixins: [hideHeader, httpParams],
	computed: {
		menuList() {
			return [
				{ text: 'Настройки профиля', link: { name: 'settingsProfile' } },
				{
					text: 'Настройки приложения',
					link: { name: 'settingsApp' },
					hide: this.hideSettingsApp
				}
			]
		},
		hideSettingsApp() {
			//у чужого пользователя одна страница настроек, по этому меню не нужно
			let user_id = +this.$route.query.user_id
			if (user_id) {
				return user_id !== this.$store.state.user.profile.id
			} else return false
		}
	}
}
</script>

<style lang="scss">
.settings-list {
	&__name {
		$color: glob-color('main');
		font-weight: 600;
		opacity: 0.8;
		font-size: inherit;
		margin-bottom: calc-em(20);
	}

	&__name,
	&__text-info {
		padding-left: calc-em(15);
	}

	&__item {
		margin-bottom: calc-em(45);
	}
	&__text-info {
		margin-top: calc-em(20);

		&_sub {
			margin-bottom: calc-em(35);
		}
	}

	&__select {
		width: 168px;
	}

	&__name-wrap {
		display: flex;
		justify-content: space-between;
	}
	&__field {
		max-width: 276px;
		width: 100%;
	}

	&__sub {
	}
	&__sub-item {
		margin-bottom: calc-em(20);
	}

	&__row {
		display: flex;
		align-items: center;
		margin: 0 (calc-em(10) * -1);
	}
	&__col {
		padding-left: calc-em(10);
		padding-right: calc-em(10);
	}
}
</style>
