<template lang="pug">
    scroll-bar.client-info
        base-wait(name="clientInfo")
        base-people(
            :name="info.name" ,
            :regRuLogin="info.regRuLogin",
            :text="clientInfoContacts",
            :bg-text-no-fill="true",
            :avatar-url="info.photo",
            :avatar-stub="info.photo_stub"
        )
        .client-info__social-links
            social-links(:link="info.channel_link", :name="channelName" )
        .client-info__scrollbar





            form(@change="guestUpdateByOperator")
                ul.client-info__list

                    li.client-info__item.client-info__item_client-info-actions
                        client-info-actions

                    li.client-info__item
                        the-redirect-client

                    li.client-info__item

                        h4.client-info__name(@click="showContacts=!showContacts")
                            | Дополнительные контакты
                            span.client-info__arrow(:class="{'client-info__arrow_open':showContacts}")
                        transition(name="fade")
                            form(v-show="showContacts")
                                ul.client-info__sub
                                    li.client-info__sub-item
                                        base-field(
                                            v-model="info.additional_contact_1"
                                            theme="soft"
                                            name="additional_contact_1"
                                            placeholder="E-mail, тел или другой контакт"
                                        )
                                    li.client-info__sub-item
                                        base-field(
                                            v-model="info.additional_contact_2"
                                            theme="soft"
                                            name="additional_contact_1"
                                            placeholder="E-mail, тел или другой контакт"
                                        )
                                    li.client-info__sub-item
                                        base-field(
                                            v-model="info.additional_contact_3"
                                            theme="soft"
                                            name="additional_contact_1"
                                            placeholder="E-mail, тел или другой контакт"
                                        )
                    li.client-info__item

                        h4.client-info__name(@click="showInfoMore=!showInfoMore")
                            | Дополнительная информация
                            span.client-info__arrow(:class="{'client-info__arrow_open':showInfoMore}")
                        transition(name="fade")
                            form(v-show="showInfoMore")
                                li.client-info__item.client-info__item_textarea

                                    base-field(
                                        v-model="info.comment"
                                        theme="soft"
                                        ref="clientComment"
                                        type="textarea"
                                        placeholder="Вы можете оставить комментарий к этому диалогу" maxlength="5000"
                                        name="comment"
                                    )
                                li.client-info__item
                                    ul.client-info__sub
                                        li.client-info__sub-item(v-for="(item, index) in infoList",:key="index")
                                            | {{item.text}}
                                li.client-info__item(@click="showAudienceSegments=!showAudienceSegments" v-if="0")
                                    h4.client-info__name Аудиторные сегменты
                                        span.client-info__arrow(:class="{'client-info__arrow_open':showAudienceSegments}")
                                    transition(name="fade")
                                        ul.client-info__sub(v-show="showAudienceSegments")
                                            li.client-info__sub-item(v-for="(item, index) in audienceSegments",:key="index")
                                                | {{item.name}} : {{item.text}}



</template>

<script>
import SocialLinks from '@/components/SocialLinks'
import TheRedirectClient from '@/components/TheRedirectClient'
import autosize from 'autosize'
import { httpParams, viewModeChat } from '@/mixins/mixins'
import ClientInfoActions from '@/components/ClientInfoActions'

export default {
    components: {
        ClientInfoActions,
        SocialLinks,
        TheRedirectClient
    },
    mixins: [httpParams, viewModeChat],
    data() {
        return {
            guest_uuid: null,
            site_id: null,
            showContacts: false,
            showInfoMore: false,
            showAudienceSegments: false,
            showTagsPopup: false,
            clientInfo: {}
        }
    },
    computed: {
        info() {
            return this.$store.state.visitors.itemOpen
        },
        infoList() {
            return [
                {
                    name: 'Пол',
                    text: `На сайте ${this.info.online_time}, заходил ${this.info.visits_count} раз(а)`
                },
                {
                    name: 'Восраст',
                    text:
                        this.info.referrer +
                        ', запрос "' +
                        this.info.key_phrases +
                        '" ' +
                        this.info.country +
                        ', ' +
                        this.info.city
                },
                {
                    name: 'Интересы',
                    text: this.info.browser + ', ' + this.info.os + ', ' + this.info.device
                },
                { name: 'ip', text: 'IP ' + this.info.ip },
                {
                    name: 'Интересы',
                    text: `Последнее обращение через: ${this.channelName}`
                }
            ]
        },
        clientInfoContacts() {
            let phone = `<div><a href="tel:${this.info.phone}">${this.info.phone}</a></div>`,
                email = `<div><a href="mailto:${this.info.mail}">${this.info.mail}</a></div>`

            let str = ''
            if (this.info.phone) str += phone
            if (this.info.mail) str += email
            return str
        },
        channelName() {
            let text = this.$store.getters.channelName(this.info.channel_type)
            return text.toLowerCase()
        }
    },
    watch: {
        $route: 'getInfo'
    },
    created() {
        this.getInfo()
    },
    mounted() {
        setTimeout(() => {
            if (this.$refs && this.$refs.clientComment && this.$refs.clientComment.$refs.input)
                autosize(this.$refs.clientComment.$refs.input)
        }, 500)
    },
    beforeDestroy() {
        if (this.$refs && this.$refs.clientComment && this.$refs.clientComment.$refs.input)
            autosize.destroy(this.$refs.clientComment.$refs.input)
    },
    methods: {
        getInfo() {
            if (!this.httpParams) return
            this.$store.dispatch('visitors/getItemOpen', this.httpParams)
        },
        guestUpdateByOperator() {
            this.$http
                .put('guest/update-by-operator', {
                    guest_uuid: this.info.guest_uuid,
                    comment: this.info.comment,
                    additional_contact_1: this.info.additional_contact_1,
                    additional_contact_2: this.info.additional_contact_2,
                    additional_contact_3: this.info.additional_contact_3
                })
                .then(({ data }) => {})
        }
    },
    sockets: {}
}
</script>

<style lang="scss">
.client-info {
    max-height: 90vh;

    &__item_ {
        border-top: 1px solid glob-color(border);
        padding-top: calc-em(20);
    }

    &__scrollbar {
        height: 100%;
    }

    &__item {
        margin-bottom: calc-em(20);

        &_client-info-actions {
            margin-bottom: 0;
        }

        &_textarea {
            .field__input {
                height: auto;
                max-height: 5em;
            }
        }
    }

    &__sub-item {
        margin-bottom: calc-em(5);
    }

    &__name {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-weight: 400;
        margin-bottom: calc-em(15);
    }

    &__arrow {
        @extend %g-icon-down;
        @extend %g-icon-down_md;

        height: 15px;
        width: 15px;
        line-height: 15px;
        min-width: 15px;
        margin-left: 5px;

        &_open {
            @extend %g-icon-down_open;
        }
    }

    &__social-links {
        margin-left: 70px;
        margin-bottom: calc-em(20);
    }
}
</style>
