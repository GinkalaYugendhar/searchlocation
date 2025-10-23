package com.example.searchlocation.controller;

import com.example.searchlocation.entity.Locations;
import com.example.searchlocation.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/locations")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @GetMapping("/search")
    public ResponseEntity<List<Locations>> searchLocations(@RequestParam("keyword") String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
        List<Locations> results = locationService.searchByLocation(keyword);
        System.out.println(results);
        return ResponseEntity.ok(results);
    }
}

