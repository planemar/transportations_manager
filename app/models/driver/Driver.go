package driver

import (
	"log"

	"gopkg.in/mgo.v2/bson"

	"transportations_manager/app/utils/dbmanager"
	"transportations_manager/app/models/transportation"
	"fmt"
)

//-------------------------------------
// ЭКСПОРТИРУЕМЫЕ МЕТОДЫ

func (d *Driver) Init() (err error) {
	d.mc = new(dbmanager.MongoConnection)
	d.mc.Connect()
	// Получаем объект коллекции водителей из БД
	d.mc.Collection = d.mc.Db.C("drivers")

	// Инициализируем модель грузоперевозок (она пригодится для обновления грузоперевозок при обновлении информации водителя)
	d.transportationModel = new(transportation.Transportation)
	d.transportationModel.Init()

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
		driverData["phone"],
	}); err != nil {
		return
	}

	id = documentId.Hex()
	return
}

func (d *Driver) editDriver(id string, driverData map[string]string) (err error) {
	var documentId bson.ObjectId
	documentId = bson.ObjectIdHex(id)

	driverInfo := &DriverData{
		SecondName: driverData["secondName"],
		FirstName: driverData["firstName"],
		MiddleName: driverData["middleName"],
		Phone: driverData["phone"],
	}

	fmt.Println("driver id = ", id)
	fmt.Println("driver name = ", driverInfo.getFullName())
	fmt.Println("driver phone = ", driverData["phone"])
	// Обновляем документ с водителем
	if err = d.mc.Collection.UpdateId(documentId, driverInfo); err != nil {
		return
	}

	// И все грузоперевозки, которые назначены на данного водителя
	if err = d.transportationModel.UpdateByDriverId(id, driverInfo.getFullName(), driverData["phone"]); err != nil {
		return
	}

	return
}

func (driverData *DriverData) getFullName() string {
	return fmt.Sprintf("%s %s %s", driverData.SecondName, driverData.FirstName, driverData.MiddleName)
}