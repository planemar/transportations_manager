package transportation

import (
	"gopkg.in/mgo.v2/bson"

	"transportations_manager/app/utils/dbmanager"
)

type Transportation struct {
	mc *dbmanager.MongoConnection
}

// Для выборки грузоперевозки
type SelectTransportation struct {
	ID          bson.ObjectId `bson:"_id,omitempty" json:"id"`        	// id документа
	RouteLength string        `bson:"routeLength" json:"routeLength"` 	// Протяженность маршрута (км)
	FromAddress string        `bson:"fromAddress" json:"fromAddress"` 	// Откуда маршрут
	ToAddress   string        `bson:"toAddress" json:"toAddress"`     	// Куда маршрут
	CarModel    string        `bson:"carModel" json:"carModel"`       	// ТС
	CarNumber   string        `bson:"carNumber" json:"carNumber"`     	// ГРЗ
	DriverId  	string        `bson:"driverId" json:"driverId"`			// ID водителя
	DriverName  string        `bson:"driverName" json:"driverName"`   	// Имя водителя
	DriverPhone string        `bson:"driverPhone" json:"driverPhone"` 	// Телефон водителя
}

// Для вставки новой грузоперевозки
type InsertTransportation struct {
	RouteLength string `bson:"routeLength" json:"routeLength"` 	// Протяженность маршрута (км)
	FromAddress string `bson:"fromAddress" json:"fromAddress"` 	// Откуда маршрут
	ToAddress   string `bson:"toAddress" json:"toAddress"`     	// Куда маршрут
	CarModel    string `bson:"carModel" json:"carModel"`       	// ТС
	CarNumber   string `bson:"carNumber" json:"carNumber"`     	// ГРЗ
	DriverId  	string `bson:"driverId" json:"driverId"`		// ID водителя
	DriverName  string `bson:"driverName" json:"driverName"`   	// Имя водителя
	DriverPhone string `bson:"driverPhone" json:"driverPhone"` 	// Телефон водителя
}