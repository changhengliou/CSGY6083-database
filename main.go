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
		apiController.GET("/flight-status", api.FlightStatusController)

		apiController.GET("/insurance-plan", api.InsurancePlanController)
		apiController.POST("/insurance-plan", api.InsurancePlanController)
		apiController.PUT("/insurance-plan", api.InsurancePlanController)
		apiController.DELETE("/insurance-plan", api.InsurancePlanController)

		apiController.GET("/meal-plan", api.MealPlanController)
		apiController.GET("/special-request", api.SpecialRequestController)

		apiController.POST("/itinerary/checkout", api.ItineraryCheckoutController)
		apiController.GET("/itinerary/confirm/:customerId", api.ItineraryConfirmController)
		apiController.GET("/itinerary/member/:memberId", api.MemberItineraryController)

		apiController.GET("/membership/:airlineId", api.MembershipController)
		apiController.GET("/member/:memberId", api.MemberController)
		apiController.DELETE("/member/:memberId", api.MemberController)
		apiController.POST("/member", api.CreateMemberController)

		apiController.GET("/stats", api.GetStats)
	}

	r.Static("/static", "./frontend/build/static")
	r.NoRoute(func(c *gin.Context) {
		c.File("./frontend/build/index.html")
	})

	if err := r.Run(); err != nil {
		log.Fatal(err)
	}
}
