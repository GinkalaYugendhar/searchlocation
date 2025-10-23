import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const AutoSuggest = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
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
        if (axios.isCancel(err)) return; // ignore aborted requests
        console.error("Error fetching suggestions:", err);
      }
    };

    const delay = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div style={{ width: "300px", margin: "50px auto", position: "relative" }}>
      <input
        type="text"
        placeholder="Search location..."
        value={query || ""}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          outline: "none",
        }}
      />

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
    </div>
  );
};

export default AutoSuggest;
