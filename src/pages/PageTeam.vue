<template lang="pug">
    article.page-operators
        .page-operators__content
            .page-operators__controls
                .page-operators__control
                    base-field(
                    type="search"
                    name="search",
                    placeholder="Поиск по имени..."
                    theme="soft"
                    v-model="search"
                    )
                .page-operators__control(v-if="viewAdmin")
                    base-btn(name="add" color="success-dark" size="lg" :router="{name:'settingsProfile',query:{add:'operator'}}") Добавить сотрудника
            scroll-bar.page-operators__scroll-bar
                table.table
                    thead.table__thead
                        tr.table__tr
                            th.table__td.table__td_th Имя
                            th.table__td.table__td_th
                            th.table__td.table__td_th Контакты
                            th.table__td.table__td_th Отдел
                            th.table__td.table__td_th(v-if="viewAdmin") Активен
                            th.table__td.table__td_th(v-if="viewAdmin") Досупные действия
                    tbody.table__tbody(v-for="(item, index) in operatorListSearch", :key="item.id")
                        tr.table__tr.page-operators__tr
                            td.table__td
                                base-people(
                                    type="operator",
                                    :count="item.unread.length+1",
                                    :text="item.statusText",
                                    :name="item.fullName",
                                    :avatar-url="item.photo"
                                )
                            td.table__td
                                .page-operators__last-message-wrap
                                    .page-operators__last-message
                                        strong(v-text="item.last_message_author")
                                        div(v-text="item.last_message+' супер длинный текст сообщения'")
                                    base-btn.page-operators__start-chat(:router="{name:'teamChat',params:{id:item.id}}") Начать диалог


                            td.table__td
                                a(
                                v-if="!item.phones.type",
                                :href="`tel:${item.phones.phone}`"
                                ) {{item.phones | phoneAdditional}}
                                a(
                                v-else
                                href="`tel:${item.phones.sip}`"
                                v-text="item.phones.sip"
                                )
                                br
                                a(:href="`mailto:${item.mail}`" v-text="item.mail")
                            td.table__td
                                ul.page-operators__branch
                                    li.page-operators__branch-item(v-for="(branch, index) in item.branches_ids", :key="branch" v-text="item.branches_names[index]")

                            td.table__td(v-if="viewAdmin")
                                base-radio-check(
                                v-if="anotherProfile(item.id)"
                                    :name="'userIsActive'+item.id",
                                :checked="item.active"  @click="changeActiveOperator(item)"
                                )
                            td.table__td(v-if="viewAdmin")
                                context-menu
                                    base-btn(:icon="{name:'edit',box:true,textHidden:'Открыть меню'}" color="info-lighten")
                                    template(slot="listItem")
                                        router-link.context-menu__link(:to="{name:'settingsProfile',query: { user_id: item.id }}") Редактировать
        base-no-found(v-if="operatorList.length<=1" name="team")






</template>

<script>
    //TODO соедиить шаблон с таблицей посетителей
    import ContextMenu from '@/components/ContextMenu'


    export default {
        components: {
            ContextMenu
        },
        filters: {
            phoneAdditional: function (value) {
                let str = value.phone;
                if (value.additional) str = str + ' (' + value.additional +')'
                return str
            }
        },
        data() {
            return {
                search: '',
            }
        },
        computed:{

            viewAdmin(){
                return  this.$store.getters['user/profile'].role_id === 13 || this.$store.getters['user/profile'].role_id === 5 //либо админ либо владелец
            },
            operatorList(){
                return this.$store.getters['operators/all']
            },
            operatorListSearch(){
                let list = this.operatorList;
                list = list.filter(item => {
                    var regexp = new RegExp(this.search, 'ig')

                    if (item.fullName.match(regexp) == null) return 0
                    return true
                })
                return list
            }
        },
        methods:{
            anotherProfile(user_id){
                return  user_id !== this.$store.getters['user/profile'].user_id
            },
            changeActiveOperator(operator){
                let active = operator.active? 0:1,
                    data = {
                        mail:operator.mail,
                        first_name:operator.first_name,
                        user_id:operator.id,
                        active:active
                    }
                this.$http.post('user-update', data).then(({data})=>{

                })

            }
        }

    }
</script>

<style lang="scss">
    .page-operators{
        $transition:$glob-trans;
        $font-small:$glob-font-size_small;
        &__content {
            display:flex;
            flex-direction:column;
        }
        &__scroll-bar {
            height:100%;
        }
        &__controls{
            display:flex;
            align-items:center;
            margin-bottom:calc-em(50);
        }
        &__control{
            margin-right:calc-em(40);
        }

        &__last-message-wrap {
            position:relative;
        }
        &__tr:hover &__last-message  {
            opacity:0;
            visibility:hidden;
        }
        &__last-message {
            @extend %full-abs;
            top:50%;
            bottom:auto;
            transform:translateY(-50%);
            transition:$transition;
        }
        &__tr:not(:hover) &__start-chat  {
            opacity:0;
            visibility:hidden;
        }
    }


</style>