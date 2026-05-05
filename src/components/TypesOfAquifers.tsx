import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplet, Layers, Mountain, Wind } from 'lucide-react';
import AquiferSimulator from './AquiferSimulator';

type AquiferType = 'porosos' | 'fraturados' | 'carsicos';

export default function TypesOfAquifers() {
  const [activeType, setActiveType] = useState<AquiferType>('porosos');

  const types = {
    porosos: {
      id: 'porosos',
      title: 'Aquíferos Porosos',
      mechanism: 'A água circula pelos pequenos espaços entre os grãos da rocha.',
      rockType: 'Areias, arenitos, cascalho.',
      visualization: 'Imagina um balde cheio de areia da praia. Se deitares água, ela infiltra-se facilmente por entre os grãozinhos.',
      quality: 'Muito bons aquíferos',
      icon: Layers,
      color: 'bg-amber-50 border-amber-200 text-amber-900 shadow-amber-100',
      activeTab: 'bg-amber-100 text-amber-900 border-amber-300',
      iconBg: 'bg-amber-200 text-amber-700',
    },
    fraturados: {
      id: 'fraturados',
      title: 'Aquíferos Fraturados e/ou Fissurados',
      mechanism: 'A rocha em si é dura e maciça, mas sofreu forças tectónicas e rachou. A água só circula nessas rachaduras.',
      rockType: 'Granitos e xistos.',
      visualization: 'Imagina um bloco de betão sólido que caiu e ficou cheio de rachas. A água só entra nas rachas, o bloco em si não absorve nada.',
      quality: 'Aquíferos mais fracos (menor disponibilidade)',
      icon: Mountain,
      color: 'bg-slate-100 border-slate-300 text-slate-800 shadow-slate-200',
      activeTab: 'bg-slate-200 text-slate-900 border-slate-400',
      iconBg: 'bg-slate-300 text-slate-700',
    },
    carsicos: {
      id: 'carsicos',
      title: 'Aquíferos Cársicos',
      mechanism: 'A rocha dissolve-se com a água da chuva ao longo de milhares de anos, criando túneis, grutas e canais subterrâneos.',
      rockType: 'Calcários.',
      visualization: 'Imagina um queijo suíço cheio de buracos gigantes. Costumam desenhar-se montanhas com grandes grutas e rios subterrâneos inteiros lá dentro.',
      quality: 'Extremamente produtivos e rápidos',
      icon: Wind,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-emerald-100',
      activeTab: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      iconBg: 'bg-emerald-200 text-emerald-700',
    }
  };

  const activeData = types[activeType];
  const Icon = activeData.icon;

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
          Os 3 Tipos de Aquíferos
        </h2>
        <p className="text-lg text-slate-600">
          Esta secção classifica os aquíferos com base no tipo de rocha. Podes usar o simulador em baixo para visualizar como a água se comporta em cada um deles.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Controls and Explanation - Left Column */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            {(['porosos', 'fraturados', 'carsicos'] as AquiferType[]).map((type) => {
              const data = types[type];
              const isActive = activeType === type;
              const TypeIcon = data.icon;
              
              return (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left ${
                    isActive 
                      ? data.activeTab
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl transition-colors ${isActive ? data.iconBg : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                    <TypeIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${isActive ? '' : 'text-slate-800'}`}>
                      {data.title}
                    </h3>
                    <p className={`text-sm opacity-80 ${isActive ? 'font-medium' : ''}`}>
                      {data.quality}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeType}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className={`p-6 rounded-3xl border shadow-sm ${activeData.color}`}
            >
              <div className="space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-70 block mb-1.5 flex items-center gap-1.5">
                    Como funciona
                  </span>
                  <p className="text-base font-medium leading-relaxed opacity-90">{activeData.mechanism}</p>
                </div>

                <div className="h-px w-full bg-black/5 rounded-full" />

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-70 block mb-1.5 flex items-center gap-1.5">
                    Rocha Típica
                  </span>
                  <p className="text-base font-semibold opacity-90">{activeData.rockType}</p>
                </div>

                <div className="bg-white/40 rounded-2xl p-4 mt-2 border border-white/40 shadow-inner">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80 block mb-2 flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5" />
                    Imagem Mental
                  </span>
                  <p className="text-sm italic leading-relaxed opacity-90">{activeData.visualization}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Simulator - Right Column */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
           <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
             <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Icon className="w-4 h-4" />
                Simulador Visual - {activeData.title}
             </div>
           </div>
           <div className="bg-slate-100 p-8 flex justify-center items-center h-[500px]">
              <AquiferSimulator aquiferType={activeType} />
           </div>
        </div>
      </div>
    </div>
  );
}
