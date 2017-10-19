package driver

import (
	"log"

	"gopkg.in/mgo.v2/bson"

	"transportations_manager/app/utils/dbmanager"
)

//-------------------------------------
// ЭКСПОРТИРУЕМЫЕ МЕТОДЫ

func (d *Driver) Init() (err error) {
	d.mc = new(dbmanager.MongoConnection)
	d.mc.Connect()
	// Получаем объект коллекции водителей из БД
	d.mc.Collection = d.mc.Db.C("drivers")

	return
}

func (d *Driver) Get() (drivers []DriverData, err error) {
	// Отложенное закрытие соединения с БД
	defer d.mc.Session.Close()
	// Делаем выборку всех документов коллекции
	if err = d.mc.Collection.Find(bson.M{}).All(&drivers); err != nil {
		log.Fatal(err)
	}

	return
}

func (d *Driver) Post(id string,driverData map[string]string) (newId string, err error) {
	defer d.mc.Session.Close()

	if id != "" {
		if err = d.editDriver(id, driverData); err != nil {
			log.Fatal(err)
		}
		return
	}

	if newId, err = d.newDriver(driverData); err != nil {
		log.Fatal(err)
	}
	return
}

//-------------------------------------
// НЕ ЭКСПОРТИРУЕМЫЕ МЕТОДЫ

func (d *Driver) newDriver(driverData map[string]string) (id string, err error) {
	var documentId bson.ObjectId
	documentId = bson.NewObjectId()

	// Вставка документа
	if err = d.mc.Collection.Insert(&DriverData{
		documentId,
		driverData["secondName"],
		driverData["firstName"],
		driverData["middleName"],
	}); err != nil {
		return
	}

	id = documentId.Hex()
	return
}

func (d *Driver) editDriver(id string, driverData map[string]string) (err error) {
	var documentId bson.ObjectId
	documentId = bson.ObjectIdHex(id)

	// Обновляем документ с водителем
	if err = d.mc.Collection.UpdateId(documentId, &DriverData{
		//documentId,
		SecondName: driverData["secondName"],
		FirstName: driverData["firstName"],
		MiddleName: driverData["middleName"],
	}); err != nil {
		return
	}

	return
}
