package service

import (
	"database/sql"
	"fmt"
	"log"
	"math/rand"
	"sort"
	"strings"
	"time"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"

	"app/config"
	"app/model"
)

// [x] Table joins with at least 3 tables in join
// [x] Multi-row subquery
// [ ] Correlated subquery
// [x] SET operator query (union, intersect, except, union all)
// [x] Query with in line view or WITH clause
// [x] TOP-N query
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
	rand.Seed(time.Now().UTC().UnixNano())
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

func GetAvailableFlights(from, to string, stops int) ([][]*model.FlightSearchRow, error) {
	var rows []*model.FlightSearchRow
	const QUERY = `
	SELECT
		f.flight_id,
		f.departure_airport,
		f.arrival_airport,
		f.departure_time,
		f.arrival_time,
		a.name AS airline_name,
		ARRAY_TO_STRING(p.flights, ',') AS routes
	FROM flight AS f, airline AS a,
		(WITH RECURSIVE search_graph(departure, arrival, dep_time, arr_time, depth, flights, path, cycle) AS (
			SELECT f.departure_airport,
				f.arrival_airport,
				f.departure_time,
				f.arrival_time,
				1,
				ARRAY [f.flight_id]::varchar[],
				ARRAY [f.departure_airport, f.arrival_airport]::varchar[],
				false
			FROM flight AS f
			WHERE f.departure_airport = $1
			UNION ALL
			SELECT curr.departure_airport,
				curr.arrival_airport,
				curr.departure_time,
				curr.arrival_time,
				prev.depth + 1,
				prev.flights || curr.flight_id,
				path || curr.arrival_airport,
				curr.arrival_airport = ANY (path)
			FROM flight curr,
				search_graph prev
			WHERE prev.arrival = curr.departure_airport
				AND NOT cycle
				AND prev.depth <= $3
		)
		SELECT flights
		FROM search_graph
		WHERE arrival = $2) AS p
	WHERE f.flight_id = ANY(p.flights) AND f.airline_id = a.airline_id;`
	log.Println(QUERY)
	if err := db.Select(&rows, QUERY, from, to, stops); err != nil {
		return nil, err
	}
	log.Println(rows)
	flights := make(map[string][]*model.FlightSearchRow)
	for _, row := range rows {
		flights[row.Routes] = append(flights[row.Routes], row)
	}

	result := make([][]*model.FlightSearchRow, 0)
	for key, routes := range flights {
		routesOrder := make(map[string]int)
		for i, route := range strings.Split(key, ",") {
			routesOrder[route] = i
		}
		sort.SliceStable(routes, func(i, j int) bool {
			return routesOrder[routes[i].FlightId] < routesOrder[routes[j].FlightId]
		})
		result = append(result, routes)
	}
	return result, nil
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
	WHERE plan_id = :plan_id;`
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
func CompleteItineraryTransaction(req *model.PaymentReq) (int, error) {
	currDate := time.Now().Format("2006-01-02")
	invoiceNumber := rand.Intn(MAX_ID-MIN_ID) + MIN_ID
	customerId := rand.Intn(MAX_ID-MIN_ID) + MIN_ID
	memberId := sql.NullInt32{
		Int32: int32(req.Customer.Member.MemberId),
		Valid: req.Customer.Member.MemberId != 0,
	}

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
		memberId)
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
				card_holder_fname,
				card_holder_lname,
				expiry_date,
				invoice_number
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
			rand.Intn(MAX_ID-MIN_ID)+MIN_ID,
			card.Amount,
			currDate,
			card.Method,
			card.CardNumber,
			card.CardHolderFirstName,
			card.CardHolderLastName,
			card.ExpiryDate.Date().Format("2006-01-02"),
			invoiceNumber)
	}
	for _, passenger := range req.Passengers {
		passenger.PassengerId = rand.Intn(MAX_ID-MIN_ID) + MIN_ID
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
				customer_id,
				insurance_plan_id
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`,
			passenger.PassengerId,
			passenger.FirstName,
			passenger.MiddleName,
			passenger.LastName,
			passenger.DateOfBirth.Date().Format("2006-01-02"),
			passenger.Gender,
			passenger.PassportNum,
			passenger.PassportExpireDate.Date().Format("2006-01-02"),
			passenger.Nationality,
			customerId,
			passenger.InsurancePlan.PlanId,
		)

		for i, flight := range req.Flights {
			tx.MustExec(
				`INSERT INTO itinerary (
					passenger_id,
					flight_id,
					cabin_class,
					meal_plan,
					special_request,
					seq,
					date
				) VALUES ($1, $2, $3, $4, $5, $6, $7);`,
				passenger.PassengerId,
				flight.FlightId,
				req.CabinClass,
				passenger.MealPlan,
				passenger.SpecialRequest,
				i,
				flight.Date.Date().Format("2006-01-02"),
			)
		}
	}
	err := tx.Commit()
	return customerId, err
}

