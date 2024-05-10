import './index.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from "../../hooks/useAuth";
import { listUsers, deleteUsers } from '../../services/security';
import RippleButton from '../../components/Buttons/RippleButton';
import UserModal from '../../components/Modals/UserModal';

function Users() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // User Actions
    const [userAction, setUserction] = useState('add');
    const [selectedUser, setSelectedUser] = useState({});
    const [showUserModal, setShowUserModal] = useState(false);

    const fetchUsers = async () => {
        const response = await listUsers(user.token);
        const data = await response.json();

        if (!response.ok) {
            return;
        }

        setUsers(data.data.affected_items);
    };

    useEffect(() => {
        setLoading(true);
        fetchUsers();
        setLoading(false);
    }, []);

    const handleUserClick = (id) => {
        navigate(`/user/${id}`);
    };

    const handleDeleteUser = async (userObject) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            const response = await deleteUsers({ user_ids: [userObject.id] }, user.token);
            const data = await response.json();

            if (!response.ok) {
                toast.error("Error al eliminar el usuario");
                return;
            }

            toast.success("Usuario eliminado correctamente");
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
                            <h1 className="text-3xl font-bold text-gray-800">Todos los usuarios</h1>

                            {/* Add user */}
                            <div className="flex justify-center items-center">
                                <RippleButton
                                    text="Add user"
                                    color="bg-primary"
                                    textColor="text-white"
                                    emoji="➕"
                                    onClick={() => { setShowUserModal(true) }}

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

                    {/* No users */}
                    {!loading && users.length === 0 && (
                        <div className="flex justify-center items-center">
                            <p className="text-gray-500">No se encontraron usuarios</p>
                        </div>
                    )}

                    {/* Users */}
                    {!loading && users.length > 0 && (
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
                                            Nombre de Usuario
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Permitir ejecutar como
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Roles
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
                                    {users.map((user) => (
                                        <tr key={user.id} className='hover:bg-gray-100 cursor-pointer'>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.username}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.allow_run_as ? 'Sí' : 'No'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.roles.length}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-2">
                                                <button className="text-red-600 hover:text-red-900"
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteUser(user) }}>
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
            {/* User Modal */}
            {showUserModal && (
                <UserModal action='add' user={selectedUser} setShowUserModal={setShowUserModal} />
            )}
        </>
    );
}

export default Users;
