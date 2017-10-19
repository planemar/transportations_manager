function Drivers() {
  RestController.call(this);

  this.datatableName = 'driversList';
  this.mainFormName = 'driversMainForm';
  this.mainFormBtn = 'driversMainFormSaveBtn';

  this.baseHandler = () => {
    $$(this.datatableName).unselectAll();
    $$(this.mainFormBtn).setValue('Добавить');
    $$(this.mainFormBtn).refresh();
  };
  this.datatableEventHandlers = {
    onBeforeAdd: (id, obj) => {
      this.postNew(obj);
    },

    onDataUpdate: (id, obj) => {
      this.edit(obj);
    },

    onBeforeSelect: (obj, d) => {
      $$(this.mainFormBtn).setValue('Обновить');
      $$(this.mainFormBtn).refresh();
    }
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

    onValidationSuccess: () => {
      this.baseHandler();
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
			{ view: 'button', id: 'driversMainFormSaveBtn', value: 'Добавить',
        click: () => {
          $$(this.mainFormName).save();
        }
      }
		],
    rules:{
        "secondName": webix.rules.isNotEmpty,
        "firstName": webix.rules.isNotEmpty,
        "middleName": webix.rules.isNotEmpty
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

  this.getAll = function() {
    const url = '/drivers';
    this.send('GET', url, function (data) {
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
      //webix.message('Данные водителя успешно изменены');
    });
  }
};
