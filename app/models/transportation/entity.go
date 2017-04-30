package transportation

import (
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// Главная структура, хранящая подключение к БД
//TODO Хранить здесь объект ошибок
type Transportation struct {
	session    *mgo.Session    // Указатель на объект сессии
	collection *mgo.Collection // Объект коллекции
}

// Для выборки грузоперевозки
type SelectTransportation struct {
	ID          bson.ObjectId `bson:"_id,omitempty" json:"id"`        // id документа
	RouteLength string        `bson:"routeLength" json:"routeLength"` // Протяженность маршрута (км)
	FromAddress string        `bson:"fromAddress" json:"fromAddress"` // Откуда маршрут
	ToAddress   string        `bson:"toAddress" json:"toAddress"`     // Куда маршрут
	CarModel    string        `bson:"carModel" json:"carModel"`       // ТС
	CarNumber   string        `bson:"carNumber" json:"carNumber"`     // ГРЗ
	DriverName  string        `bson:"driverName" json:"driverName"`   // Имя водителя
	DriverPhone string        `bson:"driverPhone" json:"driverPhone"` // Телефон водителя
}

// Для вставки новой грузоперевозки
type InsertTransportation struct {
	RouteLength string `bson:"routeLength" json:"routeLength"` // Протяженность маршрута (км)
	FromAddress string `bson:"fromAddress" json:"fromAddress"` // Откуда маршрут
	ToAddress   string `bson:"toAddress" json:"toAddress"`     // Куда маршрут
	CarModel    string `bson:"carModel" json:"carModel"`       // ТС
	CarNumber   string `bson:"carNumber" json:"carNumber"`     // ГРЗ
	DriverName  string `bson:"driverName" json:"driverName"`   // Имя водителя
	DriverPhone string `bson:"driverPhone" json:"driverPhone"` // Телефон водителя
}
