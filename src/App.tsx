/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import PorosityPermeability from './components/PorosityPermeability';
import TypesOfAquifers from './components/TypesOfAquifers';
import { Droplets, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulation' | 'types'>('simulation');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">
              Simulador de Aquíferos
            </h1>
          </div>
          
          {/* Main Navigation */}
          <nav className="flex gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'simulation'
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Droplets className="w-4 h-4" />
              Porosidade vs Permeabilidade
            </button>
            <button
              onClick={() => setActiveTab('types')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'types'
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              Tipos de Aquíferos
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {activeTab === 'simulation' ? <PorosityPermeability /> : <TypesOfAquifers />}
      </main>
    </div>
  );
}
