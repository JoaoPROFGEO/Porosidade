import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Simulator from './Simulator';

type RockType = 'solid' | 'isolated' | 'permeable';

export default function PorosityPermeability() {
  const [activeType, setActiveType] = useState<RockType>('solid');

  const content = {
    solid: {
      title: 'Rocha Não Porosa e Não Permeável',
      description: 'A rocha é maciça. Não tem espaço para guardar água, logo, a água não entra nem circula.',
      visual: 'As pedras castanhas encaixam perfeitamente umas nas outras, quase como um puzzle. Não há espaços azuis ou brancos entre elas.',
      badge: 'Maciça',
    },
    isolated: {
      title: 'Rocha Porosa, Mas Não Permeável',
      description: 'A rocha tem buracos (porosidade) e pode até ter água lá dentro, mas como os buracos não comunicam entre si, a água está presa. Não flui. É como plástico bolha.',
      visual: 'Existem espaços azuis entre as pedras castanhas, mas esses espaços estão "presos" ou isolados. Não formam um caminho contínuo.',
      badge: 'Poros Isolados',
    },
    permeable: {
      title: 'Rocha Porosa e Permeável',
      description: 'Este é o cenário ideal para um aquífero. A rocha tem buracos (poros) e eles estão ligados (intercomunicáveis). A água pode entrar, ser armazenada e circular.',
      visual: 'O azul forma "rios" ou caminhos contínuos que atravessam as pedras de um lado ao outro. Os espaços tocam-se todos.',
      badge: 'Ideal para Aquífero',
      isIdeal: true,
    },
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
          Porosidade vs Permeabilidade
        </h2>
        <p className="text-lg text-slate-600">
          Para termos um bom aquífero, não basta que a rocha tenha buracos (porosidade) para guardar água; é preciso que esses buracos estejam ligados (permeabilidade) para a água poder fluir e ser extraída.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Controls and Explanation - Left Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
            {(['solid', 'isolated', 'permeable'] as RockType[]).map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`relative px-4 py-3 rounded-xl text-left transition-all ${
                  activeType === type
                    ? 'bg-blue-50 text-blue-900'
                    : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                }`}
              >
                {activeType === type && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl"
                  />
                )}
                <div className="font-semibold text-base mb-0.5">{content[type].title}</div>
                <div className="text-sm opacity-80">{content[type].badge}</div>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeType}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`p-6 rounded-2xl border shadow-sm ${
                content[activeType].isIdeal 
                  ? 'bg-green-50 border-green-200 text-green-900' 
                  : 'bg-white border-slate-200'
              }`}
            >
              <h3 className="font-bold text-lg mb-3 flex items-center justify-between">
                <span>Significado</span>
                {content[activeType].isIdeal && (
                  <span className="text-xs uppercase tracking-wide font-bold bg-green-200 text-green-800 px-2 py-1 rounded-full">
                    AQUÍFERO PRODUTIVO
                  </span>
                )}
              </h3>
              <p className="mb-6 opacity-90 leading-relaxed">
                {content[activeType].description}
              </p>
              
              <h3 className="font-bold text-sm uppercase tracking-wider mb-2 opacity-70">
                O que observar no simulador:
              </h3>
              <p className="text-sm opacity-90 leading-relaxed bg-black/5 p-3 rounded-lg">
                {content[activeType].visual}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Simulator - Right Column */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
           {/* Simulator Header */}
           <div className="px-6 auto py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
             <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
               Simulador Visual
             </div>
           </div>
           {/* Simulator Canvas area */}
           <div className="bg-slate-100 p-8 flex justify-center items-center min-h-[500px]">
              <Simulator rockType={activeType} />
           </div>
        </div>
      </div>
    </div>
  );
}
