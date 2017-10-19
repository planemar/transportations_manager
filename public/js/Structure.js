//Создает экземпляр объекта "КЛАДР"
var kladr = new GetKladrData();

//Объект, задающий виджет с грузоперевозками
var TransportationsList = {
    id: "transportation_list",
    resizeColumn: true,
    view: "datatable",
    select: true,
    navigation: true,
    columns: [
        {id: "routeLength", header: "Протяженность маршрута", fillspace: true, sort: "string"},
        {id: "carModel", header: "ТС", fillspace: true, sort: "string"},
        {id: "carNumber", header: "ГРЗ", fillspace: true, sort: "string"},
        {id: "driverName", header: "ФИО водителя", fillspace: true, sort: "string"},
        {id: "driverPhone", header: "Телефон водителя", fillspace: true, sort: "string"}
    ],
    on: {
        "onSelectChange": function () {
          if (!this.getSelectedId()) return;
          // Удаляем существующий объект карты
          if (routeMap != undefined) {
            routeMap.destroy();
          }
          // Получаем точки для построения маршрута
          selectedTransportation = this.getSelectedItem();
          routePoints = [
            selectedTransportation.fromAddress,
            selectedTransportation.toAddress
          ]
          // Строим маршрут на карте
          ymaps.ready(initMap(routePoints));
          $$('deleteButton').enable();
        }
    }
};

//Объект окна для формы
var InsertWindow = {
    view: "window",
    modal:true,
    id: "insertWindow",
    head:{
			view:"toolbar",
      cols:[
				{
          view:"label",
          align:"center",
          label: "Добавление новой грузоперевозки"
        },
			]
		},
    minWidth: 300,
    maxWidth: 600,
    minHeight: 200,
    maxHeight: 450,
    position: "center",
    modal: true,
    body:{
      rows: [
        {
          view: "form",
          id: "insertForm",
          elements:[
              { view:"text", label:"Протяженность", name:"routeLength", labelWidth:130 },
              { view:"text", label:"Откуда", name:"fromAddress", labelWidth:130, on:{
                  "onAfterRender": function() {
                      $("#from-address").kladr({
                        oneString: true
                      });
                   }
                },
                attributes: {
                   id: "from-address"
                }
              },
              { view:"text", label:"Куда", name:"toAddress", labelWidth:130,  on:{
                  "onAfterRender": function() {
                      $("#to-address").kladr({
                        oneString: true
                      });
                   }
                },
                attributes: {
                   id: "to-address"
                } },
              { view:"text", label:"Модель ТС", name:"carModel", labelWidth:130 },
              { view:"text", label:"Гос.Рег.Знак", name:"carNumber", labelWidth:130 },
              { view:"text", label:"ФИО водителя", name:"driverName", labelWidth:130 },
              { view:"text", label:"Телефон водителя", name:"driverPhone", labelWidth:130 },

          ],
          rules:{
              "routeLength": webix.rules.isNumber,
              "carModel": webix.rules.isNotEmpty,
              "carNumber": webix.rules.isNotEmpty,
              "driverName": webix.rules.isNotEmpty,
              "driverPhone": webix.rules.isNotEmpty
          }
        },
        {
          cols: [
            {
              view:"button",
              value:"ОК",
              type:"form",
              on: {
                "onSubmit": function(){
                  if (!$$('insertForm').validate()) {
                    webix.message({
                        type:"error",
                        text:"ВВЕДЕНЫ НЕКОРРЕКТНЫЕ ЗНАЧЕНИЯ"
                    });
                  } else {
                    transportations.post(transportations);
                  };
                }
              }
            },
            {
              view:"button",
              value:"ОТМЕНА",
              on: {
                "onItemClick": function(){
                  $$('insertWindow').close();
                }
              }
            }
          ]
        }
      ]
    }
};

//Объект, задающий кнопку, которая будет отправлять запрос на добавление грузоперевозки
var InsertButton = {
    view: "button",
    id: "insertButton",
    value: "Добавить",
    on: {
        "onItemClick": function () {
            webix.ui(InsertWindow).show();
        }
    }
};

//Объект, задающий кнопку, которая будет отправлять запрос на удаление грузоперевозки
var DeleteButton = {
    view: "button",
    id: "deleteButton",
    value: "Удалить",
    disabled: true,
    css: "deleteButton",
    on: {
        "onItemClick": function () {
            // Удаляем существующий объект карты
            if (routeMap != undefined) {
              routeMap.destroy();
            }
            transportations.delete(transportations);
        }
    }
};


// Инициализируем контроллеры
const transportations = new Transportations();

// Вызываем метод получения грузоперевозок
transportations.get();
