<template lang="pug">
    the-layout-table.page-operators
        base-field(
            slot="control",
            type="search"
            name="search",
            placeholder="Поиск по имени..."
            theme="soft"
            v-model="search"
        )
        base-btn(
            v-if="viewAdmin"
            slot="control",
            name="add" color="success-dark" size="lg" :router="{name:'settingsProfile',query:{add:'operator'}}"
        ) Добавить сотрудника

        base-table
            thead
                tr
                    th Имя
                    th
                    th Контакты
                    th Отдел
                    th(v-if="viewAdmin") Активен
                    th(v-if="viewAdmin") Досупные действия
            tbody
                tr.page-operators__tr(v-for="(item, index) in operatorListSortUnread", :key="item.id")
                    td
                        base-people(
                            type="operator",
                            :count="item.unread.length",
                            :text="item.statusText",
                            :name="item.fullName",
                            :avatar-url="item.photo"
                        )
                    td
                        .page-operators__last-message-wrap
                            //.page-operators__last-message
                                strong(v-text="item.last_message_author")
                                div(v-text="item.last_message+' супер длинный текст сообщения'")
                            base-btn.base-table__show-hover(:router="{name:'teamChat',params:{id:item.id}}") Начать диалог


                    td
                        a(
                            v-if="!item.phones.type",
                            :href="`tel:${item.phones.phone}`"
                        ) {{item.phones | phoneAdditional}}
                        a(
                            v-else
                            :href="`tel:${item.phones.sip}`"
                            v-text="item.phones.sip"
                        )
                        br
                        a(:href="`mailto:${item.mail}`" v-text="item.mail")
                    td
                        ul.page-operators__branch
                            li.page-operators__branch-item(v-for="(branch, index) in item.branches_ids", :key="branch" v-text="item.branches_names[index]")

                    td(v-if="viewAdmin")
                        base-radio-check(
                        v-if="anotherProfile(item.id)"
                            :name="'userIsActive'+item.id",
                        :checked="item.active"  @click="changeActiveOperator(item)"
                        )
                    td(v-if="viewAdmin")
                        context-menu
                            base-btn(:icon="{name:'edit',box:true,textHidden:'Открыть меню'}" color="info-lighten")
                            router-link(
                                slot="item",
                                :to="{name:'settingsProfile',query: { user_id: item.id }}"
                            ) Редактировать

        base-no-found.page-operators__base-no-found(v-if="operatorList.length<2" name="team")
            base-btn(
                slot="team-content"
                name="add"
                color="success-dark"
                size="lg",
                :router="{name:'settingsProfile',query:{add:'operator'}}"
            ) Добавить сотрудника





</template>

<script>
    import TheLayoutTable from '@/components/TheLayoutTable'

    import ContextMenu from '@/components/ContextMenu'
    import lodash_sortBy from 'lodash/sortBy'

    export default {
        components: {
            ContextMenu,
            TheLayoutTable
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
            },
            operatorListSortUnread(){
                return lodash_sortBy(this.operatorListSearch,(item)=>{

                    return !item.unread.length
                });
            },
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
        .layout-table__content {
            padding-bottom:calc-em(50);
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


        &__base-no-found.no-found {
            height: auto;
            flex: 1;
            margin-top: 20vh;
        }
    }


</style>