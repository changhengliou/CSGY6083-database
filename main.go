package main

import (
	"app/api"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// some middleware
	// r.Use(gin.Logger())
	r.Use(gin.Recovery())
	apiController := r.Group("/api/")
	{
		apiController.GET("/airport", api.GetAirportList)
		apiController.GET("/airline", api.GetAirlineList)
		apiController.Any("/flight", api.FlightController)
		apiController.GET("/flight-search", api.GetAvailableFlights)
	}

	if err := r.Run(); err != nil {
		log.Fatal(err)
	}
}
