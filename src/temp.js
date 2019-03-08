// Вызов ф-ии
Effect.uploadFile(event.currentTarget, {
    url: '/app/app.php?upload-message-file',
    data: {uuid: current_uuid}
}, true);


// Сама ф-ия
function uploadFile(elementInputFile, options, progress) {

    var $elFormFile = $( elementInputFile );

    var files = $elFormFile[0].files;

    _.each( files, function( file, index ){
        if (file.size > Effect.UPLOAD_MAX_FILESIZE ) {
            Effect.showErrorHint(null, t('Максимальный размер файла: ') + Effect.UPLOAD_MAX_FILESIZE_STRING);
            $elFormFile.val('');
            return false;
        }
    });

    //--- Init options:
    options = $.extend(true, {
        url:         '',    //<-- It should be set in input options
        type:        'POST',
        data:        null,  //<-- It will be set a little bit later down here
        cache:       false,
        dataType:    'json',
        processData: false, //<-- Don't process the files
        contentType: false, //<-- Talk to server that it is a string requesr
        success:     function( respond, textStatus, jqXHR ){
            //console.log('File was uploaded OK. Respond:', respond);
            $elFormFile.val("");
            if(progress){
                var id = hashCode(respond.file.src.name + respond.file.src.size),
                    $div = $('#uploaded-file-div-' + id);
                $div.find('.uploaded-file-link').text(respond.file.link);
                $div.find('.uploaded-file-link-min').text(respond.file.link_min);
            }
        },
        error:       function( jqXHR, textStatus, errorThrown ){
            console.warn('Upload error: ', jqXHR, textStatus, errorThrown);
            $(".uploaded-file-link").each(function () {
                if($(this).text() === ''){
                    $(this).closest('.uploaded-file-div').remove();
                }
            })
        }
    }, options);
    //--- Get files from form input element:

    var formData;

    if(progress){

        var $container = $(".uploaded-files:visible");

        _.each( files, function( file, index ){

            if(!file.name || !file.size) {
                Effect.showErrorHint(null, t('Некорректный файл'));
                $elFormFile.val('');
                console.log('Некорректный файл', file);
                return false;
            }

            var id = hashCode(file.name + file.size);

            if($('#uploaded-file-div-' + id).length) return true;

            formData = new FormData();

            formData.append( index, file );

            if(options.data){
                $.each(options.data, function(index, value) {
                    formData.append( index, value );
                });
            }

            options.data = formData;

            $container.append('<div class="uploaded-file-div uploaded-file-div-' + index + '" id="uploaded-file-div-' + id + '"><progress id="progress-' + id + '"></progress> ' + file.name + '</div>');
            var $progress = $('#progress-' + id),
                $div = $progress.closest('div');

            options.xhr = function() {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    // For handling the progress of the upload
                    myXhr.upload.addEventListener('progress', function(e) {

                        if (e.lengthComputable) {
                            $progress.attr({
                                value: e.loaded,
                                max: e.total
                            });
                            if(e.loaded === e.total){
                                $div.html(
                                    '<div id="uploaded_file_img_div_' + id + '" class="uploaded-file-img-div"></div>' +
                                    '<div class="uploaded-file-name">' + file.name + '</div>' +
                                    '<div class="uploaded-file-delete">x</div>' +
                                    '<div class="uploaded-file-link"></div>' +
                                    '<div class="uploaded-file-link-min"></div>'
                                );

                                // По умолчанию превью
                                var src = '/themes/effect/images/unknown_file.png';

                                var reader = new FileReader();

                                reader.onload = function (e) {

                                    // Если картинка - показываем её превью
                                    if(file.type && ['image/jpeg', 'image/png'].indexOf(file.type) !== -1){
                                        src = e.target.result;
                                    }

                                    $("#uploaded_file_img_div_" + id).html(
                                        '<img width="25" height="25" src="' + src + '" />'
                                    );
                                };

                                reader.readAsDataURL(file);
                            }
                        }
                    } , false);
                }
                return myXhr;
            };

            $.ajax(options);
        });

    } else {

        formData = new FormData();

        //--- Add files to form:
        _.each( files, function( file, index ){ formData.append( index, file ); });

        if(options.data){
            $.each(options.data, function(index, value) {
                formData.append( index, value );
            });
        }

        //--- Save a data to options:
        options.data = formData;
        //--- Send Ajax request to server:
        // (JQuery implementation):
        $.ajax(options);
    }

    if(progress){
        $(document.body).on('click', '.uploaded-file-delete', function () {
            $(this).closest('.uploaded-file-div').remove();
        });
    }
}