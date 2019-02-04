<template lang="pug">
    section
        form
            ul.settings-list
                li.settings-list__item
                    h3.settings-list__name Уведомления
                    base-radio-check.settings-list__control(name="notifications" v-model="model.notifications") Включить браузерные уведомления
                    text-info.settings-list__text-info Вы будете получать уведомления о важных событиях в виде стандартного уведомления браузера, даже если он будет свернут.

                li.settings-list__item
                    h3.settings-list__name Звук при новом сообщении от посетителя
                    base-field.settings-list__control.settings-list__select(
                    type="select",

                    :selectOptions="{placeholder:'Без звука',label:'name',options:soundList}"
                    v-model="voice"
                    name="voice"
                    )
                    text-info.settings-list__text-info Выберите звук, который будет проигрываться, если в Ваших текущих диалогах посетитель напишет новое сообщение.

                li.settings-list__item
                    h3.settings-list__name Звук, когда новый посетитель зашел на сайт
                    base-field.settings-list__control.settings-list__select(
                    type="select",
                    :selectOptions="{placeholder:'Без звука',label:'name',options:soundList}"
                    name="voice"
                    )
                    text-info.settings-list__text-info Выберите звук, который будет проигрываться, если новый посетитель зайдет на сайт. Вы сможете начать с ним диалог.

                li.settings-list__item
                    h3.settings-list__name Звук, когда другой сотрудник написал Вам новое сообщение
                    base-field.settings-list__control.settings-list__select(
                    type="select",
                    :selectOptions="{placeholder:'Без звука',label:'name',options:soundList}"
                    name="voice"
                    )
                    text-info.settings-list__text-info Выберите звук, который будет проигрываться, если кто-то из Вашей команды напишет Вам новое сообщение.

                li.settings-list__item
                    h3.settings-list__name Звук, когда есть новое сообщение в общем чате
                    base-field.settings-list__control.settings-list__select(
                    type="select",
                    :selectOptions="{placeholder:'Без звука',label:'name',options:soundList}"
                    name="voice"
                    )
                    text-info.settings-list__text-info Выберите звук, который будет проигрываться, если кто-то из Вашей команды напишет в общем чате, упомянув Вас.

                li.settings-list__item
                    h3.settings-list__name Язык приложения
                    base-field.settings-list__control.settings-list__select(
                    type="select",
                    :selectOptions="{label:'name',options:soundList}"
                    name="voice"
                    )


</template>

<script>
    //const files = require.context('@/assets/sounds/', true, /.*\.mp3$/)
/*    const files = require.context('@/components', true, /.*\.vue$/)

    console.log(files);
    files.keys().forEach(function (key) {

        console.log(key);
    })*/

    //importAll(require.context('@/src/assets/sounds/', false, /\.mp3$/));
    import TextInfo from '@/components/TextInfo'
    import browserNotification from '@/modules/browserNotification'

    export default {

        components: {
            TextInfo
        },
        watch:{
            model:{
                handler(val) {
                    if(val.notifications) {
                        console.log('Нотификации')
                        Notification.requestPermission((permission)=>{
                            if(permission==='denied')  {
                                val.notifications=false;
                                this.$root.$emit('popup-notice','Вы запретили уведомления, их можно разрещить в настройках вашего браузера')
                            }
                            if(permission==='granted') {

                                browserNotification('Уведомления включены', 'Таким образом мы будем Вас уведомлять')


                            }

                        });
                    }
                },
                deep: true
            },
          voice(val){
              console.log(val);
              if(val){
                this.playSound(val.name)
            }
          }
        },
        data() {
            return {
                model:{
                    notifications:false,
                },
                voice:'',
                soundList: [
                    {name: 'Drum'},
                    {name: 'Intrigue'},
                    {name: 'Keys'},
                    {name: 'Kick'},
                    {name: 'Noise'},
                    {name: 'Plucked'},
                    {name: 'Shot'},
                    {name: 'Standart'},
                    {name: 'Strech'},
                    {name: 'Whistle'},
                    {name: 'Zvonok'},
                ]
            }
        },
        created(){

        },
        methods: {
            playSound(sound) {
                if(sound) {

                    let path='/sounds/', //TOdo не получилось обрабытывать webpack'ом
                        audio = new Audio(path+sound+'.mp3');
                    audio.volume=.5; //
                    audio.play();
                }
            }
        }
    }
</script>
