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

    this.post = function () {
      // Маршрут запроса
      const url = '/new_transportation';
      const formValues = $$('insertForm').getValues();

      const driverInfo = $$('driverSelector').getList().getItem(formValues.driverId);
      console.log('driverInfo = ', driverInfo);
      console.log('formValues = ', formValues);

      formValues.driverName = driverInfo.value;
      formValues.driverPhone = driverInfo.phone;

      this.send('POST', url, formValues, function (responce, textStatus, jqXHR) {
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

    this.setDistance = function () {
      const startPoint = $$('fromAddress').getValue();
      const endPoint = $$('toAddress').getValue();

      if (!startPoint || !endPoint) {
        return;
      }


      ymaps.route([startPoint, endPoint])
        .then((route) => {
          const distance = route.getLength() / 1000;
          $$('transportationDistance').setValue(distance.toFixed(1));
        })
        .catch((err) => {
          webix.error('Get route distance error: ', err);
          console.log('Get route distance error: ', err);
        });
    };
};
