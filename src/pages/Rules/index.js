import React, { useEffect, useState } from 'react'
import { getRule } from '../../utils/DecoderGenerator';

const Rules = () => {
    const [decoder, setDecoder] = useState('');
    const [rule, setRule] = useState('');
    const [ruleId, setRuleId] = useState('');
    const [level, setLevel] = useState('');
    const [description, setDescription] = useState('');
    const [variables, setVariable] = useState({});

    useEffect(() => {
        getVariables();
    }, [decoder])

    const getVariables = () => {
        if (!decoder) return;
        const _variables = decoder.match(/(?<=<order>)(.*?)(?=<\/order>)/g)[0].split(', ');
        
        let _variablesObj = {};
        _variables.forEach(variable => {
            _variablesObj[variable] = '';
        });
        setVariable(_variablesObj);
    }

    const handleSubmit = () => {
        if (!decoder || !ruleId || !level || !description) {
            alert('Por favor, ingresa todos los campos');
            return;
        }

        const _rule = getRule(decoder, ruleId, level, description, variables);

        setRule(_rule);

    }

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(rule);
        alert('Decoder copiado al portapapeles');
    }


  return (
    <>
        <div className='min-h-screen bg-slate-100 p-5'>
            <div className="flex flex-col bg-white border border-gray-200 rounded-md p-5">
                {/* Header */}
                <div className='w-full'>
                    <div className="flex flex-col sm:flex-col justify-between">
                        {/* Title */}
                        <h1 className="text-3xl font-bold text-gray-800">Rule Generator</h1>

                        <hr className="my-5" />

                        <textarea className="w-full mt-2 h-40 p-2 border border-gray-200 rounded-md" value={decoder} onChange={(e) => setDecoder(e.target.value)} placeholder="Coloca tu decoder aqui"></textarea>

                        <div className='flex flex-col mt-3'>
                            <input type="text" className="w-1/4 mt-2 p-2 border border-gray-200 rounded-md" placeholder="ID de la regla" value={ruleId} onChange={(e) => setRuleId(e.target.value)} />
                            <input type="text" className="w-1/4 mt-2 p-2 border border-gray-200 rounded-md" placeholder="Nivel" value={level} onChange={(e) => setLevel(e.target.value)} />

                            <h3 className='text-lg font-bold mt-5'>Variables</h3>

                            <hr className="my-5" />

                            <div className='flex flex-col w-full items-start'>
                                {
                                    Object.keys(variables).map((variable, index) => (
                                        <div className='flex items-center w-1/2' key={index}>
                                            <span className='w-1/4'>{variable}</span>
                                            <input type="text" className="w-1/2 mt-2 mx-2 p-2 border border-gray-200 rounded-md" placeholder="Valor" value={variables[variable]} onChange={(e) => setVariable({ ...variables, [variable]: e.target.value })} />
                                        </div>
                                    ))
                                }
                            </div>

                            <input type="text" className="w-3/4 mt-5 p-2 border border-gray-200 rounded-md" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />

                        </div>

                        <input type="button" className="w-1/4 mt-3 p-2 border border-gray-200 rounded-md bg-primary text-white" value="Generar regla" onClick={handleSubmit} />

                        <hr className="my-5" />

                        <div className='flex justify-end'>
                            {decoder != "" && <input type="button" className="w-1/4 mt-2 p-2 border border-gray-200 rounded-md bg-cyan-950 text-white" value="Copiar" onClick={handleCopyToClipboard} />}
                        </div>

                        <textarea className="w-full mt-2 h-40 p-2 border border-gray-200 rounded-md" disabled value={rule} placeholder="Decoder generado"></textarea>

                    </div>
                    
                </div>


            </div>
        </div>
        </>
  )
}

export default Rules;