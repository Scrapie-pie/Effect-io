

function sendNotification(title, body,link) {
    let options = {
        body:body,
        dir: 'auto',
        icon: '/logo.png'
}


// Проверим, поддерживает ли браузер HTML5 Notifications
    if (!("Notification" in window)) {
        alert('Ваш браузер не поддерживает HTML Notifications, его необходимо обновить.');
    }

// Проверим, есть ли права на отправку уведомлений
    else if (Notification.permission === "granted") {
// Если права есть, отправим уведомление


        console.log('sendNotification',title, options);
        var notification = new Notification(title, options);

        function clickFunc() {

            window.location.href=link;
        }

        notification.onclick = clickFunc;
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

export default sendNotification