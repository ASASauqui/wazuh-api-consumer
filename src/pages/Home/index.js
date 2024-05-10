import './index.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from "../../hooks/useAuth";
import { listAgents, deleteAgent, summarizeAgentsStatus } from '../../services/agents';
import RippleButton from '../../components/Buttons/RippleButton';
import AgentModal from '../../components/Modals/AgentModal';

function Home() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [agents, setAgents] = useState([]);
    const [agentsSummaryConnection, setAgentsSummaryConnection] = useState(null);
    const [agentsSummaryConfiguration, setAgentsSummaryConfiguration] = useState(null);
    const [loading, setLoading] = useState(true);

    // Agent Actions
    const [agentAction, setAgentAction] = useState('add');
    const [selectedAgent, setSelectedAgent] = useState({});
    const [showAgentModal, setShowAgentModal] = useState(false);

    const fetchAgents = async () => {
        const listAgentsResponse = await listAgents(user.token);
        const listAgentsData = await listAgentsResponse.json();

        const summaryResponse = await summarizeAgentsStatus(user.token);
        const summaryData = await summaryResponse.json();

        if (!listAgentsResponse.ok || !summaryResponse.ok) {
            setLoading(false);
            return;
        }

        if (listAgentsData.data === undefined || summaryData.data === undefined) {
            setLoading(false);
            return;
        }

        const filteredAgents = listAgentsData.data.affected_items.map((agent) => {
            var osName = "unknown";

            if (agent.os !== undefined && agent.os.name !== undefined) {
                osName = agent.os.name;
            }

            return ({
                id: agent.id,
                name: agent.name,
                os: {
                    name: osName
                },
                status: agent.status
            })
        });

        setAgents(filteredAgents);
        setAgentsSummaryConnection(summaryData.data.connection);
        setAgentsSummaryConfiguration(summaryData.data.configuration);

        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
        fetchAgents();
    }, []);

    const handleAgentClick = (id) => {
        navigate(`/agent/${id}`);
    };

    const handleDeleteAgent = async (agent) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este agente?')) {
            const response = await deleteAgent({ agents_list: [agent.id], status: 'all' }, user.token);
            const data = await response.json();

            if (!response.ok) {
                toast.error("Error al eliminar el agente");
                return;
            }

            toast.success("Agente eliminado correctamente");
        }
    };

    return (
        <>
            <div className='min-h-screen bg-slate-100 px-5 md:px-20 py-10'>
                <div className="flex flex-col bg-white border border-gray-200 rounded-md px-5 py-10">
                    {/* Header */}
                    <div className='w-full'>
                        <div className="flex flex-col sm:flex-row justify-between">
                            {/* Title */}
                            <h1 className="text-3xl font-bold text-gray-800">Todos los agentes</h1>

                            {/* Add agent */}
                            <div className="flex justify-center items-center">
                                <RippleButton
                                    text="Add agent"
                                    color="bg-primary"
                                    textColor="text-white"
                                    emoji="➕"
                                    onClick={() => { setShowAgentModal(true) }}

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

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 my-5'>
                        {/* Summary connection */}
                        {!loading && agentsSummaryConnection && (
                            <div className='flex flex-col border border-gray-200 rounded-md p-5 gap-5'>
                                <h2 className="text-lg font-bold text-gray-800">Resumen de conexión</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 text-center">
                                    <div className="flex flex-col justify-center items-center px-5">
                                        <h2 className="text-sm font-bold text-gray-800">Activo</h2>
                                        <p className="text-xl font-bold text-green-600">{agentsSummaryConnection.active || 0}</p>
                                    </div>

                                    <div className="flex flex-col justify-center items-center px-5">
                                        <h2 className="text-sm font-bold text-gray-800">Desconectado</h2>
                                        <p className="text-xl font-bold text-red-600">{agentsSummaryConnection.disconnected || 0}</p>
                                    </div>

                                    <div className="flex flex-col justify-center items-center px-5">
                                        <h2 className="text-sm font-bold text-gray-800">Nunca conectado</h2>
                                        <p className="text-xl font-bold text-purple-600">{agentsSummaryConnection.never_connected || 0}</p>
                                    </div>

                                    <div className="flex flex-col justify-center items-center px-5">
                                        <h2 className="text-sm font-bold text-gray-800">Pendiente</h2>
                                        <p className="text-xl font-bold text-blue-600">{agentsSummaryConnection.pending || 0}</p>
                                    </div>

                                    <div className="flex flex-col justify-center items-center px-5">
                                        <h2 className="text-sm font-bold text-gray-800">Total</h2>
                                        <p className="text-xl font-bold text-gray-600">{agentsSummaryConnection.total || 0}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Summary configuration */}
                        {!loading && agentsSummaryConfiguration && (
                            <div className='flex flex-col border border-gray-200 rounded-md p-5 gap-5'>
                                <h2 className="text-lg font-bold text-gray-800">Resumen de configuración</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 text-center">
                                    <div className="flex flex-col justify-center items-center px-5">
                                        <h2 className="text-sm font-bold text-gray-800">Sincronizado</h2>
                                        <p className="text-xl font-bold text-green-600">{agentsSummaryConfiguration.synced || 0}</p>
                                    </div>

                                    <div className="flex flex-col justify-center items-center px-5">
                                        <h2 className="text-sm font-bold text-gray-800">No sincronizado</h2>
                                        <p className="text-xl font-bold text-red-600">{agentsSummaryConfiguration.not_synced || 0}</p>
                                    </div>

                                    <div className="flex flex-col justify-center items-center px-5">
                                        <h2 className="text-sm font-bold text-gray-800">Total</h2>
                                        <p className="text-xl font-bold text-gray-600">{agentsSummaryConfiguration.total || 0}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* No agents */}
                    {!loading && agents.length === 0 && (
                        <div className="flex justify-center items-center">
                            <p className="text-gray-500">No se encontraron agentes</p>
                        </div>
                    )}

                    {/* Agents */}
                    {!loading && agents.length > 0 && (
                        <div className='overflow-auto'>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            ID
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Nombre de Agente
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Sistema Operativo
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Estatus
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {/* Rows */}
                                    {agents.map((agent) => (
                                        <tr key={agent.id} className='hover:bg-gray-100 cursor-pointer' onClick={() => handleAgentClick(agent.id)}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {agent.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {agent.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {agent.os.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${agent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {agent.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-2">
                                                <button className="text-red-600 hover:text-red-900"
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteAgent(agent) }}>
                                                    Borrar
                                                </button>
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
            {/* Agent Modal */}
            {showAgentModal && (
                <AgentModal action='add' agent={selectedAgent} setShowAgentModal={setShowAgentModal} />
            )}
        </>
    );
}

export default Home;
