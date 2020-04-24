<template lang="pug">
    form.select-operator(@submit.prevent="submit")
        fieldset(v-if="count && name=='mention'")
            //legend.select-operator__title Выберите сотрудника, которого вы хотите упомянуть в диалоге. Данный сотрудник получит оповещение.
            legend.select-operator__title Отметьте сотрудников, которых Вы хотите пригласить к данному диалогу
            .select-operator__search-operators
                base-filter-search(
                    :item-list="itemLisFilter",
                    @result="(val)=>filterSearchResult=val",
                    @text="(val)=>search=val",
                    field-name="fullName"
                )
                scroll-bar.select-operator__scrollbar.select-operator__scrollbar_mention
                    ul.select-operator__list
                        li.select-operator__item.select-operator__item_operator
                            .select-operator__checkbox
                                base-radio-check(name="mention")

                            base-people(
                                :bg-text-no-fill="true",
                                :name="'Упомянуть всех сотрудников'" ,

                            )
                        li.select-operator__item(v-for="(item, index) in filterSearchResult",:key="index")
                            .select-operator__checkbox
                                base-radio-check(name="mention", :id="item.id")
                            label(:for="item.id")
                                base-people(
                                    :bg-text-no-fill="true",
                                    :avatar-url="item.photo",
                                    :name="item.fullName" ,
                                    :text="item.text" ,
                                    :datetime="item.datetime"
                                )


        fieldset(v-else-if="count")
            legend.select-operator__title(v-text="title")

            .select-operator__search-operators
                base-filter-search(
                    :item-list="itemLisFilter",
                    @result="(val)=>filterSearchResult=val",
                    @text="(val)=>search=val",
                    field-name="fullName"
                )
                scroll-bar.select-operator__scrollbar
                    ul.select-operator__list
                        li.select-operator__item(v-for="(item, index) in filterSearchResult",:key="item.id")

                                .select-operator__checkbox
                                    //input(type="checkbox" name="itemCheck" v-model="itemCheck[item.id]" :value="item.id")
                                    base-radio-check(name="itemCheck" v-model="itemCheck[item.id]" :value="item.id" :id="item.id")
                                label(:for="item.id")
                                    base-people(
                                        :bg-text-no-fill="true",
                                        :avatar-url="item.photo",
                                        :name="item.fullName" ,
                                        :text="item.branches_names | branchesBr" ,
                                        :datetime="item.datetime"
                                    )
            .select-operator__footer
                label.select-operator__label Оставьте комментарий
                base-field.select-operator__input(
                    type="textarea"
                    name="comment",
                    :placeholder="placeholder"
                    maxLength="5000"
                    v-model="comment"
                )
                base-btn(type="submit" v-text="btnText")

        fieldset(v-if="!count")
            p.select-operator__count-no К сожалению, сейчас нет доступных сотрудников
</template>

