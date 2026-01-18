package handlers

import (
	"encoding/json"
	"net/http"
	"time"
)

type ActivityHandler struct{}

func (h *ActivityHandler) Verify(w http.ResponseWriter, r *http.Request) {
	// Mock Logic
	resp := map[string]interface{}{
		"activityScore": 0.75,
		"signals":       []string{"utility_usage", "tax_payment"},
		"timestamp":     time.Now().Format(time.RFC3339),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
