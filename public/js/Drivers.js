function Drivers() {
  RestController.call(this);

  this.driversMainWindow = {
    view: 'window',
    id: 'driversMainWindow',
    height: 550, width: 850,
    position: 'center',
    head:{
      view: 'toolbar', margin:-4, cols:[
        { view: 'label', label: 'Водители' },
        { view: 'icon', icon: 'times-circle', css: 'alter',
          click: function() {
            $$('driversMainWindow').close();
          }
        }
      ]
    },
    body: {
      id: "drivers_list",
      resizeColumn: true,
      view: "datatable",
      select: true,
      navigation: true,
      columns: [
          {id: "secondName", header: "Фамилия", fillspace: true, sort: "string"},
          {id: "firstName", header: "Имя", fillspace: true, sort: "string"},
          {id: "middleName", header: "Отчество", fillspace: true, sort: "string"},
      ],
    }
  };

  this.getAll = function() {
    var url = '/drivers'
    this.send('GET', url, function (data) {
      $$('drivers_list').parse(data);
      $$('drivers_list').refresh();
    });
  }
};
