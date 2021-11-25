package main

import (
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// some middleware
	// r.Use(gin.Logger())
	api := r.Group("/api/")
	{
		api.GET("/user", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "Hello World",
			})
		})
	}

	if err := r.Run(); err != nil {
		log.Fatal(err)
	}
}
