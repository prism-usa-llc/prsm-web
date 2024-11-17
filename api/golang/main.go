package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"regexp"
)

func gabfOutline(w http.ResponseWriter, r *http.Request) {
	// fetch the page
	gabfURL := "https://graceambassadors.com/live"
	resp, err := http.Get(gabfURL)
	if err != nil {
		fmt.Fprintf(w, "failed to get page from %s", gabfURL)
		return
	}

	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Fprintf(w, "Failed to read body from %s", gabfURL)
	}
	pattern := `https://.*.pdf`
	re, err := regexp.Compile(pattern)
	if err != nil {
		panic(err)
	}
	matches := re.FindStringSubmatch(string(body))
	if len(matches) > 0 {
		http.Redirect(w, r, matches[0], http.StatusMovedPermanently)
	}

	fmt.Fprintf(w, "could not find pdf file from %s", gabfURL)

	// fmt.Println(string(body))
	// fmt.Println("Matches: ", matches)
	// fmt.Fprintf(w, "WIP")

}

func placeholder(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "placeholder")
}

func main() {
	http.HandleFunc("/placeholder", placeholder)
	http.HandleFunc("/gabf_outline", gabfOutline)
	port := ":8080"
	fmt.Printf("listening on : %s\n", port)
	log.Fatal(http.ListenAndServe(port, nil))
}