<script>
import branchesBr from '@/modules/branchesBr'
import { httpParams } from '@/mixins/mixins'
export default {
    filters: {
        branchesBr
    },
    mixins: [httpParams],
    props: {
        name: {
            type: String,
            validator: function(value) {
                return ['invite', 'mention', 'transfer'].indexOf(value) !== -1
            },
            default: 'invite'
        }
    },
    data() {
        return {
            filterSearchResult: [],
            itemCheck: {},

            search: '',
            comment: ''
        }
    },
    computed: {
        count() {
            return this.itemLisFilter.length
        },
        btnText() {
            if (this.name === 'invite') return 'Пригласить'
            if (this.name === 'mention') return 'Упомянуть'
            if (this.name === 'transfer') return 'Передать'
            return ''
        },
        title() {
            if (this.name === 'invite')
                return 'Отметьте сотрудников, которых Вы хотите пригласить к данному диалогу'
            if (this.name === 'mention')
                return 'Выберите сотрудника, которого вы хотите упомянуть в диалоге. Данный сотрудник получит оповещение.'
            if (this.name === 'transfer')
                return 'Выберите сотрудника, которому Вы хотите передать диалог'

            return ''
        },
        placeholder() {
            if (this.name === 'invite')
                return 'Данный комментарий увидят все сотрудники, которых Вы пригласите. Это не обязательное поле. Вы можете пригласить сотрудников без указания комментария.'
            if (this.name === 'transfer')
                return 'Данный комментарий увидит сотрудник, которому Вы передаете диалог. Это не обязательное поле. Вы можете передать диалог без указания комментария.'
            return ''
        },
        itemListIds() {
            let list = []
            for (let key in this.itemCheck) {
                if (this.itemCheck[key]) list.push(Number(key))
            }
            return list
        },
        availableOperators() {
            return this.$store.getters['operators/online'].filter(
                item =>
                    //item.id !== this.$store.state.user.profile.id && // Убираем себя из списка
                    !this.$store.state.roomActive.usersActive.includes(item.id) //Убираем операторов если они уже есть в комнате
            )
        },
        itemLisFilter() {
            return this.availableOperators.filter(operator =>
                this.branchListAllFilterIds.some(branch =>
                    operator.branches_ids.includes(branch.id)
                )
            )
        },
        branchListAllFilterIds() {
            return this.$store.getters['user/branchListAll'].filter(
                branch => branch.site_id === this.httpParams.params.site_id
            )
        }
    },
    created() {},
    methods: {
        submit() {
            if (this.name === 'invite') this.invite()
            if (this.name === 'mention') this.mention()
            if (this.name === 'transfer') this.transfer()
        },
        invite() {
            let data = this.httpParams.params
            data.users_ids = this.itemListIds
            data.comment = this.comment

            this.$http.post('chat-room-user/invite', data).then(({ data }) => {
                this.$root.$emit('globBoxControlClose')
            })
        },
        transfer() {
            let data = this.httpParams.params

            data.to_id = this.itemListIds[0]
            data.comment = this.comment

            this.$http.put('chat-room-user/transfer-request', data).then(({ data }) => {
                this.$root.$emit('globBoxControlClose')
            })
        }
    }
}
</script>

