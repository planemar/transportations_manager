function RestController() {
    this.host = '';
    var host = '';

    /*
     * Базовый метод отправки AJAX запроса на сервер
     * @param {string} type Тип запроса (GET, PUT, POST, DELETE)
     * @param {string} url URL запроса
     * @returns {jqXHR} Объект jqXHR (AJAX запрос JQuery)
     */
    this.send = function (type, url) {
        var controller = this;
        //Выполнение AJAX запроса
        return $.ajax({
            type: type, //Определение типа запроса (GET, PUT, POST, DELETE)
            url: host + url, //Определение URL запроса
            //Callback функция обработки успешного запроса
            crossDomain: true,
            success: function (data, textStatus, jqXHR) {
                console.log("send");
                console.dir(data);
                log('Success: ' + textStatus);
            },
            //Callback функция обработки не удачного запроса
            error: function (jqXHR, textStatus, errorThown) {
                console.log(textStatus);
                controller.error(jqXHR, textStatus, errorThown);
            }
        });
    };

    /*
     * Перегрузка метода отправки AJAX запроса на сервер (для запросов типа GET или DELETE)
     * @param {string} type Тип запроса (GET, DELETE)
     * @param {string} url URL запроса
     * @param {function} callback Callback-функция обработки успешного запроса
     * @returns {jqXHR} Объект jqXHR (AJAX запрос JQuery)
     */
    appendMethod(this, 'send', function (type, url, callback) {
        //Сохранение контекста вызова callback-функции обработки успешного запроса
        var controller = this;
        //Выполнение AJAX запроса
        return $.ajax({
            type: type, //Определение типа запроса (GET, PUT)
            url: host + url, //Определение URL запроса
            //Callback функция обработки успешного запроса
            crossDomain: true,
            success: function (data, textStatus, jqXHR) {
                if (data.Status == "0") {
                    if (data.Error.Trace[0].Key !== '02B01M-059') {
                        webix.ui(controller.errWindow(data.Error)).show();
                    }
                }
                //Если callback не равна undefined, то вызвать эту функцию
                return (callback !== 'undefined') ? callback.call(controller, data, textStatus, jqXHR) :
                        //в противном случае выполнить стандартную функцию-обработчик
                                function () {
                                    log('Success: ' + textStatus);
                                };
                    },
            //Callback функция обработки не удачного запроса
            error: function (jqXHR, textStatus, errorThown) {
                console.log(textStatus);
                controller.error(jqXHR, textStatus, errorThown);
            }
        });
    });

    /*
     * Перегрузка метода отправки AJAX запроса на сервер (для запросов типа PUT или POST)
     * @param {string} type Тип запроса (PUT, POST)
     * @param {string} url URL запроса
     * @param {function} callback Callback-функция обработки успешного запроса
     * @returns {jqXHR} Объект jqXHR (AJAX запрос JQuery)
     */
    appendMethod(this, 'send', function (type, url, data, callback) {
        //Сохранение контекста вызова callback-функции обработки успешного запроса
        var controller = this;
        log("SAVE");
        //Выполнение AJAX запроса
        return $.ajax({
            type: type, //Определение типа запроса (GET, PUT)
            url: host + url, //Определение URL запроса
            data: data, //Данные, отправляемые запросом на сервер
            //Callback функция обработки успешного запроса
            crossDomain: true,
            success: function (data, textStatus, jqXHR) {
                if (data.Status == "0") {
                    webix.ui(controller.errWindow(data.Error)).show();
                }
                //Если callback не равна undefined, то вызвать эту функцию
                return (callback !== 'undefined') ? callback.call(controller, data, textStatus, jqXHR) :
                        //в противном случае выполнить стандартную функцию-обработчик
                                function () {
                                    log('Success: ' + textStatus);
                                };
                    },
            //Callback функция обработки не удачного запроса
            error: function (jqXHR, textStatus, errorThown) {
                console.log(textStatus);
                controller.error(jqXHR, textStatus, errorThown);
            }
        });
    });

    /*
     * Метод обработки ошибок выполнения HTTP-запроса
     * @param {jqXHR} jqXHR Объект jqXHR
     * @param {string} textStatus Cтатус ответа сервера
     * @param {string} errorThown Текст ошибки
     * @returns {undefined}
     */
    this.error = function (jqXHR, textStatus, errorThown) {
        var errorMessage = 'Ошибка выполнения HTTP-запроса. Cтатус: ' + textStatus + '; Ошибка: ' + errorThown;
        log(errorMessage);                      //Записать ошибку в консоль
        webix.message(errorMessage, 'error');   //Вывести ошибку на экран
    };

    /*
     * Метод обработки ошибок, произошедших в серверном приложении (Backend)
     * @param {string} errorType Тип ошибки
     * @param {string} errorText Текст ошибки
     * @returns {undefined}
     */
    appendMethod(this, 'error', function (errorType, errorText) {
        var errorMessage = 'Ошибка серверного приложения. Тип: ' + errorType + '; Ошибка: ' + errorText;
        log(errorMessage);                      //Записать ошибку в консоль
        //webix.message(errorMessage, 'error');   //Вывести ошибку на экран
    });

    appendMethod(this, 'error', function (errorObject) {
        var errorMessage = 'Ошибка серверного приложения (по протоколу 1.1): ' + errorObject.message;
        log(errorMessage);                      //Записать ошибку в консоль
        webix.ui(this.errWindow(errorObject)).show();
        var lastTime = 30;
        var errorTimerId = setInterval(function () {
            if (lastTime === 0) {
                $$('window_error').close();
                clearInterval(errorTimerId);
            }
            lastTime--;
            $$('template_error_message').define('template', '<p>' + errorObject.message + '; Окно будет закрыто через ' + lastTime + ' секунд</p>');
            $$('template_error_message').refresh();
        }, 1000);
    });

    /*
     * Вывод на экран сообщений, не являющихся сообщениями об ошибке
     * @param {string} message Текст сообщения
     * @returns {undefined}
     */
    this.showMessage = function (message) {
        webix.message(message);
    };

    this.restError = function (errorType, errorText) {
        webix.message('Ошибка ' + errorType + '; ' + errorText, 'error');
    };

    this.handleError = function (jqXHR, textStatus, errorThrown) {
        webix.message(textStatus + ': ' + errorThrown, 'error');
    };

    this.setupFormFields = function (formName) {
        var objectsval = localStorage.getItem('objects');
        objects = JSON.parse(objectsval);
        $$(formName).clearValidation();
        for (element in $$(formName).elements) {
            for (i = 0; i < objects.length; i++) {
                if (element == objects[i].objectName) {
                    for (j = 0; j < objects[i].maskRules.length; j++) {
                        $('#' + objects[i].objectName).inputmask(objects[i].maskRules[j]);
                    }
                    if (objects[i].objectId == '' || objects[i].objectId == undefined || $$(objects[i].objectId) == undefined) {
                        console.log("No id");
                    } else {
                        for (j = 0; j < objects[i].validationRules.length; j++) {
                            switch (objects[i].validationRules[j]) {
                                case "webix.rules.isNotEmpty":
                                    $$(objects[i].objectId).define({validate: webix.rules.isNotEmpty});
                                    break;
                                case "NoLess1NoMoreValidate":
                                    $$(objects[i].objectId).define({validate: NoLess1NoMoreValidate});
                                    break;
                                case "NoLess20NoMoreValidate":
                                    $$(objects[i].objectId).define({validate: NoLess20NoMoreValidate});
                                    break;
                                case "NoLess100NoMoreValidate":
                                    $$(objects[i].objectId).define({validate: NoLess100NoMoreValidate});
                                    break;
                                case "NoLessNowValidate":
                                    $$(objects[i].objectId).define({validate: NoLessNowValidate});
                                    break;
                                case "transDateendValidate":
                                    $$(objects[i].objectId).define({validate: transDateendValidate});
                                    break;
                                default:
                                    continue;
                            }
                        }
                        if (objects[i].invalidMessage != undefined && $$(objects[i].objectId) != undefined) {
                            $$(objects[i].objectId).define({invalidMessage: objects[i].invalidMessage});
                        }
                        if (objects[i].objectLabel != undefined && $$(objects[i].objectId) != undefined) {
                            $$(objects[i].objectId).define({label: objects[i].objectLabel});
                        }
                    }

                }
            }
        }
    };

    this.parseDataFromForm = function () {
        var dataFormObject = {},
                dateFormat = webix.Date.dateToStr('%Y-%m-%d');
        for (var i = 0; i < arguments.length; i++) {
            var formElements = arguments[i].elements,
                    elementValue = null;
            for (var elementName in formElements) {
                switch (elementName) {
                    case 'country_code':
                        dataFormObject[elementName] = formElements[elementName].getValue();
                        dataFormObject['country'] = formElements[elementName].getText();
                    case 'region_code':
                        dataFormObject[elementName] = formElements[elementName].getValue();
                        dataFormObject['region'] = formElements[elementName].getText();
                        break;
                    case 'rayon_code':
                        dataFormObject[elementName] = formElements[elementName].getValue();
                        dataFormObject['rayon'] = formElements[elementName].getText();
                        break;
                    case 'city_code':
                        dataFormObject[elementName] = formElements[elementName].getValue();
                        dataFormObject['city'] = formElements[elementName].getText();
                        break;
                    case 'street_code':
                        dataFormObject[elementName] = formElements[elementName].getValue();
                        dataFormObject['street'] = formElements[elementName].getText();
                        break;
                    default:
                        elementValue = formElements[elementName].getValue();
                        //Если элемент формы является полем вводы даты, то отформатировать значение
                        dataFormObject[elementName] = (formElements[elementName].name !== 'datepicker') ? elementValue :
                                //Остальные поля сохраняются без изменений
                                dateFormat(elementValue);
                        break;
                }
            }
        }
        return dataFormObject;
    };

    this.errWindow = function (errorObject) {
        //console.dir(errorObject);
        return {
            view: 'window',
            id: 'window_error',
            width: 500,
            height: 360,
            modal: true,
            position: 'central',
            head: {
                view: 'toolbar',
                css: 'errorHeader',
                elements: [
                    {
                        view: 'label',
                        label: '<span class="fa fa-exclamation-circle"></span> ОШИБКА'
                    },
                    {
                        view: 'icon',
                        icon: 'times-circle',
                        click: function () {
                            $$('window_error').close();
                        }
                    }
                ]
            },
            body: {
                rows: [
                    {
                        view: 'template',
                        id: 'template_error_message',
                        template: '<p>' + errorObject.Message + '</p>', //</br><p>Окно будет закрыто через 30 секунд</p>'
                    },
                    {
                        id: 'button_show_error_trace',
                        type: 'iconButton',
                        view: 'toggle',
                        offIcon: 'list-ol',
                        offLabel: 'ПОКАЗАТЬ СПИСОК ОШИБОК',
                        onLabel: 'СКРЫТЬ СПИСОК ОШИБОК',
                        on: {
                            'onItemClick': function () {
                                this.isHiddenList = (typeof this.isHiddenList === 'undefined') ? false : this.isHiddenList;
                                if (this.isHiddenList === false) {
                                    $$('list_error_trace').show();
                                    this.isHiddenList = true;
                                } else {
                                    $$('list_error_trace').hide();
                                    this.isHiddenList = false;
                                }
                            }
                        }
                    },
                    {
                        view: 'datatable',
                        id: 'list_error_trace',
                        hidden: true,
                        fixedRowHeight: false, rowLineHeight: 25, rowHeight: 25,
                        columns: [
                            {id: 'Key', sort: 'string', header: {text: 'Код ошибки', height: 15}, width: 100},
                            {id: 'Message', sort: 'string', header: {text: 'Описание', height: 15}, fillspace: true},
                        ], on: {
                            "onresize": webix.once(function () {
                                this.adjustRowHeight("Message", true);
                            })
                        },
                        data: errorObject.Trace
                    },
                    {
                        view: 'layout',
                        margin: 15,
                        cols: [
                            {
                                view: 'button',
                                id: 'button_report_error',
                                type: 'iconButton',
                                icon: 'envelope',
                                label: 'СООБЩИТЬ ОБ ОШИБКЕ',
                                labelPosition: 'top'
                            },
                            {
                                view: 'button',
                                type: 'iconButton',
                                icon: 'ban',
                                label: 'ОТМЕНА (ESC)',
                                hotkey: 'esc',
                                on: {
                                    'onItemClick': function () {
                                        $$('window_error').close();
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        };
    };
}

/*
 * Функция логирования
 * @returns {undefined}
 */
function log() {
    try {
        //Попытаться зарегистрировать сообщение самым обычным методом
        console.log.apply(console, arguments);
    }
    //Перехватить любые сбои в регистрации
    catch (e) {
        try {
            //Попытаться зарегистрировать сообщение так, как это делается в Opera
            opera.postError.apply(opera, arguments);
        } catch (e) {
            //Выдать предупреждение, если ничто другое не сработает
            alert(Array.prototype.join.call(arguments, 'Не удалось записать сообщение в console!'));
        }
    }
}

/**
 * Функция установки обработчика события с указанием контекста
 * @param {object} context Контекст вызова метода-обработчика
 * @param {string} handlerName Имя метода-обработчика
 * @returns {Function} Анонимная функция-обработчик события
 */
function bind(context, handlerName) {
    var handlerArgs = Array.prototype.slice.call(arguments, 2);
    return function () {
        var allArgs = handlerArgs.concat(Array.prototype.slice.call(arguments));
        return context[handlerName].apply(context, allArgs);
    };
}

/**
 * Функция перегрузки методов в объекте (перегрузка основана на переменном
 * количестве передаваемых параметров функции).
 * @param {object} object Объект
 * @param {string} name Имя перегружаемой функции
 * @param {function} fn Функция, перегружающая предыдущую версию функции
 * @returns {callback} Результат вызова fn или предыдущей версии перегруженной функции
 */
function appendMethod(object, name, fn) {
    var old = object[name];
    object[name] = function () {
        if (fn.length === arguments.length) {
            return fn.apply(this, arguments);
        } else if (typeof old === 'function') {
            return old.apply(this, arguments);
        }
    };
}