func GetItineraryByCustomerId(customerId int) ([]*model.ConfirmResult, error) {
	const QUERY = `
	SELECT
		i.passenger_id AS "passenger_id",
		p.first_name AS "first_name",
		p.last_name AS "last_name",
		p.gender AS "gender",
		i.flight_id AS "flight.flight_id",
		i.date AS "date",
		f.departure_time AS "flight.departure_time",
		f.arrival_time AS "flight.arrival_time",
		f.departure_airport AS "flight.departure_airport",
		f.arrival_airport AS "flight.arrival_airport",
		cabin_class,
		meal_plan,
		special_request,
		seq,
		ip.name AS "insurance_plan.name"
	FROM
	  passenger AS p,
		itinerary AS i,
		insurance_plan AS ip,
		flight AS f
	WHERE 
		p.passenger_id = i.passenger_id AND 
		p.insurance_plan_id = ip.plan_id AND 
		i.flight_id = f.flight_id AND
		p.customer_id = $1
	ORDER BY i.passenger_id ASC, seq ASC;`
	var itineraries []*model.ConfirmResult
	if err := db.Select(&itineraries, QUERY, customerId); err != nil {
		return nil, err
	}
	return itineraries, nil
}

func GetItineraryByMemberId(customerId int) ([]*model.ConfirmResult, error) {
	const QUERY = `
	SELECT
		i.passenger_id AS "passenger_id",
		p.first_name AS "first_name",
		p.last_name AS "last_name",
		p.gender AS "gender",
		i.flight_id AS "flight.flight_id",
		i.date AS "date",
		f.departure_time AS "flight.departure_time",
		f.arrival_time AS "flight.arrival_time",
		f.departure_airport AS "flight.departure_airport",
		f.arrival_airport AS "flight.arrival_airport",
		cabin_class,
		meal_plan,
		special_request,
		seq,
		ip.name AS "insurance_plan.name"
	FROM
	  passenger AS p,
		itinerary AS i,
		customer AS c,
		insurance_plan AS ip,
		flight AS f
	WHERE
	  c.member_id = $1 AND
		c.customer_id = p.customer_id AND
		p.passenger_id = i.passenger_id AND 
		p.insurance_plan_id = ip.plan_id AND 
		i.flight_id = f.flight_id
	ORDER BY i.passenger_id ASC, seq ASC;`
	var itineraries []*model.ConfirmResult
	if err := db.Select(&itineraries, QUERY, customerId); err != nil {
		return nil, err
	}
	return itineraries, nil
}

func GetFlightStatus(req *model.FlightStatusReq) ([]*model.FlightStatusRow, error) {
	query := `
	SELECT
		f.flight_id,
		air.name AS "airline.name",
		f.departure_airport,
		f.arrival_airport,
		f.departure_time,
		f.arrival_time,
		dep.country AS dep_country,
		dep.city AS dep_city,
		arr.country AS arr_country,
		arr.city AS arr_city
	FROM flight AS f
	INNER JOIN airport AS dep on dep.code = f.departure_airport
	INNER JOIN airport AS arr on arr.code = f.arrival_airport
	INNER JOIN airline AS air on air.airline_id = f.airline_id`
	args := make([]interface{}, 0)
	q := []string{}
	if req.DepartureAirport != "" {
		args = append(args, req.DepartureAirport)
		q = append(q, fmt.Sprintf("f.departure_airport=$%d", len(args)))
	}
	if req.ArrivalAirport != "" {
		args = append(args, req.ArrivalAirport)
		q = append(q, fmt.Sprintf("f.arrival_airport=$%d", len(args)))
	}
	if req.AirlineId != 0 {
		args = append(args, req.AirlineId)
		q = append(q, fmt.Sprintf("f.airline_id=$%d", len(args)))
	}
	if req.FlightId != "" {
		args = append(args, req.FlightId)
		q = append(q, fmt.Sprintf("f.flight_id=$%d", len(args)))
	}
	if len(q) > 0 {
		query += " WHERE "
	}
	args = append(args, req.PageSize)
	args = append(args, req.Page*req.PageSize)
	query += strings.Join(q, " AND ")
	query += fmt.Sprintf(` ORDER BY departure_time ASC LIMIT $%d OFFSET $%d;`, len(args)-1, len(args))

	var flights []*model.FlightStatusRow
	err := db.Select(&flights, query, args...)
	return flights, err
}

