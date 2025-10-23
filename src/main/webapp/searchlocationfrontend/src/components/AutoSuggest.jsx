import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const AutoSuggest = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [hotels, setHotels] = useState([]); // store hotel data
  const controllerRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query || query.trim() === "") {
        setSuggestions([]);
        return;
      }

      // cancel previous request if still pending
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      controllerRef.current = new AbortController();

      try {
        const res = await axios.get(
          `http://localhost:8080/api/locations/search?keyword=${query}`,
          { signal: controllerRef.current.signal }
        );
        setSuggestions(res.data);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error("Error fetching suggestions:", err);
      }
    };

    const delay = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(delay);
  }, [query]);

  // fetch hotels for the selected location
  const handleSubmit = async () => {
    if (!query || query.trim() === "") return;

    try {
      const res = await axios.get(
        `http://localhost:8080/api/locations/by-location?location=${query}`
      );
      setHotels(res.data);
    } catch (err) {
      console.error("Error fetching hotels:", err);
      setHotels([]);
    }
  };

  return (
    <div
      style={{
        width: "400px",
        margin: "50px auto",
        position: "relative",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Search location..."
          value={query || ""}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            outline: "none",
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </div>

      {suggestions.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            border: "1px solid #ddd",
            borderTop: "none",
            maxHeight: "200px",
            overflowY: "auto",
            position: "absolute",
            width: "100%",
            backgroundColor: "white",
            zIndex: 10,
          }}
        >
          {suggestions.map((item) => (
            <li
              key={item.id}
              onClick={() => {
                setQuery(item.locationName);
                setSuggestions([]);
              }}
              style={{
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #f0f0f0",
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "#f5f5f5")
              }
              onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
            >
              {item.locationName}
            </li>
          ))}
        </ul>
      )}

      {/* Hotel Details Section */}
      {hotels.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Hotels in "{query}"</h3>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          >
            {hotels.map((hotel) => (
              <li
                key={hotel.hotelId}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                }}
              >
                <strong>{hotel.hotelName}</strong> <br />
                {hotel.hotelAddress}, {hotel.hotelCity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AutoSuggest;
