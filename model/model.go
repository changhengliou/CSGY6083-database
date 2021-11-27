package model

type Airport struct {
	Code    string `json:"code"`
	City    string `json:"city"`
	Country string `json:"country"`
	Name    string `json:"name"`
	Type    string `json:"type"`
}