func GetMembershipsByAirlineId(airlineId int) ([]*model.Membership, error) {
	var memberships []*model.Membership
	err := db.Select(&memberships, `SELECT membership_id, membership_name FROM membership WHERE airline_id = $1;`, airlineId)
	return memberships, err
}

func GetMembersByMembershipId(membershipId string) ([]*model.Member, error) {
	var members []*model.Member
	err := db.Select(&members, `
		SELECT
		  member_id,
			member_start_date,
			member_end_date,
			membership_id AS "membership.membership_id" 
		FROM member WHERE membership_id = $1`, membershipId)
	return members, err
}

func CreateMember(member *model.Member) (int, error) {
	r, err := db.Exec(`
		INSERT INTO member VALUES ($1, $2, $3, $4);
	`, member.MemberId,
		member.MemberStartDate.Date().Format("2006-01-02"),
		member.MemberEndDate.Date().Format("2006-01-02"),
		member.Membership.MembershipId,
	)
	if err != nil {
		return 0, err
	}
	cnt, err := r.RowsAffected()
	return int(cnt), err
}

func DeleteMemberByMemberId(memberId string) (int, error) {
	r, err := db.Exec("DELETE FROM member WHERE member_id = $1", memberId)
	if err != nil {
		return 0, err
	}
	cnt, err := r.RowsAffected()
	return int(cnt), err
}

func GetStats() (*model.StatsResp, error) {
	// customers who fly today
	r, err := db.Query(`
		SELECT CONCAT(
			CASE WHEN p.gender = 'M' THEN 'Mr.' ELSE 'Mrs.' END,
			p.first_name,
			' ',
			p.last_name,
			' (',
			f.departure_airport,
			'->',
			f.arrival_airport,
			')'
		) AS info
		FROM itinerary AS i,
		passenger AS p,
		flight AS f
		WHERE i.date = $1
		AND i.passenger_id = p.passenger_id
		AND i.flight_id = f.flight_id;
	`, time.Now().Format("2006-01-02"))

	ans := model.StatsResp{}
	if err != nil {
		return &ans, err
	}
	for r.Next() {
		var str string
		if err := r.Scan(&str); err != nil {
			return &ans, err
		}
		ans.FlyTodayInfo = append(ans.FlyTodayInfo, str)
	}

	// Most Popular Insurance Plan With Price >= 100
	r, err = db.Query(`
		WITH v AS (SELECT COUNT(*) AS cnt, insurance_plan_id
							FROM passenger AS p
							WHERE insurance_plan_id IN (
									SELECT insurance_plan_id FROM insurance_plan WHERE cost_per_passenger >= 100
							)
							GROUP BY insurance_plan_id
							ORDER BY cnt DESC
							LIMIT 1)
		SELECT name
		FROM v,
		insurance_plan
		WHERE plan_id = v.insurance_plan_id;
	`)
	if err != nil {
		return &ans, err
	}
	if r.Next() {
		if err := r.Scan(&ans.MostPopInsGreat); err != nil {
			return &ans, err
		}
	}

	// Most Popular Insurance Plan With Price < 100
	r, err = db.Query(`
		WITH v AS (SELECT COUNT(*) AS cnt, insurance_plan_id
							FROM passenger AS p
							WHERE insurance_plan_id IN (
									SELECT insurance_plan_id FROM insurance_plan WHERE cost_per_passenger < 100
							)
							GROUP BY insurance_plan_id
							ORDER BY cnt DESC
							LIMIT 1)
		SELECT name
		FROM v,
		insurance_plan
		WHERE plan_id = v.insurance_plan_id;
	`)
	if err != nil {
		return &ans, err
	}
	if r.Next() {
		if err := r.Scan(&ans.MostPopInsSmall); err != nil {
			return &ans, err
		}
	}

	// Top 10 Members Who Booked The Most Flights
	r, err = db.Query(`
		SELECT m.member_id, COUNT(*) AS cnt
		FROM member AS m
		JOIN customer AS c ON m.member_id = c.member_id
		JOIN passenger AS p on c.customer_id = p.customer_id
		JOIN itinerary AS i on p.passenger_id = i.passenger_id
		GROUP BY m.member_id
		ORDER BY cnt DESC
		LIMIT 10;
	`)
	if err != nil {
		return &ans, err
	}
	for r.Next() {
		memberId, cnt := 0, 0
		if err := r.Scan(&memberId, &cnt); err != nil {
			return &ans, err
		}
		ans.TopMembers = append(ans.TopMembers, memberId)
	}

	// payments
	var invoices []*model.Invoice
	err = db.Select(&invoices, "SELECT invoice_number, invoice_date, amount FROM invoice;")
	if err != nil {
		return &ans, err
	}
	ans.Invoices = invoices
	return &ans, nil
}
