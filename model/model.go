package model

import (
	"encoding/json"
	"time"
)

type timeOnly time.Time

var _ json.Unmarshaler = &timeOnly{}

func (mt *timeOnly) MarshalJSON() ([]byte, error) {
	b, err := json.Marshal(time.Time(*mt).Format("15:04"))
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

func (mt *timeOnly) Time() *time.Time {
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
	MemberId            int        `json:"memberId" db:"member_id"`
	MembershipName      string     `json:"membershipName" db:"membership_name" binding:"required"`
	MembershipStartDate *time.Time `json:"membershipStartDate" db:"membership_start_date" binding:"required"`
	MembershipEndDate   *time.Time `json:"membershipEndDate" db:"membership_end_date" binding:"required"`
	Airline             *Airline   `json:"airline" db:"airline" binding:"-"`
}

type Invoice struct {
	InvoiceNumber int        `json:"invoiceNumber" db:"invoice_number"`
	Date          *time.Time `json:"date" db:"invoice_date"`
	Amount        float64    `json:"amount" db:"amount"`
	Customer      *Customer  `json:"customer" db:"customer" binding:"-"`
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
