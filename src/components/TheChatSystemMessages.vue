<template lang="pug">
    ul.chat-system-messages
        li.chat-system-messages__item Диалог успешно отправлен
        li.chat-system-messages__item
            p Александр приглашает Вас присоединиться к диалогу
            p «Здесь текст комментария, если он есть»
        li.chat-system-messages__item
            p Александр передает Вам диалог
            p «Здесь текст комментария, если он есть»
        li.chat-system-messages__item
            p Посетитель покинул сайт. Вы можете отправить этот диалог ему на e-mail
            p: base-btn(theme="link") Отправить диалог на e-mail
        li.chat-system-messages__item
            p: base-btn(theme="link") Загрузить более раннюю история общения с посетителем
        li.chat-system-messages__item
            p Ожидаем подтверждения от: Кирилл  #[base-btn(theme="link") Отменить передачу диалога]
        li.chat-system-messages__item
            p Здесь Вы можете оставить важные заметки, которые будут видны только Вам. Или поговорить с самим собой (wink)
        li.chat-system-messages__item
            p Александр предложил заказать обратный звонок
            p Ожидаем результат
            p Результат: посетитель отказался
            p Результат: посетитель заказал звонок

        li.chat-system-messages__item
            p Александр предложил оставить контактные данные
            p Ожидаем результат
            p Результат: посетитель отказался
            p Результат: посетитель ввел данные
            p Егор, +7911 888 33 44, egor@mail.ru

        li.chat-system-messages__item
            p Кирилл присоеденился к диалогу
            p Ожидаем подтверждения от: Александр #[base-btn(theme="link") Отменить приглашение]
            p Анастасия отклонил(а) запрос
            p Василий покинул(а) диалог

        li.chat-system-messages__item
            p Ожидаем подтверждения от: Кирилл #[base-btn(theme="link") Отменить приглашение]
            p Ожидаем подтверждения от: Александр #[base-btn(theme="link") Отменить приглашение]





</template>

<script>
export default {
    data() {
        return {
        
        }
    },
}
</script>

<style lang="scss">
    .chat-system-messages {
        text-align:center;
    }
</style>