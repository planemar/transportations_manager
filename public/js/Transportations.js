function Transportations() {
    //Наследуем контроллер от RestController
    RestController.call(this);

    //Метод получения и вывода на экран списка всех грузоперевозок
    this.get = function () {
      var url = '/transportations' //Маршрут списка грузоперевозок
      //Отправка AJAX запроса для получения списка грузоперевозок
      this.send('GET', url, function (data, textStatus, jqXHR) {
          $$('transportation_list').parse(data);
          $$('transportation_list').refresh();
      });
    };

    this.post = function (transportations) {
      // Маршрут запроса
      var url = '/new_transportation';

      this.send('POST', url, $$('insertForm').getValues(), function (responce, textStatus, jqXHR) {
        if (responce.errorStatus == 1) {
          webix.message({
              type:"error",
              text:"Ошибка добавления: " + responce.errorText
          });
        } else {
          this.showMessage("Грузоперевозка успешно добавлена");
          transportations.get();
          $$('transportation_list').refresh();
          $$('insertWindow').close();
        }
      });
    };

    this.delete = function (transportations) {
      // Маршрут запроса
      var url = '/del_transportation/';
      var id = $$('transportation_list').getSelectedItem().id;
      var dataToServer = {
        "id": id
      };
      this.send('POST', url, dataToServer, function (responce, textStatus, jqXHR) {
        if (responce.errorStatus == 1) {
          webix.message({
              type:"error",
              text:"Ошибка удаления: " + responce.errorText
          });
        } else {
          this.showMessage("Грузоперевозка успешно удалена");
          $$('transportation_list').remove(id);
          $$('transportation_list').refresh();
        }
      });
    };
};
