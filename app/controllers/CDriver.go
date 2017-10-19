package controllers

import (
	"github.com/revel/revel"
	"log"

	"transportations_manager/app/models/driver"
)

type CDriver struct {
	*revel.Controller
	model  *driver.Driver
	params map[string]string
}

func (c *CDriver) Init() revel.Result {
	// Инициализация модели
	c.model = new(driver.Driver)
	if err := c.model.Init(); err != nil {
		log.Fatal(err)
	}

	c.params = make(map[string]string)
	c.params["secondName"] = c.Params.Get("secondName")
	c.params["firstName"] = c.Params.Get("firstName")
	c.params["middleName"] = c.Params.Get("middleName")

	return nil
}

func (c *CDriver) Get() revel.Result {
	var (
		drivers []driver.DriverData
		err     error
	)

	if drivers, err = c.model.Get(); err != nil {
		log.Fatal(err)
	}

	return c.RenderJSON(drivers)
}

func (c *CDriver) Post(id string) revel.Result {
	var (
		err error
	)

	if id, err = c.model.Post(id, c.params); err != nil {
		log.Fatal(err)
	}

	return c.RenderJSON(id)
}
