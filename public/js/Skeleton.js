//Конструируем страницу
function Skeleton() {
  webix.ui({
    rows: [
      Header,
      {
        cols: [
          {
            rows: [
              TransportationsList,
              {
                cols: [
                  InsertButton,
                  DeleteButton
                ]
              }
            ]
          },
          {
            view: "resizer"
          },
          {
            view: "template",
            template: "<div id='transportations_route'></div> <!--блок с маршрутом грузоперевозки-->"
          }
        ]
      }
    ]
  });

  webix.ui(InsertWindow);

};
