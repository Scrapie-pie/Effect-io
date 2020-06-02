<template lang="pug">

    form(@submit.prevent="submit")
        base-wait(name="pageScenarioSettingsName")

        ul.settings-list
            li.settings-list__item
                h3.settings-list__name Введите название сценария
                base-field.settings-list__control.settings-list__field(
                placeholder="Введите название сценария",
                type="text",
                name="name"
                v-validate="'required'"
                data-vv-as="Название сценария"
                v-model="model.title"

                )
            li.settings-list__item
                h3.settings-list__name Выберите, для какого сайта сценарий
                base-field.settings-list__control.settings-list__select(
                type="select",
                :selectOptions="{value:model.site_id,label:'url',options:$store.state.user.siteCompanyList,reduce:(e)=>e.id}"
                name="site_id"
                v-model="model.site_id"
                )
            li.settings-list__item
                h3.settings-list__name Комментарий
                base-field.settings-list__control.settings-list__textarea(
                type="textarea",
                placeholder="Введите комментарий",
                name="comment"
                v-model="model.comment"
                )
        pre {{model}}
        base-btn(type="submit") Сохранить и продолжить
</template>

<script>
import browserNotification from '@/modules/browserNotification'
import { scenarioSettings } from '@/mixins/mixins'

export default {
    components: {},
    mixins: [scenarioSettings],
    data() {
        return {
            selectValueStartSiteId: { url: '' },
            model: {
                title: null,
                site_id: null,
                comment: null
            }
        }
    },

    computed: {},
    watch: {
        '$store.state.user.siteCompanyList': {
            handler(val) {
                if (val) {
                    this.model.site_id = +this.$route.params.siteId
                }
            },
            deep: true,
            immediate: true
        }
    },
    created() {
        //this.clearFormValue();
    },
    methods: {
        submit() {

            this.$validator.validateAll().then(response => {
                if (response) {
                    let { scenarioId } = this.$route.params

                    if (+scenarioId == -1) {
                        return this.$store.dispatch('scenario/addItem', this.model).then(data => {
                            browserNotification('Сохранено')
                            this.$router.push({
                                name: 'scenarioSettingsContent',
                                params: { scenarioId: data.id }
                            })
                        })
                    }

                    this.$store.dispatch('scenario/changeItem', this.model).then(() => {
                        browserNotification('Сохранено')
                        this.$router.push({ name: 'scenarioSettingsContent' })
                    })
                }
            })



        }
    }
}
</script>
