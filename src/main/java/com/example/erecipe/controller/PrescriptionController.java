package com.example.erecipe.controller;

import com.example.erecipe.entity.Prescription;
import com.example.erecipe.exception.ResourceNotFoundException;
import com.example.erecipe.service.PrescriptionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    @GetMapping("/api/prescriptions")
    public List<Prescription> getAllPrescriptions() {
        return prescriptionService.getAllPrescriptions();
    }

    @PostMapping("/api/prescriptions")
    public Prescription createPrescription(@RequestBody Prescription prescription) {
        return prescriptionService.createPrescription(prescription);
    }

    @DeleteMapping("/api/prescriptions/{id}")
    public void deletePrescription(@PathVariable Long id) {
        prescriptionService.deletePrescription(id);
    }

    @PutMapping("/api/prescriptions/{id}")
    public Prescription updatePrescription
            (@PathVariable Long id, @RequestBody Prescription prescription)
            throws ResourceNotFoundException {
        return prescriptionService.updatePrescription(id, prescription);
    }

}
