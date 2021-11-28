package service

import (
	"fmt"
	"log"

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

func GetAvailableFlights(from, to string, stops int) [][]*model.Flight {
	var flightList []*model.Flight
	if err := db.Select(&flightList, "SELECT flight_id, departure_airport, arrival_airport, departure_time, arrival_time FROM flight"); err != nil {
		log.Fatalln(err)
	}
	// build graph
	flightGraph := make(map[string][]*model.Flight)
	q := make([][]*model.Flight, 0)
	for _, flight := range flightList {
		if _, ok := flightGraph[flight.DepartureAirport]; !ok {
			flightGraph[flight.DepartureAirport] = make([]*model.Flight, 0)
		}

		flightGraph[flight.DepartureAirport] = append(flightGraph[flight.ArrivalAirport], flight)
		if flight.DepartureAirport == from {
			q = append(q, []*model.Flight{flight})
		}
	}
	// find all paths
	ans := make([][]*model.Flight, 0)
	step := 0
	for len(q) > 0 {
		for i := 0; i < len(q); i++ {
			curr := q[0]
			q = q[1:]
			if curr[len(curr)-1].ArrivalAirport == to {
				ans = append(ans, curr)
				continue
			}
			for _, flight := range flightGraph[curr[len(curr)-1].ArrivalAirport] {
				// TODO: add flag to stop search long hours transfer at airport
				// if flight.DepartureTime.Time().Before(*curr[len(curr)-1].ArrivalTime.Time()) {
				// 	continue
				// }
				q = append(q, append(curr, flight))
			}
		}
		step++
		if step > stops {
			break
		}
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
