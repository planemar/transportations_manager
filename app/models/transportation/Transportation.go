package transportation

import (
	"fmt"
	"log"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

//-------------------------------------
// ЭКСПОРТИРУЕМЫЕ МЕТОДЫ

func (t *Transportation) Init() (err error) {
	// Инициализируем подключение к БД
	if t.session, err = mgo.Dial("localhost"); err != nil { // Получаем объект сессии, подключившись к localhost
		log.Fatal(err)
	}
	t.session.SetMode(mgo.Monotonic, true)
	t.collection = t.session.DB("ForGO").C("transportations") // Получаем объект коллекции transportations из БД ForGO

	return
}

// REST метод GET
func (t *Transportation) Get() (transportations []SelectTransportation, err error) {
	// Отложенное закрытия соединения с БД
	defer t.session.Close()
	// Делаем выборку всех документов коллекции
	if err = t.collection.Find(bson.M{}).All(&transportations); err != nil {
		log.Fatal(err)
	}

	return
}

// REST метод POST
func (t *Transportation) Post(params map[string]string) (err error) {
	defer t.session.Close()

	// Вставка документа
	if err = t.collection.Insert(&InsertTransportation{
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
	defer t.session.Close()

	// Удаление документа по ID
	fmt.Println(documentID)
	err = t.collection.Remove(bson.M{"_id": bson.ObjectIdHex(documentID)})
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
