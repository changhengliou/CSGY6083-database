package api

import (
	"app/model"
	"app/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAirportList(c *gin.Context) {
	c.JSON(http.StatusOK, service.GetAirportList())
}

func GetAvailableFlights(c *gin.Context) {

}

func GetAirlineList(c *gin.Context) {
	c.JSON(http.StatusOK, service.GetAirlineList())
}

func FlightController(c *gin.Context) {
	if c.Request.Method == http.MethodGet {
		c.JSON(http.StatusOK, service.GetFlightList())
	} else if c.Request.Method == http.MethodPost {
		var flight model.Flight
		c.BindJSON(&flight)
		if err := service.CreateFlight(&flight); err != nil {
			c.JSON(http.StatusBadRequest, err)
		} else {
			c.JSON(http.StatusOK, flight)
		}
	} else {
		c.JSON(http.StatusMethodNotAllowed, "Method not allowed")
	}
}
