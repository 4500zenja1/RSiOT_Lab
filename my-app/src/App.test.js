import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import axios from 'axios'; // Import axios

jest.mock('axios'); // Mock axios for controlled data fetching

// Sample mock data for testing
const mockPrescriptions = [
  {
    id: 1,
    doctor: {
      firstName: "John",
      lastName: "Doe"
    },
    patient: {
      firstName: "Jane",
      lastName: "Smith"
    },
    medication: {
      name: "Aspirin",
      dosage: "500mg",
      form: "Tablet"
    },
    date: "2023-12-31"
  },
  {
    id: 2,
    doctor: {
      firstName: "David",
      lastName: "Jones"
    },
    patient: {
      firstName: "Smithy",
      lastName: "Junes"
    },
    medication: {
      name: "Analgin",
      dosage: "250mg",
      form: "Tears"
    },
    date: "2023-12-20"
  },
  {
    id: 3,
    doctor: {
      firstName: "Morbius",
      lastName: "Deratto"
    },
    patient: {
      firstName: "Olga",
      lastName: "Konovalenko"
    },
    medication: {
      name: "Zolengma",
      dosage: "100mg",
      form: "Pills"
    },
    date: "2024-03-07"
  },
];

test('fetches and displays prescriptions from the API', async () => {
  // Mock successful API response
  axios.get.mockResolvedValueOnce({ data: mockPrescriptions });

  render(<App />);

  // Wait for data fetching to complete
  await act(async () => {
    // Since data fetching is asynchronous, use act to ensure rendering happens after data is available
  });

  // Assertions for data representation
  mockPrescriptions.forEach((prescription) => {
    expect(screen.getByText(`${prescription.doctor.firstName} ${prescription.doctor.lastName}`)).toBeInTheDocument();
    expect(screen.getByText(`${prescription.patient.firstName} ${prescription.patient.lastName}`)).toBeInTheDocument();
    expect(screen.getByText(prescription.medication.name)).toBeInTheDocument();
  });
});

test('adds a new prescription and displays it in the table', async () => {
  const newPrescription = {
    doctor: {
      firstName: "Alice",
      lastName: "Brown"
    },
    patient: {
      firstName: "Bob",
      lastName: "Miller"
    },
    medication: {
      name: "Paracetamol",
      dosage: "500mg",
      form: "Tablet"
    },
    date: "2024-03-07" // Adjust date as needed
  };

  // Mock successful API responses for fetching and adding prescriptions
  axios.get.mockResolvedValueOnce({ data: mockPrescriptions });
  axios.post.mockResolvedValueOnce({ data: { id: 4, ...newPrescription } }); // Adjust data based on your response structure

  render(<App />);

  // Wait for initial data fetching to complete
  await act(async () => {
    // ...
  });

  // Fill in the form with new prescription data
  const doctorFirstNameInput = screen.getByLabelText('Имя доктора:');
  const doctorLastNameInput = screen.getByLabelText('Фамилия доктора:');
  const patientFirstNameInput = screen.getByLabelText('Имя пациента:');
  const patientLastNameInput = screen.getByLabelText('Фамилия пациента:');
  const medicationNameInput = screen.getByLabelText('Название:');
  const medicationDosageInput = screen.getByLabelText('Дозировка:');
  const medicationFormInput = screen.getByLabelText('Форма:');
  const dateInput = screen.getByLabelText('Дата:');

  act(() => {
    userEvent.type(doctorFirstNameInput, newPrescription.doctor.firstName);
    userEvent.type(doctorLastNameInput, newPrescription.doctor.lastName);
    userEvent.type(patientFirstNameInput, newPrescription.patient.firstName);
    userEvent.type(patientLastNameInput, newPrescription.patient.lastName);
    userEvent.type(medicationNameInput, newPrescription.medication.name);
    userEvent.type(medicationDosageInput, newPrescription.medication.dosage);
    userEvent.type(medicationFormInput, newPrescription.medication.form);
    userEvent.type(dateInput, newPrescription.date);
  })

  // Submit the form
  const submitButton = screen.getByText('Создать рецепт');
  fireEvent.click(submitButton);

  // Wait for data update after submission
  await act(async () => {
    // ...
  });

  // Assertions for new prescription in the table
  expect(screen.getByText(`${newPrescription.doctor.firstName} ${newPrescription.doctor.lastName}`)).toBeInTheDocument();
  expect(screen.getByText(`${newPrescription.patient.firstName} ${newPrescription.patient.lastName}`)).toBeInTheDocument();
  expect(screen.getByText(newPrescription.medication.name)).toBeInTheDocument();
});

