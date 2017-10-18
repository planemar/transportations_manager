package dbmanager

import (
	"log"

	"gopkg.in/mgo.v2"
)

const HOST = "localhost"
const DB	 = "ForGO"

// Главная структура, хранящая подключение к БД
type MongoConnection struct {
	Session    *mgo.Session    // Указатель на объект сессии
	Db         *mgo.Database   // Указатель на объект базы данных
	Collection *mgo.Collection // Указатель на объект коллекции
}

func (mc *MongoConnection) Connect() (err error) {
  // Инициализируем подключение к БД
	if mc.Session, err = mgo.Dial(HOST); err != nil { // Получаем объект сессии, подключившись к localhost
		log.Fatal(err)
	}
	mc.Session.SetMode(mgo.Monotonic, true)
	mc.Db = mc.Session.DB(DB);

  return
}
