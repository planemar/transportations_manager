package driver

import (
	"log"

	"gopkg.in/mgo.v2/bson"

	"transportations_manager/app/utils/dbmanager"
)

//-------------------------------------
// ЭКСПОРТИРУЕМЫЕ МЕТОДЫ

func (t *Driver) Init() (err error) {
	t.mc = new(dbmanager.MongoConnection)
	t.mc.Connect()
	// Получаем объект коллекции водителей из БД
	t.mc.Collection = t.mc.Db.C("drivers")

	return
}

// REST метод GET
func (t *Driver) Get() (drivers []SelectDriver, err error) {
	// Отложенное закрытие соединения с БД
	defer t.mc.Session.Close()
	// Делаем выборку всех документов коллекции
	if err = t.mc.Collection.Find(bson.M{}).All(&drivers); err != nil {
		log.Fatal(err)
	}

	return
}
