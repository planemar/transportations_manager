package controllers

import (
	"log"
	transportation "transportations_manager/app/models/transportation"

	"github.com/revel/revel"
)

type CTransportation struct {
	*revel.Controller
	model *transportation.Transportation
}

func (c *CTransportation) Get() revel.Result {
	var (
		transportations []transportation.SelectTransportation
		err             error
	)
	// Инициализация модели
	c.model = new(transportation.Transportation)
	if err = c.model.Init(); err != nil {
		log.Fatal(err)
	}

	if transportations, err = c.model.Get(); err != nil {
		log.Fatal(err)
	}

	return c.RenderJSON(transportations)
}

func (c *CTransportation) Post() revel.Result {
	var (
		params map[string]string // Мапа для параметров запроса
		err    error
	)
	// Инициализация модели
	c.model = new(transportation.Transportation)
	if err = c.model.Init(); err != nil {
		log.Fatal(err)
	}
	params = make(map[string]string)

	params["routeLength"] = c.Params.Get("routeLength")
	params["fromAddress"] = c.Params.Get("fromAddress")
	params["toAddress"] = c.Params.Get("toAddress")
	params["carModel"] = c.Params.Get("carModel")
	params["carNumber"] = c.Params.Get("carNumber")
	params["driverName"] = c.Params.Get("driverName")
	params["driverPhone"] = c.Params.Get("driverPhone")

	var dataToFront map[string]interface{}
	dataToFront = make(map[string]interface{})

	// Вызываем метод добавления новой грузоперевозки
	if err := c.model.Post(params); err != nil {
		dataToFront["errorStatus"] = 1
		dataToFront["errorText"] = err
	} else {
		dataToFront["errorStatus"] = 0
	}
	return c.RenderJSON(dataToFront)
}

func (c *CTransportation) Delete() revel.Result {
	var (
		id          string
		dataToFront map[string]interface{}
		err         error
	)
	// Инициализация модели
	c.model = new(transportation.Transportation)
	if err = c.model.Init(); err != nil {
		log.Fatal(err)
	}

	id = c.Params.Get("id")
	dataToFront = make(map[string]interface{})

	// Вызываем метод удаления грузоперевозки
	if err = c.model.Delete(id); err != nil {
		dataToFront["errorStatus"] = 1
		dataToFront["errorText"] = err.Error()
	} else {
		dataToFront["errorStatus"] = 0
	}
	return c.RenderJSON(dataToFront)
}
