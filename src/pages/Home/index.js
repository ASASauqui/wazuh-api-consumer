import './index.css';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from "../../hooks/useAuth";
import { listAgents, deleteAgent } from '../../services/agents';
import RippleButton from '../../components/Buttons/RippleButton';
import AgentModal from '../../components/Modals/AgentModal';

function Home() {
    const { user } = useAuth();
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Agent Actions
    const [agentAction, setAgentAction] = useState('add');
    const [selectedAgent, setSelectedAgent] = useState({});
    const [showAgentModal, setShowAgentModal] = useState(false);

    const fetchAgents = async () => {
        const response = await listAgents(user.token);
        const data = await response.json();

        if (!response.ok) {
            return;
        }

        const filteredAgents = data.data.affected_items.map((agent) => {
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
    };

    useEffect(() => {
        setLoading(true);
        fetchAgents();
        setLoading(false);
    }, []);

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
            <div className='min-h-screen bg-slate-100 p-5'>
                <div className="flex flex-col bg-white border border-gray-200 rounded-md p-5">
                    {/* Header */}
                    <div className='w-full'>
                        <div className="flex flex-col sm:flex-row justify-between">
                            {/* Title */}
                            <h1 className="text-3xl font-bold text-gray-800">All agents</h1>

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
                        <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                        </div>
                    )}

                    {/* No agents */}
                    {!loading && agents.length === 0 && (
                        <div className="flex justify-center items-center">
                            <p className="text-gray-500">No agents found</p>
                        </div>
                    )}

                    {/* Agents */}
                    {!loading && agents.length > 0 && (
                        <div className='max-h-96 overflow-auto'>
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
                                        <tr key={agent.id} className='hover:bg-gray-100 cursor-pointer' onClick={() => { console.log(agent) }}>
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
                                                    Delete
                                                </button>
                                                {/* <button className="text-primary hover:text-primary-900"
                                                    onClick={(e) => { e.stopPropagation(); console.log('Restart agent') }}>
                                                    Restart
                                                </button> */}
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
