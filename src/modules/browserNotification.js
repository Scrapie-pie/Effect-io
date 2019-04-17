

function notificationEngine(title, body,link){



    let options = {
        body:body,
        dir: 'auto',
        icon: '/logo.png',
        sound:''
    }


// Проверим, поддерживает ли браузер HTML5 Notifications
    if (!("Notification" in window)) {
        alert('Ваш браузер не поддерживает HTML Notifications, его необходимо обновить.');
    }

// Проверим, есть ли права на отправку уведомлений
    else if (Notification.permission === "granted") {
// Если права есть, отправим уведомление

        return new Promise((resolve) => {
            console.log('sendNotification',title, options);
            var notification = new Notification(title, options);

            function clickFunc() {
                window.focus(); this.close();
                console.log('resolve', link);
                resolve(link);
            }
            notification.onclick = clickFunc;
        });
        //notification.show();
    }

// Если прав нет, пытаемся их получить
    else if (Notification.permission !== 'denied') {

            Notification.requestPermission(function (permission) {
            // Если права успешно получены, отправляем уведомление
                if (permission === "granted") {
                    var notification = new Notification(title, options);

                } else {
                    alert('Вы запретили показывать уведомления'); // Юзер отклонил наш запрос на показ уведомлений
                }
            });

    } else {
// Пользователь ранее отклонил наш запрос на показ уведомлений
// В этом месте мы можем, но не будем его беспокоить. Уважайте решения своих пользователей.
    }
}

import store from '@/store/store'
function browserNotificationMessage (val) {


    console.log('browserNotificationMessage',val);

    if(!document.hidden || !store.state.user.settings.settings.push_notifications) {
        return new Promise((resolve) => { // для совместимости  с clickFunc
            resolve();
        });
    };

    let title='',body='',link='toLink';

    if(val.intent === 'farewell') link=null

    if(val.status==='unprocessed' || val.status==='invited' || val.status==='recipient') {
        if(val.status==='unprocessed'){
            title = 'Не обработанно - ответить';
            body = val.name+': ' + val.body;
        }
        if(val.status==='invited'){
            title = 'Не обработанно - присоединиться';
            body = val.body;

        }
        if(val.status==='recipient'){
            title = 'Не обработанно - принять';
            body = val.body

        }
        return  notificationEngine(title,body,link)
    }


    if(val.site_id){
        title = 'Мои диалоги';
        body = val.last_message_author+': ' +val.last_message;
    } else {
        title = 'Команда';
        body = val.from_user_info.name+': ' +val.body;
    }
    return  notificationEngine(title,body,link)








}

export { browserNotificationMessage};



export default notificationEngine