import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; // Include your CSS file

const App = () => {
    // State variables for prescriptions, error messages, and form data
    const [prescriptions, setPrescriptions] = useState([]);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [doctorFirstName, setDoctorFirstName] = useState('');
    const [doctorLastName, setDoctorLastName] = useState('');
    const [patientFirstName, setPatientFirstName] = useState('');
    const [patientLastName, setPatientLastName] = useState('');
    const [medicationName, setMedicationName] = useState('');
    const [medicationDosage, setMedicationDosage] = useState('');
    const [medicationForm, setMedicationForm] = useState('');
    const [date, setDate] = useState('');
    const [editingMode, setEditingMode] = useState(false);
    const [editedPrescriptionId, setEditedPrescriptionId] = useState(0);

    // Fetch prescriptions on component mount
    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/prescriptions');
                setPrescriptions(response.data);
            } catch (error) {
                setErrorMessage('Ошибка при получении рецептов!');
            }
        };

        fetchPrescriptions();
    }, []);

    const handleEdit = (prescriptionId) => {
        const prescription = prescriptions.find(p => p.id === prescriptionId);
        if (prescription) {
            setEditingMode(true);
            setEditedPrescriptionId(prescriptionId);
            setSelectedPrescription(prescription); // Set selected prescription for editing
            setDoctorFirstName(prescription.doctor.firstName);
            setDoctorLastName(prescription.doctor.lastName);
            setPatientFirstName(prescription.patient.firstName);
            setPatientLastName(prescription.patient.lastName);
            setMedicationName(prescription.medication.name);
            setMedicationDosage(prescription.medication.dosage);
            setMedicationForm(prescription.medication.form);
            setDate(prescription.date.split('T')[0]);
        } else {
            setErrorMessage('Рецепт не найден!'); // Handle case where prescription is not found
        }
    };

    // Delete a prescription using its ID
    const handleDelete = async (prescriptionId) => {
        try {
            await axios.delete(`http://localhost:8080/api/prescriptions/${prescriptionId}`);
            setPrescriptions(prescriptions.filter(p => p.id !== prescriptionId)); // Update local state
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Ошибка при удалении рецепта!');
        }
    };

    // Form validation function
    const validateForm = () => {
        let isValid = true;
        setErrorMessage(''); // Clear any previous error message

        // Check required fields and display specific error messages
        if (!doctorFirstName.trim()) {
            setErrorMessage('Имя доктора не может быть пустым!');
            isValid = false;
        }

        if (!doctorLastName.trim()) {
            setErrorMessage('Фамилия доктора не может быть пустым!');
            isValid = false;
        }

        if (!patientFirstName.trim()) {
            setErrorMessage('Имя пациента не может быть пустым!');
            isValid = false;
        }

        if (!patientLastName.trim()) {
            setErrorMessage('Фамилия пациента не может быть пустым!');
            isValid = false;
        }

        if (!medicationName.trim()) {
            setErrorMessage('Название лекарства не может быть пустым!');
            isValid = false;
        }

        if (!medicationDosage.trim()) {
            setErrorMessage('Дозировка лекарства не может быть пустой!');
            isValid = false;
        }

        if (!medicationForm.trim()) {
            setErrorMessage('Форма лекарства не может быть пустой!');
            isValid = false;
        }

        // Additional validation checks can be added here, like date format

        return isValid;
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return; // Don't submit if validation fails
        }

        const prescription = {
            doctor: {
                firstName: doctorFirstName,
                lastName: doctorLastName
            },
            patient: {
                firstName: patientFirstName,
                lastName: patientLastName
            },
            medication: {
                name: medicationName,
                dosage: medicationDosage,
                form: medicationForm
            },
            date
        };

        try {
            let response;
            if (editingMode) {
                response = await axios.put(`http://localhost:8080/api/prescriptions/${editedPrescriptionId}`, prescription);
                setEditingMode(false);
                setEditedPrescriptionId(0);
            } else {
                response = await axios.post(`http://localhost:8080/api/prescriptions`, prescription);
                prescriptions.push(response.data);
            }
            const updatedPrescriptions = prescriptions.map(p => p.id === response.data.id ? response.data : p); // Update prescriptions list
            setPrescriptions(updatedPrescriptions);
            setSelectedPrescription(null); // Clear selected prescription after successful update
            setErrorMessage(''); // Clear error message

            // Clear form fields after successful update
            setDoctorFirstName('');
            setDoctorLastName('');
            setPatientFirstName('');
            setPatientLastName('');
            setMedicationName('');
            setMedicationDosage('');
            setMedicationForm('');
            setDate('');
        } catch (error) {
            console.debug(error);
            setErrorMessage('Ошибка при добавлении рецепта!');
        }
    };

    // ... existing code

    // Render prescriptions table
    return (
        <div className="app">
            <h1>Рецепты</h1>
            {errorMessage && <div className="error">{errorMessage}</div>}
            {prescriptions.length > 0 ? (
                <table>
                    <thead>
                    <tr>
                        <th>ФИО доктора</th>
                        <th>ФИО пациента</th>
                        <th>Лекарство</th>
                        <th>Дозировка</th>
                        <th>Форма</th>
                        <th>Дата</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {prescriptions.map((prescription) => (
                        <tr key={prescription.id}>
                            <td>{`${prescription.doctor.firstName} ${prescription.doctor.lastName}`}</td>
                            <td>{`${prescription.patient.firstName} ${prescription.patient.lastName}`}</td>
                            <td>{prescription.medication.name}</td>
                            <td>{prescription.medication.dosage}</td>
                            <td>{prescription.medication.form}</td>
                            <td>{prescription.date}</td>
                            <td>
                                <button onClick={() => handleEdit(prescription.id)}>Edit</button>
                                <button onClick={() => handleDelete(prescription.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>Нет рецептов для отображения.</p>
            )}

            {/* Form for creating a new prescription */}
            <h2>Добавить рецепт</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="doctorFirstName">Имя доктора:</label>
                    <input
                        type="text"
                        id="doctorFirstName"
                        name="doctorFirstName"
                        value={doctorFirstName}
                        onChange={(event) => setDoctorFirstName(event.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="doctorLastName">Фамилия доктора:</label>
                    <input
                        type="text"
                        id="doctorLastName"
                        name="doctorLastName"
                        value={doctorLastName}
                        onChange={(event) => setDoctorLastName(event.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="patientFirstName">Имя пациента:</label>
                    <input
                        type="text"
                        id="patientFirstName"
                        name="patientFirstName"
                        value={patientFirstName}
                        onChange={(event) => setPatientFirstName(event.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="patientLastName">Фамилия пациента:</label>
                    <input
                        type="text"
                        id="patientLastName"
                        name="patientLastName"
                        value={patientLastName}
                        onChange={(event) => setPatientLastName(event.target.value)}
                    />
                </div>
                <div className="form-group">
                    <h2>Лекарство</h2>
                    <label htmlFor="medicationName">Название:</label>
                    <input
                        type="text"
                        id="medicationName"
                        name="medicationName"
                        value={medicationName}
                        onChange={(event) => setMedicationName(event.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="medicationDosage">Дозировка:</label>
                    <input
                        type="text"
                        id="medicationDosage"
                        name="medicationDosage"
                        value={medicationDosage}
                        onChange={(event) => setMedicationDosage(event.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="medicationForm">Форма:</label>
                    <input
                        type="text"
                        id="medicationForm"
                        name="medicationForm"
                        value={medicationForm}
                        onChange={(event) => setMedicationForm(event.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="date">Дата:</label>
                    <input type="date" id="date" name="date" value={date} onChange={(event)=> setDate(event.target.value)} />
                </div>
                {
                    editingMode ? <button type="submit">Изменить рецепт</button>
                                : <button type="submit">Создать рецепт</button>
                }
            </form>
        </div>
    );
};

export default App;