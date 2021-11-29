package api

import (
	"app/model"
	"app/service"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAirportList(c *gin.Context) {
	c.JSON(http.StatusOK, service.GetAirportList())
}

func GetAvailableFlights(c *gin.Context) {
	req := model.FlightSearchReq{}
	if err := c.BindQuery(&req); err != nil {
		log.Println(err)
		return
	}
	c.JSON(http.StatusOK, service.GetAvailableFlights(req.Departure, req.Arrival, req.Stops))
}

func GetAirlineList(c *gin.Context) {
	c.JSON(http.StatusOK, service.GetAirlineList())
}

func FlightController(c *gin.Context) {
	if c.Request.Method == http.MethodGet {
		c.JSON(http.StatusOK, service.GetFlightList())
	} else if c.Request.Method == http.MethodPost {
		var flight model.Flight
		if err := c.BindJSON(&flight); err != nil {
			log.Println(err)
			return
		}
		if err := service.CreateFlight(&flight); err != nil {
			c.JSON(http.StatusBadRequest, err)
		} else {
			c.JSON(http.StatusOK, flight)
		}
	} else {
		c.JSON(http.StatusMethodNotAllowed, "Method not allowed")
	}
}
