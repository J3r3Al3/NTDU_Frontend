import { useState } from 'react';
import BorderGlow from '../BorderGlow/BorderGlow';

export default function FinancialAssistant({ analytics }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [mensajes, setMensajes] = useState([
    { role: 'assistant', content: '¡Hola! ¿En qué puedo ayudarte con tus finanzas hoy?' }
  ]);

  const enviarPregunta = async () => {
    if (!input.trim()) return;
    setMensajes(prev => [...prev, { role: 'user', content: input }]);
    const pregunta = input;
    setInput("");

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/financial-advisor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pregunta, contexto: analytics })
      });
      const data = await response.json();
      setMensajes(prev => [...prev, { role: 'assistant', content: data.respuesta }]);
    } catch (e) {
      setMensajes(prev => [...prev, { role: 'assistant', content: "Error de conexión." }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999999] pointer-events-auto">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-14 h-14 flex items-center justify-center bg-[#00E56A] text-black text-2xl rounded-full shadow-2xl hover:scale-110 transition-transform"
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[320px] h-[450px] bg-[#0A0B0D] rounded-3xl border border-white/10 shadow-2xl p-4 flex flex-col">
          <h3 className="text-white font-bold mb-3">Asistente Financiero</h3>
          <div className="flex-1 overflow-y-auto space-y-2 mb-3">
            {mensajes.map((m, i) => (
              <div key={i} className={`p-2 rounded-lg text-xs ${m.role === 'user' ? 'bg-[#00E56A] text-black ml-auto' : 'bg-[#1A1D23] text-white'}`}>
                {m.content}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-[#1A1D23] text-white p-2 rounded-lg text-sm outline-none"
              placeholder="Consulta..."
            />
            <button onClick={enviarPregunta} className="bg-[#00E56A] p-2 rounded-lg">Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
}