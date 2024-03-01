package com.example.erecipe.service;

import com.example.erecipe.entity.Patient;
import com.example.erecipe.exception.ResourceNotFoundException;
import com.example.erecipe.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient createPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }

    public Patient updatePatient(Long id, Patient patient) throws ResourceNotFoundException {
        Patient patientToUpdate = patientRepository
                .findById(id)
                .orElseThrow(
                    () -> new ResourceNotFoundException("Patient not found with id :" + id)
                );
        patientToUpdate.setFirstName(patient.getFirstName());
        patientToUpdate.setLastName(patient.getLastName());
        return patientRepository.save(patientToUpdate);
    }

}

