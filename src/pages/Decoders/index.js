import React, { useState } from 'react'
import { getDecoder } from '../../utils/DecoderGenerator';

const Decoders = () => {
    const [log, setLog] = useState('');
    const [decoder, setDecoder] = useState('');
    const [decoderName, setDecoderName] = useState('');


    const handleSubmit = () => {
        if (!log || !decoderName) {
            alert('Por favor, ingresa un log y un nombre de decoder');
            return;
        }
        const _decoder = getDecoder(log, decoderName);

        setDecoder(_decoder);
    }

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(decoder);
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
                        <h1 className="text-3xl font-bold text-gray-800">Decoder Generator</h1>

                        <hr className="my-5" />

                        <textarea className="w-full mt-2 h-40 p-2 border border-gray-200 rounded-md" value={log} onChange={(e) => setLog(e.target.value)} placeholder="Coloca tu log aqui"></textarea>

                        <div className='flex justify-between mt-3'>
                            <input type="text" className="w-1/2 mt-2 p-2 border border-gray-200 rounded-md" placeholder="Nombre del decoder" value={decoderName} onChange={(e) => setDecoderName(e.target.value)} />
                            <input type="button" className="w-1/4 mt-2 p-2 border border-gray-200 rounded-md bg-primary text-white" value="Generar decoder" onClick={handleSubmit} />
                        </div>

                        <hr className="my-5" />

                        <div className='flex justify-end'>
                            {decoder != "" && <input type="button" className="w-1/4 mt-2 p-2 border border-gray-200 rounded-md bg-cyan-950 text-white" value="Copiar" onClick={handleCopyToClipboard} />}
                        </div>

                        <textarea className="w-full mt-2 h-40 p-2 border border-gray-200 rounded-md" disabled value={decoder} placeholder="Decoder generado"></textarea>

                    </div>
                    
                </div>


            </div>
        </div>
        </>
  )
}

export default Decoders;