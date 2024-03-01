package com.example.erecipe.service;

import com.example.erecipe.entity.Medication;
import com.example.erecipe.exception.ResourceNotFoundException;
import com.example.erecipe.repository.MedicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicationService {

    private final MedicationRepository medicationRepository;

    public MedicationService(MedicationRepository medicationRepository) {
        this.medicationRepository = medicationRepository;
    }

    public List<Medication> getAllMedications() {
        return medicationRepository.findAll();
    }

    public Medication createMedication(Medication medication) {
        return medicationRepository.save(medication);
    }

    public void deleteMedication(Long id) {
        medicationRepository.deleteById(id);
    }

    public Medication updateMedication(Long id, Medication medication) throws ResourceNotFoundException {
        Medication medicationToUpdate = medicationRepository
                .findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Medication not found with id :" + id)
                );
        medicationToUpdate.setName(medication.getName());
        medicationToUpdate.setDosage(medication.getDosage());
        medicationToUpdate.setForm(medication.getForm());
        return medicationRepository.save(medicationToUpdate);
    }

}

