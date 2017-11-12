package driver

import (
	"gopkg.in/mgo.v2/bson"

	"transportations_manager/app/utils/dbmanager"
	"transportations_manager/app/models/transportation"
)

type Driver struct {
	mc 					*dbmanager.MongoConnection
	transportationModel *transportation.Transportation
}

// Водитель
type DriverData struct {
	ID         	bson.ObjectId `bson:"_id,omitempty" json:"id"`      // id водителя
	SecondName 	string        `bson:"secondName" json:"secondName"` // Фамилия
	FirstName  	string        `bson:"firstName" json:"firstName"`   // Имя
	MiddleName 	string        `bson:"middleName" json:"middleName"` // Отчество
	Phone 		string        `bson:"phone" json:"phone"` // Номер телефона
}
