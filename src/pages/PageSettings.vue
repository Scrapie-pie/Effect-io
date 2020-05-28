<template lang="pug">
        the-layout(:header-padding-no="true" @close="close").settings-page
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
    },
    methods: {
        close() {
            this.$router.push({ name: 'processAll' })
        }
    }
}
</script>

<style lang="scss"></style>
