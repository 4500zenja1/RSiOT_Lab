package com.example.erecipe.service;

import com.example.erecipe.entity.Prescription;
import com.example.erecipe.exception.ResourceNotFoundException;
import com.example.erecipe.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;

    public PrescriptionService(PrescriptionRepository prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }

    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    public Prescription createPrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }

    public void deletePrescription(Long id) {
        prescriptionRepository.deleteById(id);
    }

    public Prescription updatePrescription(Long id, Prescription prescription) throws ResourceNotFoundException {
        Prescription prescriptionToUpdate = prescriptionRepository
                .findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Prescription not found with id :" + id)
                );
        prescriptionToUpdate.setDoctor(prescription.getDoctor());
        prescriptionToUpdate.setPatient(prescription.getPatient());
        prescriptionToUpdate.setMedication(prescription.getMedication());
        prescriptionToUpdate.setDate(prescription.getDate());
        return prescriptionRepository.save(prescriptionToUpdate);
    }

}

