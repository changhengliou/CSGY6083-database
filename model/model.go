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

type Airport struct {
	Code    string `json:"code"`
	City    string `json:"city"`
	Country string `json:"country"`
	Name    string `json:"name"`
	Type    string `json:"type"`
}

type Airline struct {
	AirlineId   int    `json:"airlineId" db:"airline_id"`
	Name        string `json:"name"`
	MainHub     string `json:"mainHub" db:"main_hub"`
	HeadQuarter string `json:"headQuarter" db:"headquarter_city"`
	Country     string `json:"country"`
}

type Flight struct {
	FlightId         string    `json:"flightId" db:"flight_id"`
	DepartureAirport string    `json:"departureAirport" db:"departure_airport"`
	ArrivalAirport   string    `json:"arrivalAirport" db:"arrival_airport"`
	DepartureTime    *timeOnly `json:"departureTime" db:"departure_time"`
	ArrivalTime      *timeOnly `json:"arrivalTime" db:"arrival_time"`
	Airline          *Airline  `json:"airline" db:"airline"`
}
