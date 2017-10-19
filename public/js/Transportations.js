function Transportations() {
    // Наследуем контроллер от RestController
    RestController.call(this);

    // Метод получения и вывода на экран списка всех грузоперевозок
    this.get = function () {
      // Маршрут списка грузоперевозок
      const url = '/transportations';
      // Отправка AJAX запроса для получения списка грузоперевозок
      this.send('GET', url, function (data, textStatus, jqXHR) {
          $$('transportation_list').parse(data);
          $$('transportation_list').refresh();
      });
    };

    this.post = function (transportations) {
      // Маршрут запроса
      const url = '/new_transportation';

      this.send('POST', url, $$('insertForm').getValues(), function (responce, textStatus, jqXHR) {
        if (responce.errorStatus == 1) {
          webix.message({
              type:"error",
              text:"Ошибка добавления: " + responce.errorText,
          });

          return;
        }

        this.showMessage("Грузоперевозка успешно добавлена");
        transportations.get();
        $$('transportation_list').refresh();
        $$('insertWindow').close();
      });
    };

    this.delete = function (transportations) {
      // Маршрут запроса
      const id = $$('transportation_list').getSelectedId();
      if (!id) return;
      const url = `/transportations/${id}/delete`;

      this.send('POST', url, [], function (responce, textStatus, jqXHR) {
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
