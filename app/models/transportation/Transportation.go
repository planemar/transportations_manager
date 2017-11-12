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

func (t *Transportation) Get() (transportations []SelectTransportation, err error) {
	// Отложенное закрытия соединения с БД
	defer t.mc.Session.Close()
	// Делаем выборку всех документов коллекции
	if err = t.mc.Collection.Find(bson.M{}).All(&transportations); err != nil {
		log.Fatal(err)
	}

	return
}

func (t *Transportation) Post(params map[string]string) (err error) {
	defer t.mc.Session.Close()

	// Вставка документа
	if err = t.mc.Collection.Insert(&InsertTransportation{
		params["routeLength"],
		params["fromAddress"],
		params["toAddress"],
		params["carModel"],
		params["carNumber"],
		params["driverId"],
		params["driverName"],
		params["driverPhone"],
	}); err != nil {
		return
	}

	return
}

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

func (t *Transportation) UpdateByDriverId(driverId string, driverName string, driverPhone string) (err error) {
	defer t.mc.Session.Close()

	change := bson.M{"$set": bson.M{"driverName": driverName, "driverPhone": driverPhone}}
	_, err = t.mc.Collection.UpdateAll(bson.M{"driverId": driverId}, change)
	if err != nil {
		return
	}

	return
}