const drivers = new Drivers();

const sidebarMainWindows = {
  driversMainWindow: drivers.driversMainWindow,
};

const sidebarSelectHandlers = {
  toggleWindow: function(menuId, openWindowCallback) {
    const windowName = `${menuId}MainWindow`;
    if (!!$$(windowName)) {
      $$(windowName).destructor();
      return;
    }

    webix.ui(sidebarMainWindows[windowName]);
    openWindowCallback();
    $$(windowName).show();

    // Привязываем форму к таблице для возможности быстрого редактирования/добавления элементов
    const mainFormName = `${menuId}MainForm`;
    const datatableName = `${menuId}List`;
    $$(mainFormName).bind(datatableName);
  },
  drivers: function(menuId) {
    this.toggleWindow(menuId, () => drivers.getAll());
  },
  transport: function(menuId) {
    webix.message('Still not implemented');
    //this.toggleWindow(menuId);
  }
};

const sidebarEvents = {
  onAfterSelect: function(menuId) {
    sidebarSelectHandlers[menuId](menuId);
    webix.message('Selected: ' + this.getItem(menuId).value);
  }
};

const Header = {
    type: 'toolbar',
    height: 40,
    cols:[
			{ view: 'label', label: 'МЕНЕДЖЕР УПРАВЛЕНИЯ ГРУЗОПЕРЕВОЗКАМИ', width: 400 },
      { gravity: 5 },
			{ view:'button', id: 'drivers', type:'icon', icon:'id-card', label:'Водители', click: id => sidebarSelectHandlers[id](id) },
			{ view:'button', id: 'transport', type:'icon', icon:'truck', label:'Транспорт', click: id => sidebarSelectHandlers[id](id) },
		],
    on: sidebarEvents,
};
