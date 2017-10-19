package controllers

import "github.com/revel/revel"

func init() {
	revel.InterceptMethod((*CTransportation).Init, revel.BEFORE)
	revel.InterceptMethod((*CDriver).Init, revel.BEFORE)
}
