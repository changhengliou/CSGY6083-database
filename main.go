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
	apiController := r.Group("/api/")
	{
		apiController.GET("/airport", api.GetAirportList)
		apiController.GET("/flight-search", api.GetAvailableFlights)
	}

	if err := r.Run(); err != nil {
		log.Fatal(err)
	}
}
