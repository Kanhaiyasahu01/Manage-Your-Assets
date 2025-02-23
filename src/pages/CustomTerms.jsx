import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { termsEndPoints } from '../services/apis';
import { useSelector } from 'react-redux';

const CustomTerms = () => {
    const { CREATE_CUSTOM_TERM, GET_CUSTOM_TERM } = termsEndPoints;
    const [customTerms, setCustomTerms] = useState([{ name: '', description: '' }]);
    const [existingTerms, setExistingTerms] = useState([]);

    // ✅ Get token from Redux store
    const { token } = useSelector((state) => state.auth);

    // ✅ Fetch existing terms on component mount
    useEffect(() => {
        fetchExistingTerms();
    }, []);

    const fetchExistingTerms = async () => {
        try {
            const response = await axios.get(GET_CUSTOM_TERM, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data && response.data.data && response.data.data.length > 0) {
                const terms = response.data.data[0].customTerms || [];
                setExistingTerms(terms);
            }
        } catch (error) {
            console.error('Error fetching existing terms:', error);
        }
    };

    // ✅ Add new custom term
    const addCustomTerm = () => {
        setCustomTerms([...customTerms, { name: '', description: '' }]);
    };

    // ✅ Remove a custom term
    const removeCustomTerm = (index) => {
        const updatedTerms = [...customTerms];
        updatedTerms.splice(index, 1);
        setCustomTerms(updatedTerms);
    };

    // ✅ Handle input changes
    const handleCustomTermChange = (index, field, value) => {
        const updatedTerms = [...customTerms];
        updatedTerms[index][field] = value;
        setCustomTerms(updatedTerms);
    };

    // ✅ Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                CREATE_CUSTOM_TERM,
                { customTerms },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            alert('Terms saved successfully!');
            console.log(response.data);

            // ✅ Refresh existing terms after adding new ones
            fetchExistingTerms();
            setCustomTerms([{ name: '', description: '' }]); // Clear form after submit
        } catch (error) {
            console.error('Error saving terms:', error);
            alert('Failed to save terms');
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-6">Custom Terms</h2>

            {/* ✅ Display All Existing Terms in One Card */}
            {existingTerms.length > 0 && (
                <div className="mb-8 bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                    <h3 className="text-2xl font-semibold mb-4">Existing Terms</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        {existingTerms.map((term, index) => (
                            <li key={index} className="text-gray-800">
                                <strong className="text-blue-600">{term.name}:</strong> {term.description}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* ✅ Form to Add New Terms in Card Layout */}
            <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                <h3 className="text-2xl font-semibold mb-4">Add New Terms</h3>
                <form onSubmit={handleSubmit}>
                    {customTerms.map((term, index) => (
                        <div
                            key={index}
                            className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm border"
                        >
                            <div className="mb-3">
                                <label className="block text-gray-700 font-medium mb-1">
                                    Term Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Term Name"
                                    value={term.name}
                                    onChange={(e) =>
                                        handleCustomTermChange(index, 'name', e.target.value)
                                    }
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="block text-gray-700 font-medium mb-1">
                                    Term Description
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Term Description"
                                    value={term.description}
                                    onChange={(e) =>
                                        handleCustomTermChange(index, 'description', e.target.value)
                                    }
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => removeCustomTerm(index)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Remove Term
                            </button>
                        </div>
                    ))}

                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            onClick={addCustomTerm}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Add Another Term
                        </button>

                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                        >
                            Save Terms
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomTerms;