<style lang="scss">
.select-operator {
    $self: '.select-operator';

    &__title {
        /*padding-top:2.5em;*/
        margin-bottom: 2em;
    }

    &__search {
        margin-bottom: calc-em(20);
    }

    &__scrollbar {
        max-height: calc(80vh - 20em);

        &_mention {
            max-height: calc(92vh - 20em);
        }
    }

    &__item {
        display: flex;
        align-items: center;
        margin-top: calc-em(10);
        margin-bottom: calc-em(10);
        .base-people__inner {
            padding-top: 0;
            padding-bottom: 0;
        }

        &_operator {
            .base-avatar {
                background: no-repeat center/cover;
                background-image: url('data:image/svg+xml;utf8,<svg version="1" xmlns="http://www.w3.org/2000/svg" width="153pt" height="148pt" viewBox="0 0 153.000000 148.000000"><g fill="#0b0"><path d="M60.6 1.6c-15.9 3.5-27.1 9.7-38.7 21.3-9.5 9.5-14.7 17.7-18.7 29.9-2.3 6.7-2.6 9.4-2.6 21.2 0 11.8.3 14.5 2.6 21.2 4.2 12.5 9.1 20.3 19.2 30.3 10.3 10.2 19.8 15.8 33.1 19.7 11.4 3.3 30.6 3.3 42 0 13.3-3.9 22.8-9.5 33.1-19.7 10.1-10 15-17.8 19.2-30.3 2.3-6.7 2.6-9.4 2.6-21.2 0-11.8-.3-14.5-2.6-21.2-4.2-12.5-9.1-20.3-19.2-30.3-10.2-10.1-19.8-15.8-32.6-19.5-10-2.9-27.8-3.6-37.4-1.4zm21.7 40.4c.9 1.1 2.3 2 3.2 2 .8 0 2.4 1.3 3.6 2.9 1.9 2.5 2.5 2.8 6.5 2.3 2.9-.3 4.4-.1 4.4.7 0 .6 1.1 1.6 2.4 2.1 6.3 2.4 8.2 13.7 3.8 23.2-3.4 7.5-2.8 9.7 3.8 12.9 6.6 3.2 9.7 6.4 10.6 10.7l.7 3.2h-6.8c-5.6 0-6.6.3-6.1 1.5.3.8.3 2.2 0 3-.5 1.3-5 1.5-32 1.5-24.4 0-31.4-.3-31.6-1.3 0-.6-.1-1.9-.2-2.7-.1-1.1-1.7-1.6-6.5-1.8l-6.3-.3.6-3.2c.9-4.4 4.1-7.5 10.9-10.4 5.1-2.3 5.7-2.9 5.7-5.5 0-1.6-.9-4.8-2-7.1-2.9-5.9-3.5-14.8-1.4-19.3 2-4.2 8.1-7.7 12.7-7.2 2.5.2 3.7-.3 5.7-2.6 5-5.9 15-8.4 18.3-4.6zM73.6 44.5c-2.2.8-5.1 2.5-6.5 4-2.4 2.3-2.6 3.3-2.7 11-.1 6 .3 8.8 1.3 9.6.7.6 1.3 1.8 1.3 2.7 0 .8.9 2.9 2 4.7 1.6 2.6 1.9 4.2 1.4 7.4-.8 4.7-3 6.7-10.8 9.6-4.9 1.9-11.6 7.3-11.6 9.4 0 .8 8 1.1 28.5 1.1s28.5-.3 28.5-1.1c0-2.3-7-7.6-12.8-9.8-7.1-2.7-8.7-4.3-9.6-9.3-.5-2.7-.1-4.7 1.4-7.5 1.1-2.1 2-4.2 2-4.8 0-.6.5-1.6 1.2-2.3.7-.7 1.3-4.5 1.5-8.5.3-8.1-2-13.7-5.6-13.7-1.1 0-2.8-.9-3.8-1.9-1.6-1.8-2.1-1.8-5.7-.6zM55.3 52.8c-1.2.2-3.3 1.5-4.7 2.9-2.3 2.3-2.6 3.3-2.4 8.7.1 3.9 1.1 7.8 2.5 10.8 4.1 8.6 2.5 12.8-6.2 16.3-4.1 1.7-8.5 5.2-8.5 6.7 0 .4 2.1.8 4.6.8 3.7 0 5.3-.6 8.4-3.3 2.1-1.8 6-4 8.7-5 10.3-3.7 11.5-6.7 6.4-16.6-2.1-3.9-3.1-7.7-3.5-12.5-.6-7.4-1.8-9.4-5.3-8.8zM93.9 52.7c-1.2.3-1.6 2.1-1.8 8.5-.1 4.8-.7 8.8-1.4 9.8-2.2 2.7-4.7 9-4.7 12 0 3.4 2.1 5.1 9.3 7.7 2.7 1 6.6 3.2 8.7 5 3.1 2.7 4.7 3.3 8.4 3.3 2.5 0 4.6-.2 4.6-.4 0-2.2-2.3-4.2-8.1-7.1-9.6-4.9-10.7-7.7-6.6-16.3 4.1-8.6 3.1-20.2-1.8-20.2-.7 0-1.8-.7-2.5-1.5s-1.5-1.4-1.9-1.4c-.3.1-1.3.3-2.2.6z"/></g></svg>') !important;
            }
            .icon {
                visibility: hidden;
            }
        }
    }

    &__checkbox {
        .radio-check__text-wrap {
            margin-right: calc-em(15);
        }
    }

    &__label {
        margin-bottom: calc-em(15);
    }

    &__input {
        margin-bottom: calc-em(15);
    }

    &__search-operators {
        max-width: 320px;
    }

    &__footer {
        margin-top: calc-em(50);
    }
}
</style>
