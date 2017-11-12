function Drivers() {
  RestController.call(this);

  this.datatableName = 'driversList';
  this.mainFormName = 'driversMainForm';
  this.mainFormBtn = 'driversMainFormSaveBtn';

  this.datatableEventHandlers = {
    onDataUpdate: (id, obj) => {
      this.edit(obj);
    },

    onSelectChange: () => {
      $$(this.mainFormBtn).enable();
    },
  };

  this.driversDatatable = {
    id: this.datatableName,
    resizeColumn: true,
    view: 'datatable',
    select: true,
    navigation: true,
    tooltip: true,
    columns: [
        { id: 'secondName', header: 'Фамилия', fillspace: true, sort: 'string' },
        { id: 'firstName', header: 'Имя', fillspace: true, sort: 'string' },
        { id: 'middleName', header: 'Отчество', fillspace: true, sort: 'string' },
        { id: 'phone', header: 'Телефон', fillspace: true, sort: 'number' },
    ],
    on: this.datatableEventHandlers
  };

  this.mainFormEventHandlers = {
    onValidationError: () => {
      webix.message({
        type:"error",
        text:"ВВЕДЕНЫ НЕКОРРЕКТНЫЕ ЗНАЧЕНИЯ"
      });
    },
  };

  this.driversForm = {
		id: this.mainFormName,
		view: 'form',
    scroll: false,
		elements:[
			{ view: 'text', name: 'secondName', label: 'Фамилия' },
			{ view: 'text', name: 'firstName', label: 'Имя' },
			{ view: 'text', name: 'middleName', label: 'Отчество' },
			{ view: 'text', name: 'phone', label: 'Телефон', invalidMessage: 'Введите номер РФ!' },
			{ view: 'button', id: 'driversMainFormSaveBtn', value: 'Обновить', disabled: true,
        click: () => {
          $$(this.mainFormName).save();
        }
      }
		],
    rules:{
        secondName: webix.rules.isNotEmpty,
        firstName: webix.rules.isNotEmpty,
        middleName: webix.rules.isNotEmpty,
        phone: value => /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/.test(value),
    },
    on: this.mainFormEventHandlers
	};

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
      cols: [ this.driversDatatable, this.driversForm ]
    }
  };

  this.getAll = function(callback) {
    const url = '/drivers';
    this.send('GET', url, function (data) {
      callback(data);
    });
  }

  this.setAllToDatatable = function() {
    this.getAll((data) => {
      $$(this.datatableName).parse(data);
      $$(this.datatableName).refresh();
    });
  }

  this.postNew = function(data) {
    const url = '/new_driver';
    const rowId = data.id;
    data.id = '';

    this.send('POST', url, data, function (data) {
      const row = $$(this.datatableName).getItem(rowId);
      row.id = data;
      $$(this.datatableName).updateItem(rowId, row);

      webix.message('Новый водитель успешно добавлен');
    });
  }

  this.edit = function(data) {
    const url = `/drivers/${data.id}/edit`;
    this.send('POST', url, data, function (data) {
      webix.message('Данные водителя успешно изменены');
      transportations.get();
    });
  }
};
