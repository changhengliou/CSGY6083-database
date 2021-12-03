package service

import (
	"fmt"
	"log"
	"math/rand"
	"time"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"

	"app/config"
	"app/model"
)

// Q1) Table joins with at least 3 tables in join
// Q2) Multi-row subquery
// Q3) Correlated subquery
// Q4) SET operator query
// Q5) Query with in line view or WITH clause
// Q6) TOP-N query
// For each of above queries use proper column alias, built-in functions,
// appropriate sorting and submit following three items for each of above
// queries.
// A1) Select query
// A2) Result of the query
// A3) Brief explanation about the business information you intend to retrieve

// Better design to use Cache/Containers/Serverless etc. to make your website
// more robust with high availability and scalability.
//
// Building correct index on database to deal with the query with high
// frequency. In this case, you need to show us how and why you build an index,
// what and why this index can help to your system, and the process of your
// experiment/analyze to improve the performance of system by indexing.
//
// Interesting data visualization and methods for user to interact with data
//
// Security check on password reset, stored procedures, user functions, history
// tables etc.

const (
	MAX_ID = 999999
	MIN_ID = 100000
)

var (
	db = initDbConnection()
)

func initDbConnection() *sqlx.DB {
	psqlConnStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", config.DB_HOST, config.DB_PORT, config.DB_USER, config.DB_PWD, config.DB_NAME)
	db, err := sqlx.Connect("postgres", psqlConnStr)
	if err != nil {
		log.Fatalln(err)
	}
	return db
}

func GetAirportList() []*model.Airport {
	var airportList []*model.Airport
	if err := db.Select(&airportList, "SELECT code, city, country, name, type FROM airport"); err != nil {
		log.Fatalln(err)
	}
	return airportList
}

func CreateAirport(airport *model.Airport) error {
	const QUERY = `INSERT INTO airport (
		code,
		name,
		city,
		country,
		type
	) VALUES (
		:code,
		:name,
		:city,
		:country,
		:type
	)`

	_, err := db.NamedExec(QUERY, map[string]interface{}{
		"code":    airport.Code,
		"name":    airport.Name,
		"city":    airport.City,
		"country": airport.Country,
		"type":    airport.Type,
	})
	return err
}

func UpdateAirportById(airport *model.Airport) (int, error) {
	const QUERY = `UPDATE airport SET 
			name = :name,
			city = :city,
			country = :country,
			type = :type
		WHERE code = :code`
	r, err := db.NamedExec(QUERY, map[string]interface{}{
		"code":    airport.Code,
		"name":    airport.Name,
		"city":    airport.City,
		"country": airport.Country,
		"type":    airport.Type,
	})
	rows, _ := r.RowsAffected()
	return int(rows), err
}

func DeleteAirportById(code string) (int, error) {
	const QUERY = `DELETE FROM airport WHERE code = :code`
	r, err := db.NamedExec(QUERY, map[string]interface{}{
		"code": code,
	})
	rows, _ := r.RowsAffected()
	return int(rows), err
}

func getRouteHelper(from, to string, stops int, curr *model.Flight, currRoute []*model.Flight, routes *[][]*model.Flight, visited map[string]bool, flightGraph *map[string][]*model.Flight) {
	currRoute = append(currRoute, curr)
	visited[curr.DepartureAirport] = true
	if to == curr.ArrivalAirport {
		*routes = append(*routes, currRoute)
		return
	}
	if stops <= 1 {
		return
	}
	for _, next := range (*flightGraph)[curr.ArrivalAirport] {
		if _, ok := visited[next.ArrivalAirport]; !ok {
			visited[next.ArrivalAirport] = true
			getRouteHelper(from, to, stops-1, next, currRoute, routes, visited, flightGraph)
			visited[next.ArrivalAirport] = false
		}
	}
}

func GetAvailableFlights(from, to string, stops int) [][]*model.Flight {
	var flightList []*model.Flight
	if err := db.Select(&flightList, "SELECT flight_id, departure_airport, arrival_airport, departure_time, arrival_time FROM flight"); err != nil {
		log.Fatalln(err)
	}
	// build graph
	flightGraph := make(map[string][]*model.Flight)
	startingRoutes := make([]*model.Flight, 0)
	for _, flight := range flightList {
		if _, ok := flightGraph[flight.DepartureAirport]; !ok {
			flightGraph[flight.DepartureAirport] = make([]*model.Flight, 0)
		}

		flightGraph[flight.DepartureAirport] = append(flightGraph[flight.DepartureAirport], flight)
		if flight.DepartureAirport == from {
			startingRoutes = append(startingRoutes, flight)
		}
	}

	// find all paths
	ans := make([][]*model.Flight, 0)
	for _, fromFlight := range startingRoutes {
		visited := make(map[string]bool)
		visited[from] = true
		getRouteHelper(from, to, stops, fromFlight, []*model.Flight{}, &ans, visited, &flightGraph)
	}
	return ans
}

