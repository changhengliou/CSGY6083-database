package api

import (
	"app/model"
	"app/service"
	"log"
	"math/rand"
	"net/http"

	"github.com/gin-gonic/gin"
)

const (
	MAX_ID = 999999
	MIN_ID = 100000
)

func GetAvailableFlights(c *gin.Context) {
	req := model.FlightSearchReq{}
	if err := c.BindQuery(&req); err != nil {
		log.Println(err)
		return
	}
	c.JSON(http.StatusOK, service.GetAvailableFlights(req.Departure, req.Arrival, req.Stops))
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
	} else if c.Request.Method == http.MethodPut {
		var flight model.Flight
		if err := c.BindJSON(&flight); err != nil {
			log.Println(err)
			return
		}
		if cnt, err := service.UpdateFlightById(&flight); cnt != 1 || err != nil {
			c.JSON(http.StatusBadRequest, err)
		} else {
			c.JSON(http.StatusOK, flight)
		}
	} else if c.Request.Method == http.MethodDelete {
		flightId := c.Query("flightId")
		if len(flightId) == 0 {
			c.JSON(http.StatusBadRequest, "flightId is required")
			return
		}
		if cnt, err := service.DeleteFlightById(flightId); cnt != 1 || err != nil {
			c.JSON(http.StatusBadRequest, err)
		} else {
			c.JSON(http.StatusOK, gin.H{"status": "success"})
		}
	}
}

func AirlineController(c *gin.Context) {
	if c.Request.Method == http.MethodGet {
		c.JSON(http.StatusOK, service.GetAirlineList())
	} else if c.Request.Method == http.MethodPost {
		var airline model.Airline
		if err := c.BindJSON(&airline); err != nil {
			log.Println(err)
			return
		}
		airline.AirlineId = rand.Intn(MAX_ID-MIN_ID) + MIN_ID
		if err := service.CreateAirline(&airline); err != nil {
			c.JSON(http.StatusBadRequest, err)
		} else {
			c.JSON(http.StatusOK, airline)
		}
	} else if c.Request.Method == http.MethodDelete {
		airlineId := c.Query("airlineId")
		if len(airlineId) == 0 {
			c.JSON(http.StatusBadRequest, "airlineId is required")
			return
		}
		if cnt, err := service.DeleteAirlineById(airlineId); cnt != 1 || err != nil {
			c.JSON(http.StatusBadRequest, err)
		} else {
			c.JSON(http.StatusOK, gin.H{"status": "success"})
		}
	} else if c.Request.Method == http.MethodPut {
		var airline model.Airline
		if err := c.BindJSON(&airline); err != nil {
			log.Println(err)
			return
		}
		if cnt, err := service.UpdateAirlineById(&airline); cnt != 1 || err != nil {
			c.JSON(http.StatusBadRequest, err)
		} else {
			c.JSON(http.StatusOK, airline)
		}
	}
}

func AirportController(c *gin.Context) {
	if c.Request.Method == http.MethodGet {
		c.JSON(http.StatusOK, service.GetAirportList())
	} else if c.Request.Method == http.MethodPost {
		var airport model.Airport
		if err := c.BindJSON(&airport); err != nil {
			log.Println(err)
			return
		}
		if err := service.CreateAirport(&airport); err != nil {
			c.JSON(http.StatusBadRequest, err)
		} else {
			c.JSON(http.StatusOK, airport)
		}
	} else if c.Request.Method == http.MethodPut {
		var airport model.Airport
		if err := c.BindJSON(&airport); err != nil {
			log.Println(err)
			return
		}
		if rows, err := service.UpdateAirportById(&airport); rows != 1 || err != nil {
			c.JSON(http.StatusBadRequest, err)
		} else {
			c.JSON(http.StatusOK, gin.H{"status": "success"})
		}
	} else if c.Request.Method == http.MethodDelete {
		code := c.Query("code")
		if len(code) == 0 {
			c.JSON(http.StatusBadRequest, "code is required")
			return
		}
		if cnt, err := service.DeleteAirportById(code); cnt != 1 && err != nil {
			c.JSON(http.StatusBadRequest, err)
		} else {
			c.JSON(http.StatusOK, gin.H{"status": "success"})
		}
	}
}

func InsurancePlanController(c *gin.Context) {
	if c.Request.Method == http.MethodGet {
		plans, _ := service.GetInsurancePlan()
		c.JSON(http.StatusOK, plans)
	} else if c.Request.Method == http.MethodPost {
		plan := model.InsurancePlan{}
		if err := c.BindJSON(&plan); err != nil {
			log.Println(err)
			return
		}
		plan.PlanId = rand.Intn(MAX_ID-MIN_ID) + MIN_ID
		if err := service.CreateInsurancePlan(&plan); err != nil {
			c.JSON(http.StatusBadRequest, err)
		} else {
			c.JSON(http.StatusOK, plan)
		}
	} else if c.Request.Method == http.MethodPut {
		plan := model.InsurancePlan{}
		if err := c.BindJSON(&plan); err != nil {
			log.Println(err)
			return
		}
		if rows, err := service.UpdateInsurancePlanById(&plan); rows != 1 || err != nil {
			c.JSON(http.StatusBadRequest, err)
		} else {
			c.JSON(http.StatusOK, gin.H{"status": "success"})
		}
	} else if c.Request.Method == http.MethodDelete {
		planId := c.Query("planId")
		if len(planId) == 0 {
			c.JSON(http.StatusBadRequest, "planId is required")
			return
		}
		if cnt, err := service.DeleteInsurancePlanById(planId); cnt != 1 || err != nil {
			c.JSON(http.StatusBadRequest, err)
		} else {
			c.JSON(http.StatusOK, gin.H{"status": "success"})
		}
	}
}

func MealPlanController(c *gin.Context) {
	c.JSON(http.StatusOK, []struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	}{
		{"AVML", "Indian Vegetarian Meal"},
		{"HNML", "Non-vegetarian Hindu Meal"},
		{"VJML", "Vegetarian Jain Meal"},
		{"KSML", "Kosher Meal"},
		{"BLML", "Bland Meal"},
		{"DBML", "Diabetic Meal"},
		{"GFML", "Gluten‑Friendly Meal"},
		{"LFML", "Low‑Fat Meal"},
		{"LSML", "Low‑Salt Meal"},
		{"VGML", "Vegan Meal"},
		{"CHML", "Child Meal"},
		{"BBML", "Baby Meal"},
	})
}

func SpecialRequestController(c *gin.Context) {
	c.JSON(http.StatusOK, []struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	}{
		{"0", "Disability and Mobility Assistance"},
		{"1", "Travelling with infants"},
		{"2", "Travelling with animals"},
		{"3", "Elderly passenger"},
		{"4", "Medical assistance"},
	})
}

func ItineraryCheckoutController(c *gin.Context) {
	var req *model.PaymentReq
	if err := c.BindJSON(&req); err != nil {
		log.Println(err)
		return
	}
	if confirmNum, err := service.CompleteItineraryTransaction(req); err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, err)
	} else {
		c.JSON(http.StatusOK, gin.H{"confirmNum": confirmNum})
	}
}
