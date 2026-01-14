package main

import (
	"log"
	"net/http"
	"oracle-network/handlers"
	"time"
)

func main() {
	mux := http.NewServeMux()

	// Initialize handlers
	existenceHandler := &handlers.ExistenceHandler{}
	ownershipHandler := &handlers.OwnershipHandler{}
	activityHandler := &handlers.ActivityHandler{}

	mux.HandleFunc("/verify/existence", existenceHandler.Verify)
	mux.HandleFunc("/verify/ownership", ownershipHandler.Verify)
	mux.HandleFunc("/verify/activity", activityHandler.Verify)

	srv := &http.Server{
		Addr:         ":8081",
		Handler:      mux,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	log.Println("Oracle Network Node starting on :8081")
	if err := srv.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
