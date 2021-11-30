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
		apiController.GET("/airport", api.AirportController)
		apiController.POST("/airport", api.AirportController)
		apiController.PUT("/airport", api.AirportController)
		apiController.DELETE("/airport", api.AirportController)

		apiController.GET("/airline", api.AirlineController)
		apiController.POST("/airline", api.AirlineController)
		apiController.PUT("/airline", api.AirlineController)
		apiController.DELETE("/airline", api.AirlineController)

		apiController.GET("/flight", api.FlightController)
		apiController.POST("/flight", api.FlightController)
		apiController.PUT("/flight", api.FlightController)
		apiController.DELETE("/flight", api.FlightController)

		apiController.GET("/flight-search", api.GetAvailableFlights)
	}

	if err := r.Run(); err != nil {
		log.Fatal(err)
	}
}
