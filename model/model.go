package model

import (
	"encoding/json"
	"time"
)

type timeOnly time.Time
type dateOnly time.Time

var _ json.Unmarshaler = &timeOnly{}
var _ json.Unmarshaler = &dateOnly{}

func (mt *timeOnly) MarshalJSON() ([]byte, error) {
	b, err := json.Marshal(mt.Time().Format("15:04"))
	if err != nil {
		return nil, err
	}
	return b, nil
}

func (mt *dateOnly) MarshalJSON() ([]byte, error) {
	b, err := json.Marshal(mt.Date().Format("2006-01-02"))
	if err != nil {
		return nil, err
	}
	return b, nil
}

func (mt *timeOnly) UnmarshalJSON(bs []byte) error {
	var s string
	err := json.Unmarshal(bs, &s)
	if err != nil {
		return err
	}
	t, err := time.Parse("15:04", s)
	if err != nil {
		return err
	}
	*mt = timeOnly(t)
	return nil
}

func (mt *dateOnly) UnmarshalJSON(bs []byte) error {
	var s string
	err := json.Unmarshal(bs, &s)
	if err != nil {
		return err
	}
	t, err := time.Parse("2006-01-02", s)
	if err != nil {
		return err
	}
	*mt = dateOnly(t)
	return nil
}

func (mt *timeOnly) Time() *time.Time {
	c := time.Time(*mt)
	return &c
}

func (mt *dateOnly) Date() *time.Time {
	c := time.Time(*mt)
	return &c
}

type Airport struct {
	Code    string `json:"code" binding:"required"`
	City    string `json:"city" binding:"required"`
	Country string `json:"country" binding:"required"`
	Name    string `json:"name" binding:"required"`
	Type    string `json:"type" binding:"required"`
}

type Airline struct {
	AirlineId   int    `json:"airlineId" db:"airline_id"`
	Name        string `json:"name" binding:"required"`
	MainHub     string `json:"mainHub" db:"main_hub" binding:"required"`
	HeadQuarter string `json:"headQuarter" db:"headquarter_city" binding:"required"`
	Country     string `json:"country" binding:"required"`
}

type Flight struct {
	FlightId         string    `json:"flightId" db:"flight_id"`
	DepartureAirport string    `json:"departureAirport" db:"departure_airport"`
	ArrivalAirport   string    `json:"arrivalAirport" db:"arrival_airport"`
	DepartureTime    *timeOnly `json:"departureTime" db:"departure_time"`
	ArrivalTime      *timeOnly `json:"arrivalTime" db:"arrival_time"`
	Airline          *Airline  `json:"airline" db:"airline" binding:"-"`
}

type FlightSearchReq struct {
	Departure string `form:"dep" json:"departure" binding:"required,len=3"`
	Arrival   string `form:"arr" json:"arrival" binding:"required,len=3"`
	Stops     int    `form:"stops" json:"stops" binding:"max=5"`
}

type InsurancePlan struct {
	PlanId           int     `json:"planId" db:"plan_id"`
	Name             string  `json:"name" db:"name" binding:"required"`
	Description      string  `json:"description" db:"description" binding:"required"`
	CostPerPassenger float64 `json:"costPerPassenger" db:"cost_per_passenger" binding:"required"`
}

type Member struct {
	MemberId            int       `json:"memberId" db:"member_id"`
	MembershipName      string    `json:"membershipName" db:"membership_name" binding:"required"`
	MembershipStartDate *dateOnly `json:"membershipStartDate" db:"membership_start_date" binding:"required"`
	MembershipEndDate   *dateOnly `json:"membershipEndDate" db:"membership_end_date" binding:"required"`
	Airline             *Airline  `json:"airline" db:"airline" binding:"-"`
}

type Invoice struct {
	InvoiceNumber int       `json:"invoiceNumber" db:"invoice_number"`
	Date          *dateOnly `json:"date" db:"invoice_date"`
	Amount        float64   `json:"amount" db:"amount"`
	Customer      *Customer `json:"customer" db:"customer" binding:"-"`
}

type Customer struct {
	CustomerId                  int            `json:"customerId" db:"customer_id"`
	Street                      string         `json:"street" binding:"required"`
	City                        string         `json:"city" binding:"required"`
	Country                     string         `json:"country" binding:"required"`
	Zipcode                     string         `json:"zipcode" binding:"required"`
	Phone                       int            `json:"phone" binding:"required"`
	PhoneCountryCode            int            `json:"phoneCountryCode" db:"phone_country_code" binding:"required"`
	EmergencyContactFirstName   string         `json:"emergencyContactFirstName" db:"emer_contact_fname" binding:"required"`
	EmergencyContactLastName    string         `json:"emergencyContactLastName" db:"emer_contact_lname" binding:"required"`
	EmergencyContactPhone       int            `json:"emergencyContactPhone" db:"emer_contact_phone" binding:"required"`
	EmergencyContactCountryCode int            `json:"emergencyContactCountryCode" db:"emer_contact_country_code" binding:"required"`
	Type                        byte           `json:"type" db:"type" binding:"required"`
	InsurancePlan               *InsurancePlan `json:"insurancePlan" db:"insurance_plan" binding:"-"`
	Invoice                     *Invoice       `json:"invoice" db:"invoice" binding:"-"`
	Member                      *Member        `json:"member" db:"member" binding:"-"`
}

type Passenger struct {
	PassengerId        string    `json:"passengerId" db:"passenger_id"`
	FirstName          string    `json:"firstName" db:"first_name" binding:"required"`
	MiddleName         string    `json:"middleName" db:"middle_name"`
	LastName           string    `json:"lastName" db:"last_name" binding:"required"`
	DateOfBirth        *dateOnly `json:"dateOfBirth" db:"date_of_birth" binding:"required"`
	Gender             byte      `json:"gender" binding:"required"`
	PassportNum        int       `json:"passportNum" db:"passport_num" binding:"required"`
	PassportExpireDate *dateOnly `json:"passportExpireDate" db:"passport_expire_date" binding:"required"`
	Nationality        string    `json:"nationality" binding:"required"`
	Customer           *Customer `json:"customer" db:"customer" binding:"-"`
}

type Itinerary struct {
	Passenger      *Passenger `json:"passenger" db:"passenger" binding:"-"`
	Flight         *Flight    `json:"flight" db:"flight" binding:"-"`
	Customer       *Customer  `json:"customer" db:"customer" binding:"-"`
	CabinClass     string     `json:"cabinClass" db:"cabin_class" binding:"required"`
	MealPlan       string     `json:"mealPlan" db:"meal_plan" binding:"required"`
	SpecialRequest byte       `json:"specialRequest" db:"special_request" binding:"required"`
}

type Agent struct {
	Customer   *Customer `json:"customer" db:"customer" binding:"-"`
	AgentName  string    `json:"agentName" db:"agent_name" binding:"required"`
	WebAddress string    `json:"webAddress" db:"web_address" binding:"required"`
	Phone      int       `json:"phone" db:"phone" binding:"required"`
}

type PaymentReq struct {
	Customer   *Customer    `json:"customer" db:"customer" binding:"-"`
	Passengers []*Passenger `json:"passengers" db:"passenger" binding:"required"`
}