func GetAirlineList() []*model.Airline {
	var airlineList []*model.Airline
	if err := db.Select(&airlineList, "SELECT * FROM airline"); err != nil {
		log.Fatalln(err)
	}
	return airlineList
}

func GetFlightList() []*model.Flight {
	const QUERY = `SELECT 
			f.flight_id,
			f.departure_airport,
			f.arrival_airport,
			f.departure_time,
			f.arrival_time, 
			a.airline_id "airline.airline_id",
			a.name "airline.name", 
			a.main_hub "airline.main_hub", 
			a.headquarter_city "airline.headquarter_city", 
			a.country "airline.country"
		FROM flight AS f
		INNER JOIN airline AS a ON f.airline_id = a.airline_id;`
	var flightList []*model.Flight
	if err := db.Select(&flightList, QUERY); err != nil {
		log.Fatalln(err)
	}
	return flightList
}

func CreateAirline(airline *model.Airline) error {
	const QUERY = `INSERT INTO airline (
		airline_id,
		name,
		main_hub,
		headquarter_city,
		country
	) VALUES (
		:airline_id,
		:name,
		:main_hub,
		:headquarter_city,
		:country
	)`

	_, err := db.NamedExec(QUERY, map[string]interface{}{
		"airline_id":       airline.AirlineId,
		"name":             airline.Name,
		"main_hub":         airline.MainHub,
		"headquarter_city": airline.HeadQuarter,
		"country":          airline.Country,
	})
	return err
}

func UpdateAirlineById(airline *model.Airline) (int, error) {
	const QUERY = `UPDATE airline SET 
		name = :name,
		main_hub = :main_hub,
		headquarter_city = :headquarter_city,
		country = :country
	WHERE airline_id = :airline_id`
	r, err := db.NamedExec(QUERY, map[string]interface{}{
		"airline_id":       airline.AirlineId,
		"name":             airline.Name,
		"main_hub":         airline.MainHub,
		"headquarter_city": airline.HeadQuarter,
		"country":          airline.Country,
	})
	rows, _ := r.RowsAffected()
	return int(rows), err
}

func DeleteAirlineById(airlineId string) (int, error) {
	const QUERY = `DELETE FROM airline WHERE airline_id = :airline_id`
	r, err := db.NamedExec(QUERY, map[string]interface{}{
		"airline_id": airlineId,
	})
	cnt, _ := r.RowsAffected()
	return int(cnt), err
}

func CreateFlight(flight *model.Flight) error {
	const QUERY = `INSERT INTO flight (
		flight_id,
		departure_airport,
		arrival_airport,
		departure_time,
		arrival_time,
		airline_id
	) VALUES (
		:flight_id,
		:departure_airport,
		:arrival_airport,
		:departure_time,
		:arrival_time,
		:airline_id
	)`

	_, err := db.NamedExec(QUERY, map[string]interface{}{
		"flight_id":         flight.FlightId,
		"departure_airport": flight.DepartureAirport,
		"arrival_airport":   flight.ArrivalAirport,
		"departure_time":    flight.DepartureTime.Time().Format("15:04:05"),
		"arrival_time":      flight.ArrivalTime.Time().Format("15:04:05"),
		"airline_id":        flight.Airline.AirlineId,
	})
	return err
}

func UpdateFlightById(flight *model.Flight) (int, error) {
	const QUERY = `UPDATE flight SET 
		departure_airport = :departure_airport,
		arrival_airport = :arrival_airport,
		departure_time = :departure_time,
		arrival_time = :arrival_time,
		airline_id = :airline_id
	WHERE flight_id = :flight_id`
	r, err := db.NamedExec(QUERY, map[string]interface{}{
		"flight_id":         flight.FlightId,
		"departure_airport": flight.DepartureAirport,
		"arrival_airport":   flight.ArrivalAirport,
		"departure_time":    flight.DepartureTime.Time().Format("15:04:05"),
		"arrival_time":      flight.ArrivalTime.Time().Format("15:04:05"),
		"airline_id":        flight.Airline.AirlineId,
	})
	log.Println(err)
	rows, _ := r.RowsAffected()
	return int(rows), err
}

func DeleteFlightById(flightId string) (int, error) {
	const QUERY = `DELETE FROM flight WHERE flight_id = :flight_id`
	r, err := db.NamedExec(QUERY, map[string]interface{}{
		"flight_id": flightId,
	})
	cnt, _ := r.RowsAffected()
	return int(cnt), err
}

