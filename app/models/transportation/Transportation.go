package transportation

import (
	"fmt"
	"log"

	"gopkg.in/mgo.v2/bson"

	"transportations_manager/app/utils/dbmanager"
)

//-------------------------------------
// ЭКСПОРТИРУЕМЫЕ МЕТОДЫ

func (t *Transportation) Init() (err error) {
	t.mc = new(dbmanager.MongoConnection)
	t.mc.Connect()
	// Получаем объект коллекции грузоперевозка из БД
	t.mc.Collection = t.mc.Db.C("transportations")

	return
}

// REST метод GET
func (t *Transportation) Get() (transportations []SelectTransportation, err error) {
	// Отложенное закрытия соединения с БД
	defer t.mc.Session.Close()
	// Делаем выборку всех документов коллекции
	if err = t.mc.Collection.Find(bson.M{}).All(&transportations); err != nil {
		log.Fatal(err)
	}

	return
}

// REST метод POST
func (t *Transportation) Post(params map[string]string) (err error) {
	defer t.mc.Session.Close()

	// Вставка документа
	if err = t.mc.Collection.Insert(&InsertTransportation{
		params["routeLength"],
		params["fromAddress"],
		params["toAddress"],
		params["carModel"],
		params["carNumber"],
		params["driverName"],
		params["driverPhone"],
	}); err != nil {
		return
	}

	return
}

// REST метод DELETE
func (t *Transportation) Delete(documentID string) (err error) {
	defer t.mc.Session.Close()

	// Удаление документа по ID
	fmt.Println(documentID)
	err = t.mc.Collection.Remove(bson.M{"_id": bson.ObjectIdHex(documentID)})
	if err != nil {
		return
	}

	return
}

//-------------------------------------
// НЕ ЭКСПОРТИРУЕМЫЕ МЕТОДЫ

/*
  Метод получения списка всех
*/
func (t *Transportation) getAllTransportations() {}
