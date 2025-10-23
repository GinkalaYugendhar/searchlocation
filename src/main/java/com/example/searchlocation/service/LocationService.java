package com.example.searchlocation.service;

import com.example.searchlocation.entity.Locations;
import com.example.searchlocation.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {
    @Autowired
    private LocationRepository locationRepository;

    public List<Locations> searchByLocation(String keyword)
    {
        return locationRepository.findByLocationNameContainingIgnoreCase(keyword);
    }
}
