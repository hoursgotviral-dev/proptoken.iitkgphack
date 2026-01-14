package handlers

import (
	"encoding/json"
	"net/http"
	"time"
)

type OwnershipHandler struct{}

type OwnershipRequest struct {
	AssetId string `json:"assetId"`
	Did     string `json:"did"`
}

type OwnershipResponse struct {
	Probability float64 `json:"probability"`
	Verified    bool    `json:"verified"`
	Timestamp   string  `json:"timestamp"`
}

func (h *OwnershipHandler) Verify(w http.ResponseWriter, r *http.Request) {
	// Mock Logic
	resp := OwnershipResponse{
		Probability: 0.88,
		Verified:    true,
		Timestamp:   time.Now().Format(time.RFC3339),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
