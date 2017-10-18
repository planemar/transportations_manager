package controllers

import (
	"log"
	driver "transportations_manager/app/models/driver"

	"github.com/revel/revel"
)

type CDriver struct {
	*revel.Controller
	model *driver.Driver
}

func (c *CDriver) Get() revel.Result {
	var (
		drivers []driver.SelectDriver
		err             error
	)
	// Инициализация модели
	c.model = new(driver.Driver)
	if err = c.model.Init(); err != nil {
		log.Fatal(err)
	}

	if drivers, err = c.model.Get(); err != nil {
		log.Fatal(err)
	}

	return c.RenderJSON(drivers)
}
