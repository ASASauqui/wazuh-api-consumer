import './index.css';

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getVulnerabilities, getAgentVulnerabilitiesFieldSummary } from '../../services/vulnerability';

const colors = {
    'low': 'bg-green-100 text-green-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-red-100 text-red-800',
    'critical': 'bg-red-500 text-red-100'
};

function Agent() {
    const { id } = useParams();
    const { user } = useAuth();
    const [vulnerabilities, setVulnerabilities] = useState([]);
    const [severitySummary, setSeveritySummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        const fetchVulnerabilities = async () => {
            const vulnerabilitiesResponse = await getVulnerabilities(user.token, id);
            const vulnerabilitiesData = await vulnerabilitiesResponse.json();

            const summaryResponse = await getAgentVulnerabilitiesFieldSummary(user.token, id, 'severity');
            const summaryData = await summaryResponse.json();

            if (vulnerabilitiesData.data === undefined || summaryData.data === undefined) {
                setLoading(false);
                return;
            }

            setVulnerabilities(vulnerabilitiesData.data.affected_items);
            setSeveritySummary(summaryData.data.severity);

            setLoading(false);
        };

        fetchVulnerabilities();
    }, [id]);


    return (
        <>
            <div className='min-h-screen flex flex-col bg-slate-100 px-5 md:px-20 py-10 gap-5'>
                <div className="flex flex-col bg-white border border-gray-200 rounded-md px-5 py-10">
                    {/* Header */}
                    <div className='w-full'>
                        <div className="flex flex-col sm:flex-row justify-between">
                            {/* Title */}
                            <h1 className="text-3xl font-bold text-gray-800">All vulnerabilities for agent {id}</h1>
                        </div>
                        <hr className="my-5" />
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                        </div>
                    )}

                    {/* Summary */}
                    {!loading && severitySummary && (
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-5">
                            <div className="flex flex-col justify-center items-center px-5 py-10">
                                <h1 className="text-2xl font-bold text-gray-800">Low</h1>
                                <p className="text-3xl font-bold text-green-600">{severitySummary.Low || 0}</p>
                            </div>

                            <div className="flex flex-col justify-center items-center px-5 py-10">
                                <h1 className="text-2xl font-bold text-gray-800">Medium</h1>
                                <p className="text-3xl font-bold text-yellow-600">{severitySummary.Medium || 0}</p>
                            </div>

                            <div className="flex flex-col justify-center items-center px-5 py-10">
                                <h1 className="text-2xl font-bold text-gray-800">High</h1>
                                <p className="text-3xl font-bold text-red-600">{severitySummary.High || 0}</p>
                            </div>

                            <div className="flex flex-col justify-center items-center px-5 py-10">
                                <h1 className="text-2xl font-bold text-gray-800">Critical</h1>
                                <p className="text-3xl font-bold text-red-800">{severitySummary.Critical || 0}</p>
                            </div>

                            <div className="flex flex-col justify-center items-center px-5 py-10">
                                <h1 className="text-2xl font-bold text-gray-800">Total</h1>
                                <p className="text-3xl font-bold text-gray-600">{vulnerabilities.length || 0}</p>
                            </div>

                        </div>
                    )}

                    {/* No vulnerabilities */}
                    {!loading && vulnerabilities.length === 0 && (
                        <div className="flex justify-center items-center">
                            <p className="text-gray-500">No vulnerabilidades encontradas</p>
                        </div>
                    )}

                    {/* Vulnerabilities */}
                    {!loading && vulnerabilities.length > 0 && (
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
                                    {vulnerabilities.map((vulnerability, index) => (
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

export default Agent;
