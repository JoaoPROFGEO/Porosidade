import React, { useState } from 'react';
import { CheckCircle2, XCircle, ChevronRight, HelpCircle, RotateCcw } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

const quizData: Question[] = [
  {
    id: 1,
    question: "Onde se verificam as maiores disponibilidades hídricas em Portugal?",
    options: [
      "No Maciço Antigo, onde predominam granitos e xistos.",
      "Nas bacias sedimentares do Tejo e do Sado, onde predominam rochas sedimentares detríticas.",
      "Nas zonas montanhosas, devido à elevada precipitação.",
      "Em todas as regiões do país de forma igual."
    ],
    correctAnswerIndex: 1,
    explanation: "As maiores disponibilidades hídricas verificam-se nas áreas onde as formações rochosas são mais permeáveis e porosas, ou seja, nas bacias sedimentares do Tejo e do Sado."
  },
  {
    id: 2,
    question: "Por que motivo as disponibilidades hídricas são menores no Maciço Antigo?",
    options: [
      "Porque chove menos nessa região.",
      "Porque as rochas (xistos e granitos) são muito porosas mas não absorvem água.",
      "Porque as rochas (xistos e granitos) são pouco permeáveis, formando aquíferos reduzidos, fissurados e pouco produtivos.",
      "Porque a água escoa toda para o oceano imediatamente devido à inclinação."
    ],
    correctAnswerIndex: 2,
    explanation: "As disponibilidades hídricas são menores no Maciço Antigo porque as rochas (xistos e granitos) são pouco permeáveis. Formam aquíferos fissurados/fraturados, que são mais reduzidos e pouco produtivos."
  },
  {
    id: 3,
    question: "Num aquífero do tipo Cárstico (formado por calcário), como se caracteriza o fluxo da água subterrânea?",
    options: [
      "Escorre muito lentamente por entre os pequenos grãos da rocha.",
      "Não há circulação de água pois o calcário é impermeável.",
      "Flui rapidamente através de grandes condutas, grutas e algares desorganizados, alargados pela dissolução da rocha.",
      "A água fica retida à superfície formando apenas lagos."
    ],
    correctAnswerIndex: 2,
    explanation: "Nos aquíferos cársticos, a água dissolve a rocha ao longo do tempo, alargando as pequenas fraturas e originando condutas irregulares, grutas onde flui com grande facilidade e rapidez."
  },
  {
    id: 4,
    question: "O que distingue a permeabilidade da porosidade?",
    options: [
      "Porosidade é a capacidade de reter água; permeabilidade é o espaço vazio na rocha.",
      "Porosidade é o volume de vazios na rocha; permeabilidade é a capacidade dos poros estarem interligados, permitindo o fluxo da água.",
      "São exatamente o mesmo conceito.",
      "A porosidade apenas se aplica a areias, enquanto a permeabilidade se aplica a rochas duras."
    ],
    correctAnswerIndex: 1,
    explanation: "A porosidade refere-se à quantidade de espaços vazios na rocha. A permeabilidade é o que permite à água mover-se entre esses espaços (exige que os poros estejam conectados)."
  },
  {
    id: 5,
    question: "Num aquífero poroso (ex: areia limpa), como se comporta a água?",
    options: [
      "Desce rapidamente através de poros interligados, permitindo um excelente armazenamento e fluxo.",
      "Fica retida em fraturas isoladas que não comunicam entre si.",
      "Cria grandes cavernas e dissolve a areia.",
      "Não consegue penetrar e escoa apenas na superfície."
    ],
    correctAnswerIndex: 0,
    explanation: "Como visto no simulador, num meio poroso com boa permeabilidade, a água escorre com fluidez através da rede tridimensional de pequenos poros interligados que compõem o depósito sedimento."
  },
  {
    id: 6,
    question: "O que acontece num terreno composto por rocha de elevada porosidade, mas baixíssima permeabilidade (ex: argila)?",
    options: [
      "A rocha não consegue armazenar água nenhuma, ocorrendo apenas escoamento superficial.",
      "A rocha consegue armazenar grandes quantidades de água, mas essa água tem imensa dificuldade em fluir, sendo um aquífero fraco para extração.",
      "A água flui rapidamente através de grandes condutas subterrâneas que se formam naturalmente.",
      "O excesso de porosidade garante que a permeabilidade também seja automaticamente elevada, fluindo a água livremente."
    ],
    correctAnswerIndex: 1,
    explanation: "A argila é muito porosa (tem muitos espaços vazios entre as partículas microscópicas), mas esses poros são tão pequenos e mal conectados que a água fica retida. Ou seja, tem alta capacidade de retenção mas baixíssima permeabilidade."
  },
  {
    id: 7,
    question: "Em que tipo de aquíferos predomina a circulação de água subterrânea em Portugal nas bacias do Tejo e do Sado?",
    options: [
      "Aquíferos em rochas metamórficas, como os xistos.",
      "Aquíferos Cársticos em calcários maciços.",
      "Aquíferos Fissurados, presentes em maciços graníticos.",
      "Aquíferos Porosos, presentes em rochas sedimentares detríticas (ex: areias e cascalhos)."
    ],
    correctAnswerIndex: 3,
    explanation: "As bacias sedimentares do Tejo e do Sado são constituídas por rochas sedimentares detríticas (como areias e cascalhos), que formam aquíferos porosos, sendo estas as zonas com maiores disponibilidades hídricas do país."
  },
  {
    id: 8,
    question: "Na simulação, quando reduzimos a permeabilidade para níveis muito baixos num meio também pouco poroso, qual é o resultado visível na água da chuva?",
    options: [
      "A água evapora completamente antes de chegar ao solo.",
      "A água infiltra-se instantaneamente criando lençóis freáticos hiper-rápidos.",
      "A água acumula-se e escorre pela superfície do terreno (escoamento superficial).",
      "A água concentra-se no centro do aquífero gerando uma explosão de pressão."
    ],
    correctAnswerIndex: 2,
    explanation: "Verificando-se a incapacidade de a água entrar (poucos poros) e fluir pelo material (baixa permeabilidade), esta não tem outra opção senão acumular-se à superfície e fluir pelo exterior da rocha."
  },
  {
    id: 9,
    question: "Qual o principal agente responsável pela criação de enormes condutas e grutas nos aquíferos cársticos?",
    options: [
      "A erosão eólica (vento) que penetra nas fendas da montanha.",
      "Os sismos e falhas ativas que abrem crateras enormes nos blocos de granito.",
      "A dissolução química da rocha calcária provocada pela lenta circulação da água.",
      "O calor geotérmico que derrete a rocha arenosa criando bolhas de vácuo."
    ],
    correctAnswerIndex: 2,
    explanation: "O modelado cárstico e as suas grutas resultam de um processo de meteorização química, onde a água da chuva vai dissolvendo gradualmente o calcário ao longo de milhares de anos."
  },
  {
    id: 10,
    question: "Tendo em conta as disponibilidades hídricas em Portugal Continental, qual destas afirmações é verdadeira?",
    options: [
      "O Maciço Antigo abriga os aquíferos mais produtivos e com maior capacidade de Portugal.",
      "Um aquífero fraturado num maciço granítico oferece reservas de água maiores do que num aquífero poroso numa bacia sedimentar.",
      "A abundância de água subterrânea depende única e exclusivamente do clima, descurando o tipo de rocha local.",
      "O Maciço Antigo apresenta reduzida disponibilidade de água subterrânea face às de menor inclinação e onde predominam areias, sendo dominado por xistos e granitos (pouco permeáveis)."
    ],
    correctAnswerIndex: 3,
    explanation: "O Maciço Antigo, constituído por granitos e xistos, é genericamente rochoso e pouco permeável. A água abriga-se em aquíferos fraturados, com rendimentos hídricos bem mais fracos e reduzidos que as bacias sedimentares."
  }
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const q = quizData[currentQuestion];

  const handleSelectAnswer = (index: number) => {
    if (!isAnswerChecked) {
      setSelectedAnswer(index);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswerChecked(true);
    if (selectedAnswer === q.correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center animate-in fade-in zoom-in-95 duration-300">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Quiz Concluído!</h2>
        <p className="text-slate-600 mb-8">Conseguiste {score} de {quizData.length} pontos.</p>
        
        <div className="flex justify-center mb-8">
          <div className="radial-progress text-blue-600 flex items-center justify-center font-bold text-3xl shrink-0 h-32 w-32 rounded-full border-8 border-blue-100 bg-white" style={{"--value":(score/quizData.length)*100} as any}>
            {Math.round((score/quizData.length)*100)}%
          </div>
        </div>

        <button 
          onClick={handleRestart}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          Repetir Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 px-4 sm:px-0">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <HelpCircle className="w-5 h-5" />
          <span>Pergunta {currentQuestion + 1} de {quizData.length}</span>
        </div>
        <div className="text-sm font-medium bg-slate-100 px-3 py-1 rounded-full text-slate-600">
          Score: {score}
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 mb-8 leading-relaxed">
          {q.question}
        </h3>

        <div className="space-y-3">
          {q.options.map((option, idx) => {
            let buttonClass = "w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ";
            let icon = null;

            if (!isAnswerChecked) {
              buttonClass += selectedAnswer === idx 
                ? "border-blue-500 bg-blue-50/50 text-blue-800 shadow-sm" 
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700";
            } else {
              if (idx === q.correctAnswerIndex) {
                buttonClass += "border-green-500 bg-green-50 text-green-800";
                icon = <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />;
              } else if (idx === selectedAnswer) {
                buttonClass += "border-red-500 bg-red-50 text-red-800";
                icon = <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />;
              } else {
                buttonClass += "border-slate-200 text-slate-400 opacity-50";
              }
            }

            return (
              <button 
                key={idx}
                onClick={() => handleSelectAnswer(idx)}
                className={buttonClass}
                disabled={isAnswerChecked}
              >
                <div className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                  !isAnswerChecked && selectedAnswer === idx ? 'border-blue-500 text-blue-600' : 'border-slate-300 text-slate-400'
                } ${isAnswerChecked && idx === q.correctAnswerIndex ? 'border-green-500 text-green-600' : ''} ${isAnswerChecked && idx === selectedAnswer && idx !== q.correctAnswerIndex ? 'border-red-500 text-red-600' : ''}`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <div className="flex-1">
                  <span className="font-medium text-[15px] leading-snug block">{option}</span>
                </div>
                {icon}
              </button>
            )
          })}
        </div>

        {isAnswerChecked && (
          <div className={`mt-6 p-5 rounded-xl border ${selectedAnswer === q.correctAnswerIndex ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'} animate-in fade-in slide-in-from-top-2 duration-300`}>
            <p className="font-medium text-slate-800 mb-1">
              {selectedAnswer === q.correctAnswerIndex ? '🎉 Resposta Correta!' : 'Incorreto.'}
            </p>
            <p className="text-slate-600 text-[15px] leading-relaxed">
              {q.explanation}
            </p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
          {!isAnswerChecked ? (
            <button
              onClick={handleCheckAnswer}
              disabled={selectedAnswer === null}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
            >
              Confirmar Resposta
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="bg-slate-800 hover:bg-slate-900 text-white font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
            >
              {currentQuestion < quizData.length - 1 ? 'Próxima Pergunta' : 'Ver Resultados'}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
