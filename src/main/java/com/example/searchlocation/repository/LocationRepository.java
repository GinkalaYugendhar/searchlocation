package com.example.searchlocation.repository;

import com.example.searchlocation.entity.Locations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Locations, Long> {
    List<Locations> findByLocationNameContainingIgnoreCase(String keyword);
}
