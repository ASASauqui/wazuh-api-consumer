import React from 'react';
import './index.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import CustomInput from '../../CustomInput';
import { useAuth } from '../../../hooks/useAuth';
import { addAgent } from '../../../services/agents';

const AgentModal = ({ action, agent, setShowAgentModal }) => {
    const { user } = useAuth();
    const actionTitle = action === 'add' ? 'Add' : 'Edit';

    const { handleSubmit, handleChange, handleBlur, values, touched, errors, } = useFormik({
        initialValues: {
            name: '',
            ip: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Requerido'),
            ip: Yup.string().matches(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, 'Dirección IP inválida')
        }),
        onSubmit: async (values) => {
            if (action === 'add') {
                const response = await addAgent(values, user.token);
                const data = await response.json();

                if (!response.ok) {
                    toast.error("Error al agregar el agente");
                    return;
                }

                setShowAgentModal(false);
                toast.success("Agente agregado correctamente");
            }
        }
    });

    const handleCloseModal = () => {
        setShowAgentModal(false);
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleCloseModal}>
                <div className="bg-white w-1/2 p-10 rounded-lg" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end">
                        <button className="text-gray-500 hover:text-gray-700" onClick={handleCloseModal}>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">{actionTitle} agent</h1>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-10 bg-white mt-10'>
                        <CustomInput label="Nombre" type="text" id="name" name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} touched={touched} errors={errors} autoComplete="off" placeholder="Nombre" />

                        <CustomInput label="IP" type="text" id="ip" name="ip" value={values.ip} onChange={handleChange} onBlur={handleBlur} touched={touched} errors={errors} autoComplete="off" placeholder="IP" />

                        <div className="mb-6">
                            <button type="submit" className="bg-primary relative mx-auto min-w-[150px] w-full h-[50px] flex justify-center bg-gradient-to-br items-center rounded-[5px] cursor-pointer overflow-hidden transition duration-300 ease-out">
                                <div className="text-center text-[0.8rem] sm:text-[1rem] font-semibold mr-1 text-white">Save</div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AgentModal;
