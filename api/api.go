package api

import (
	"app/service"

	"github.com/gin-gonic/gin"
)

func GetAirportList(c *gin.Context) {
	c.JSON(200, service.GetAirportList())
}

func GetAvailableFlights(c *gin.Context) {

}