func GetInsurancePlan() ([]*model.InsurancePlan, error) {
	arr := make([]*model.InsurancePlan, 0)
	err := db.Select(&arr, "SELECT * FROM insurance_plan;")
	return arr, err
}

func CreateInsurancePlan(plan *model.InsurancePlan) error {
	const QUERY = `INSERT INTO insurance_plan (
		plan_id,
		name,
		description,
		cost_per_passenger
	) VALUES (
		:plan_id,
		:name,
		:description,
		:cost_per_passenger
	)`
	_, err := db.NamedExec(QUERY, map[string]interface{}{
		"plan_id":            plan.PlanId,
		"name":               plan.Name,
		"description":        plan.Description,
		"cost_per_passenger": plan.CostPerPassenger,
	})
	if err != nil {
		log.Println(err)
	}
	return err
}

func UpdateInsurancePlanById(plan *model.InsurancePlan) (int, error) {
	const QUERY = `UPDATE insurance_plan SET 
		name = :name,
		description = :description,
		cost_per_passenger = :cost_per_passenger
	WHERE plan_id = :plan_id`
	r, err := db.NamedExec(QUERY, map[string]interface{}{
		"plan_id":            plan.PlanId,
		"name":               plan.Name,
		"description":        plan.Description,
		"cost_per_passenger": plan.CostPerPassenger,
	})
	rows, _ := r.RowsAffected()
	return int(rows), err
}

func DeleteInsurancePlanById(planId string) (int, error) {
	const QUERY = `DELETE FROM insurance_plan WHERE plan_id = :plan_id`
	r, err := db.NamedExec(QUERY, map[string]interface{}{
		"plan_id": planId,
	})
	cnt, _ := r.RowsAffected()
	return int(cnt), err
}

// a customer can use 2 cards to pay for a flight
func CompleteItineraryTransaction(req *model.PaymentReq) error {
	currDate := time.Now().Format("2006-01-02")
	invoiceNumber := rand.Intn(MAX_ID-MIN_ID) + MIN_ID
	customerId := rand.Intn(MAX_ID-MIN_ID) + MIN_ID

	tx := db.MustBegin()
	tx.MustExec(
		`INSERT INTO customer (
			customer_id,
			street,
			city,
			country,
			zipcode,
			phone,
			phone_country_code,
			emer_contact_fname,
			emer_contact_lname,
			emer_contact_phone,
			emer_contact_country_code,
			type,
			member_id
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
		customerId,
		req.Customer.Street,
		req.Customer.City,
		req.Customer.Country,
		req.Customer.Zipcode,
		req.Customer.Phone,
		req.Customer.PhoneCountryCode,
		req.Customer.EmergencyContactFirstName,
		req.Customer.EmergencyContactLastName,
		req.Customer.EmergencyContactPhone,
		req.Customer.EmergencyContactCountryCode,
		req.Customer.Type,
		req.Customer.Member.MemberId)
	tx.MustExec(
		`INSERT INTO invoice (
			invoice_number, 
			invoice_date, 
			amount, 
			customer_id) VALUES ($1, $2, $3, $4)`,
		invoiceNumber,
		currDate,
		req.Amount,
		customerId)
	for _, card := range req.Cards {
		tx.MustExec(
			`INSERT INTO payment (
				payment_id,
				amount,
				payment_date,
				method,
				card_number,
				card_holder_first_name,
				card_holder_last_name,
				expiry_date,
				invoice_number
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
			rand.Intn(MAX_ID-MIN_ID)+MIN_ID,
			card.Amount,
			card.PaymentDate,
			card.Method,
			card.CardNumber,
			card.CardHolderFirstName,
			card.CardHolderLastName,
			card.ExpiryDate,
			invoiceNumber)
	}
	for _, passengerReq := range req.Passengers {
		passenger := passengerReq.Passenger
		tx.MustExec(
			`INSERT INTO passenger (
				passenger_id,
				first_name,
				middle_name,
				last_name,
				date_of_birth,
				gender,
				passport_num,
				passport_expire_date,
				nationality,
				customer_id
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
			passenger.PassengerId,
			passenger.FirstName,
			passenger.MiddleName,
			passenger.LastName,
			passenger.DateOfBirth,
			passenger.Gender,
			passenger.PassportNum,
			passenger.PassportExpireDate,
			passenger.Nationality,
			customerId,
		)

		for _, flight := range req.Flights {
			tx.MustExec(
				`INSERT INTO itinerary (
					passenger_id,
					flight_id,
					customer_id,
					cabin_class,
					meal_plan,
					special_request
				) VALUES ($1, $2, $3, $4, $5, $6);`,
				passenger.PassengerId,
				flight,
				customerId,
				req.CabinClass,
				passengerReq.MealPlan,
				passengerReq.SpecialRequest,
			)
		}
	}
	err := tx.Commit()
	return err
}
