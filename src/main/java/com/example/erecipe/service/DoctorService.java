package com.example.erecipe.service;

import com.example.erecipe.entity.Doctor;
import com.example.erecipe.exception.ResourceNotFoundException;
import com.example.erecipe.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor createDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }

    public Doctor updateDoctor(Long id, Doctor doctor) throws ResourceNotFoundException {
        Doctor doctorToUpdate = doctorRepository
                .findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Doctor not found with id :" + id)
                );
        doctorToUpdate.setFirstName(doctor.getFirstName());
        doctorToUpdate.setLastName(doctor.getLastName());
        return doctorRepository.save(doctorToUpdate);
    }

}

