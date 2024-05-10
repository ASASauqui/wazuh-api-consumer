import './index.css';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useAuth } from "../../hooks/useAuth";
import { listAgents } from '../../services/agents';
import { getVulnerabilities } from '../../services/vulnerability';
import RippleButton from '../../components/Buttons/RippleButton';

const colors = {
    'low': 'bg-green-100 text-green-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-red-100 text-red-800',
    'critical': 'bg-red-500 text-red-100'
};

function AllVulnerabilities() {
    const { user } = useAuth();
    const [agents, setAgents] = useState([]);
    const [vulnerabilities, setVulnerabilities] = useState([]);
    const [filteredVulnerabilities, setFilteredVulnerabilities] = useState([]);
    const [severitySummary, setSeveritySummary] = useState(null);
    const [uniqueNames, setUniqueNames] = useState([]);
    const [loading, setLoading] = useState(false);

    const { handleSubmit, handleChange, handleBlur, values } = useFormik({
        initialValues: {
            search: '',
            severity: '',
            name: ''
        },
        onSubmit: (filterValues) => {
            // Filter the current values of the vulnerabilities
            const newFilteredVulnerabilities = vulnerabilities.filter(vulnerability => {
                // Check if the search value is in the cve
                if (filterValues.search !== '' && !vulnerability.cve.toLowerCase().includes(filterValues.search.toLowerCase())) {
                    return false;
                }

                // Check if the severity value is in the severity ('' means all severities)
                if (filterValues.severity !== '' && vulnerability.severity.toLowerCase() !== filterValues.severity.toLowerCase()) {
                    return false;
                }

                // Check if the name value is the name ('' means all names)
                if (filterValues.name !== '' && !vulnerability.name.toLowerCase().includes(filterValues.name.toLowerCase())) {
                    return false;
                }

                return true;
            });

            // Set the filtered vulnerabilities
            if (newFilteredVulnerabilities.length === 0) {
                toast.error('No se encontraron vulnerabilidades con los filtros seleccionados');
                return;
            }

            setFilteredVulnerabilities(newFilteredVulnerabilities);
        }
    });

    const handleClearFilters = () => {
        setFilteredVulnerabilities(vulnerabilities);
    };

    const fetchAgents = async () => {
        const listAgentsResponse = await listAgents(user.token);
        const listAgentsData = await listAgentsResponse.json();

        if (!listAgentsResponse.ok) {
            return;
        }

        setAgents(listAgentsData.data.affected_items);
    };

    const fetchVulnerabilities = async () => {
        // Fetch vulnerabilities for each agent
        const promises = agents.map(async (agent) => {
            // Fetch vulnerabilities
            const vulnerabilitiesResponse = await getVulnerabilities(user.token, agent.id);
            const vulnerabilitiesData = await vulnerabilitiesResponse.json();

            // Check if response is ok
            if (!vulnerabilitiesResponse.ok) {
                return;
            }

            return vulnerabilitiesData;
        });

        // Wait for all promises to resolve
        const newVulnerabilities = await Promise.all(promises);

        // Filter out undefined values
        var newFilteredVulnerabilities = newVulnerabilities.filter(vulnerability => vulnerability !== undefined);

        // Take only the affected items
        newFilteredVulnerabilities = newFilteredVulnerabilities.map(vulnerability => vulnerability.data.affected_items);

        // Flatten the array
        newFilteredVulnerabilities = newFilteredVulnerabilities.flat();

        // Order by name ascending
        newFilteredVulnerabilities = newFilteredVulnerabilities.sort((a, b) => a.name.localeCompare(b.name));

        setVulnerabilities(newFilteredVulnerabilities);
        setFilteredVulnerabilities(newFilteredVulnerabilities);

        setLoading(false);
    }

    useEffect(() => {
        if (agents.length > 0) {
            fetchVulnerabilities();
        }
    }, [agents]);

    useEffect(() => {
        if (vulnerabilities.length > 0) {
            const severities = getSeverities(filteredVulnerabilities);
            const uniqueNames = getUniqueNames(filteredVulnerabilities);

            setSeveritySummary(severities);
            setUniqueNames(uniqueNames);
        }
    }, [vulnerabilities, filteredVulnerabilities]);

    const handleStartAnalysis = async () => {
        setLoading(true);
        await fetchAgents();
    };

    const getSeverities = (newVulnerabilities) => {
        const severities = newVulnerabilities.reduce((acc, vulnerability) => {
            if (vulnerability.severity.toLowerCase() === 'low') {
                acc.total += 1;
                acc.low += 1;
            } else if (vulnerability.severity.toLowerCase() === 'medium') {
                acc.total += 1;
                acc.medium += 1;
            } else if (vulnerability.severity.toLowerCase() === 'high') {
                acc.total += 1;
                acc.high += 1;
            } else if (vulnerability.severity.toLowerCase() === 'critical') {
                acc.total += 1;
                acc.critical += 1;
            }

            return acc;
        }, { low: 0, medium: 0, high: 0, critical: 0, total: 0 });

        return severities;
    };

    // Unique names y sus vulnerabilidades
    const getUniqueNames = (newVulnerabilities) => {
        const uniqueNames = newVulnerabilities.reduce((acc, vulnerability) => {
            if (!acc[vulnerability.name]) {
                acc[vulnerability.name] = [];
            }

            acc[vulnerability.name].push(vulnerability);

            return acc;
        }, {});

        return uniqueNames;
    }

    return (
        <>
            <div className='min-h-screen bg-slate-100 px-5 md:px-20 py-10'>
                <div className="flex flex-col bg-white border border-gray-200 rounded-md px-5 py-10">
                    {/* Header */}
                    <div className='w-full'>
                        <div className="flex flex-col sm:flex-row justify-between">
                            {/* Title */}
                            <h1 className="text-3xl font-bold text-gray-800">Todas las vulnerabilidades</h1>

                            {/* Start Button */}
                            <div className="flex justify-center items-center">
                                <RippleButton
                                    text="Análisis"
                                    color="bg-primary"
                                    textColor="text-white"
                                    emoji="🚀"
                                    onClick={() => { handleStartAnalysis() }}

                                />
                            </div>
                        </div>
                        <hr className="my-5" />
                    </div>


                    {/* Loading */}
                    {loading && (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                        </div>
                    )}

                    {/* Summary */}
                    {!loading && severitySummary && (
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-5">
                            <div className="flex flex-col justify-center items-center px-5 py-10">
                                <h1 className="text-2xl font-bold text-gray-800">Low</h1>
                                <p className="text-3xl font-bold text-green-600">{severitySummary.low || 0}</p>
                            </div>

                            <div className="flex flex-col justify-center items-center px-5 py-10">
                                <h1 className="text-2xl font-bold text-gray-800">Medium</h1>
                                <p className="text-3xl font-bold text-yellow-600">{severitySummary.medium || 0}</p>
                            </div>

                            <div className="flex flex-col justify-center items-center px-5 py-10">
                                <h1 className="text-2xl font-bold text-gray-800">High</h1>
                                <p className="text-3xl font-bold text-red-600">{severitySummary.high || 0}</p>
                            </div>

                            <div className="flex flex-col justify-center items-center px-5 py-10">
                                <h1 className="text-2xl font-bold text-gray-800">Critical</h1>
                                <p className="text-3xl font-bold text-red-800">{severitySummary.critical || 0}</p>
                            </div>

                            <div className="flex flex-col justify-center items-center px-5 py-10">
                                <h1 className="text-2xl font-bold text-gray-800">Total</h1>
                                <p className="text-3xl font-bold text-gray-600">{severitySummary.total || 0}</p>
                            </div>

                        </div>
                    )}

                    {/* Input Search Bar */}
                    {!loading && vulnerabilities.length > 0 && (
                        <form onSubmit={handleSubmit} className='flex flex-col mx-auto gap-10 w-full md:w-[500px] mb-10'>
                            <label
                                className="w-full mx-auto mt-8 relative bg-white min-w-sm flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-2xl gap-2 focus-within:border-gray-300"
                                htmlFor="search-bar">

                                <input
                                    id="search-bar"
                                    type='text'
                                    value={values.search}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="search"
                                    placeholder="Buscar cve..."
                                    className="px-6 py-2 w-full rounded-md flex-1 outline-none bg-white" required="" />
                                <button type="submit"
                                    className="w-full md:w-auto px-6 py-3 bg-black border-black text-white fill-white active:scale-95 duration-100 border will-change-transform overflow-hidden relative rounded-xl transition-all">
                                    <div className="flex items-center transition-all opacity-1">
                                        <span className="text-sm font-semibold whitespace-nowrap truncate mx-auto">
                                            Buscar
                                        </span>
                                    </div>
                                </button>
                            </label>

                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2 items-start">
                                    <label htmlFor="severity" className="text-sm font-semibold text-gray-600">Severidad</label>
                                    <select
                                        id="severity"
                                        name="severity"
                                        value={values.severity}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="px-3 w-full h-[45px] rounded-md border border-gray-300 focus:border-primary focus:outline-none">
                                        <option value="">Todas las severidades</option>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2 items-start">
                                    <label htmlFor="name" className="text-sm font-semibold text-gray-600">Nombre</label>
                                    <select
                                        id="name"
                                        name="name"
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="px-3 w-full h-[45px] rounded-md border border-gray-300 focus:border-primary focus:outline-none">
                                        <option value="">Todos los nombres</option>
                                        {Object.keys(uniqueNames).map((name, index) => (
                                            <option key={index} value={name}>{name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="w-full flex flex-col sm:flex-row justify-end gap-4">
                                <div className='w-full md:w-[200px]'>
                                    <RippleButton type="submit" text="Filtrar" color="bg-primary" />
                                </div>
                                <div className='w-full md:w-[200px]'>
                                    <RippleButton
                                        type="button"
                                        onClick={handleClearFilters}
                                        text="Limpiar"
                                        color="bg-black"
                                    />
                                </div>
                            </div>
                        </form>
                    )}


                    {/* Vulnerabilities */}
                    {!loading && filteredVulnerabilities.length > 0 && (
                        <div className='overflow-x-auto'>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>

                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            CVE
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Severidad
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Nombre
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Título
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Versión
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Publicado
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Estado
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Puntuación CVSS3
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {/* Rows */}
                                    {filteredVulnerabilities.map((vulnerability, index) => (
                                        <tr key={index} className='hover:bg-gray-100'>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {vulnerability.cve}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[vulnerability.severity.toLowerCase()]}`}>
                                                    {vulnerability.severity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {vulnerability.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {vulnerability.title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {vulnerability.version}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {vulnerability.published}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${vulnerability.status === 'VALID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {vulnerability.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full`}>
                                                    {vulnerability.cvss3_score}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                    }
                                </tbody>

                            </table>
                        </div>
                    )}
                </div>


            </div>
        </>
    );
}

export default AllVulnerabilities;