test('edits an existing prescription and updates the table', async () => {
  const newPrescriptionData = {
    doctor: {
      firstName: "Updated Doctor",
      lastName: "Last Name"
    },
    patient: {
      firstName: "Updated Patient",
      lastName: "Full Name"
    },
    medication: {
      name: "New Medication",
      dosage: "100mg",
      form: "Capsule"
    },
    date: "2024-03-10" // Adjust date as needed
  };

  // Mock successful API responses for fetching and updating prescriptions
  axios.get.mockResolvedValueOnce({ data: mockPrescriptions });
  axios.put.mockResolvedValueOnce({ data: { id: 3, ...newPrescriptionData } }); // Empty response for successful update

  render(<App />);

  // Wait for initial data fetching to complete
  await act(async () => {
    // ...
  });

  // Find the "Edit" button for the first prescription
  const editButtons = screen.getAllByText('Edit'); // Adjust selector based on your table structure

  const editButton = editButtons.find((button) => {
    const rowIndex = button.closest('tr').rowIndex;
    return mockPrescriptions[rowIndex - 1].doctor.firstName === 'Morbius' &&
           mockPrescriptions[rowIndex - 1].doctor.lastName === 'Deratto';
  });
  // Click the edit button
  fireEvent.click(editButton);

  // Wait for edit form to render
  await act(async () => {
    // ...
  });

  // Find and update form fields with new data
  const doctorFirstNameInput = screen.getByLabelText('Имя доктора:');
  const doctorLastNameInput = screen.getByLabelText('Фамилия доктора:');
  const patientFirstNameInput = screen.getByLabelText('Имя пациента:');
  const patientLastNameInput = screen.getByLabelText('Фамилия пациента:');
  const medicationNameInput = screen.getByLabelText('Название:');
  const medicationDosageInput = screen.getByLabelText('Дозировка:');
  const medicationFormInput = screen.getByLabelText('Форма:');
  const dateInput = screen.getByLabelText('Дата:');

  act(() => {
    userEvent.clear(doctorFirstNameInput);
    userEvent.clear(doctorLastNameInput);
    userEvent.clear(patientFirstNameInput);
    userEvent.clear(patientLastNameInput);
    userEvent.clear(medicationNameInput);
    userEvent.clear(medicationFormInput);
    userEvent.clear(medicationDosageInput);
    userEvent.clear(dateInput);

    userEvent.type(doctorFirstNameInput, newPrescriptionData.doctor.firstName);
    userEvent.type(doctorLastNameInput, newPrescriptionData.doctor.lastName);
    userEvent.type(patientFirstNameInput, newPrescriptionData.patient.firstName);
    userEvent.type(patientLastNameInput, newPrescriptionData.patient.lastName);
    userEvent.type(medicationNameInput, newPrescriptionData.medication.name);
    userEvent.type(medicationDosageInput, newPrescriptionData.medication.dosage);
    userEvent.type(medicationFormInput, newPrescriptionData.medication.form);
    userEvent.type(dateInput, newPrescriptionData.date);
  })

  // Submit the edit form
  const submitButton = screen.getByText('Изменить рецепт');
  fireEvent.click(submitButton);

  // Wait for data update after submission
  await act(async () => {
    // ...
  });

  // Assert that the edited prescription data is reflected in the table
  const editedRow = screen.getByText(`${newPrescriptionData.doctor.firstName} ${newPrescriptionData.doctor.lastName}`).closest('tr');

  expect(editedRow.querySelectorAll('td')[1].textContent).toContain(newPrescriptionData.patient.firstName);
  expect(editedRow.querySelectorAll('td')[1].textContent).toContain(newPrescriptionData.patient.lastName);
  expect(editedRow.querySelectorAll('td')[2].textContent).toContain(newPrescriptionData.medication.name);

  // Additional assertions based on displayed data in the edited row can be added here
});

test('deletes a prescription and removes it from the table', async () => {
  // Mock successful API responses for fetching and deleting prescriptions
  axios.get.mockResolvedValueOnce({ data: mockPrescriptions });
  axios.delete.mockResolvedValueOnce({}); // Empty response for successful deletion

  render(<App />);

  // Wait for initial data fetching to complete
  await act(async () => {
    // ...
  });

  // Find all "Delete" buttons
  const deleteButtons = screen.getAllByText('Delete');

  const deleteButton = deleteButtons.find((button) => {
    const rowIndex = button.closest('tr').rowIndex;
    return mockPrescriptions[rowIndex - 1].doctor.firstName === 'David' &&
           mockPrescriptions[rowIndex - 1].doctor.lastName === 'Jones';
  });

  // Click the delete button
  fireEvent.click(deleteButton);

  // Wait for data update after deletion
  await act(async () => {
    // ...
  });

  // Assert that the deleted prescription is no longer present in the table
  expect(screen.queryByText('David Jones')).not.toBeInTheDocument();
  expect(screen.queryByText('Smithy Junes')).not.toBeInTheDocument();

  // Additional assertion for remaining entries (optional)
  expect(screen.getAllByText('Delete').length).toBe(mockPrescriptions.length - 1); // Assuming consistent number of "Delete" buttons
});