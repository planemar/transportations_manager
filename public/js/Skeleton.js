// Конструируем страницу
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
            ],
            gravity: 0.5
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

};
