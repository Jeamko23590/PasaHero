import { useState } from 'react'
import { Gamepad2, Play, User, Clock, Award, X, CheckCircle, Square, CheckSquare } from 'lucide-react'

const scenarios = [
  { id: 'city_basic', name: 'City Driving - Basic', difficulty: 'beginner', duration: 15 },
  { id: 'city_traffic', name: 'City Driving - Heavy Traffic', difficulty: 'intermediate', duration: 20 },
  { id: 'highway', name: 'Highway Driving', difficulty: 'intermediate', duration: 25 },
  { id: 'night_driving', name: 'Night Driving', difficulty: 'intermediate', duration: 20 },
  { id: 'rain_conditions', name: 'Rainy Conditions', difficulty: 'advanced', duration: 25 },
  { id: 'parking', name: 'Parking Scenarios', difficulty: 'beginner', duration: 15 },
]

const mockStudents = [
  { id: 1, name: 'Juan Dela Cruz' },
  { id: 2, name: 'Maria Garcia' },
  { id: 3, name: 'Pedro Reyes' },
]

const initialSessions = [
  { id: 1, student: 'Juan Dela Cruz', scenario: 'City Driving - Basic', score: 85, passed: true, date: '2024-12-25' },
  { id: 2, student: 'Maria Garcia', scenario: 'Highway Driving', score: 72, passed: true, date: '2024-12-25' },
  { id: 3, student: 'Pedro Reyes', scenario: 'Parking Scenarios', score: 65, passed: false, date: '2024-12-24' },
]

const evaluationCriteria = [
  { id: 'seatbelt', label: 'Proper seatbelt usage', points: 10 },
  { id: 'mirrors', label: 'Mirror checks before maneuvers', points: 10 },
  { id: 'signals', label: 'Correct use of turn signals', points: 10 },
  { id: 'speed', label: 'Appropriate speed control', points: 15 },
  { id: 'lane', label: 'Proper lane discipline', points: 15 },
  { id: 'distance', label: 'Safe following distance', points: 10 },
  { id: 'hazard', label: 'Hazard awareness & response', points: 15 },
  { id: 'parking', label: 'Proper parking technique', points: 10 },
  { id: 'rules', label: 'Traffic rules compliance', points: 5 },
]

export default function InstructorVR() {
  const [showModal, setShowModal] = useState(false)
  const [showActiveSession, setShowActiveSession] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState('')
  const [sessions, setSessions] = useState(initialSessions)
  const [activeSession, setActiveSession] = useState(null)
  const [checkedItems, setCheckedItems] = useState({})

  const getDifficultyBadge = (difficulty) => {
    const styles = {
      beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-yellow-100 text-yellow-700',
      advanced: 'bg-red-100 text-red-700'
    }
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[difficulty]}`}>{difficulty}</span>
  }

  const startSession = () => {
    if (!selectedStudent || !selectedScenario) return
    
    const student = mockStudents.find(s => s.id === parseInt(selectedStudent))
    setActiveSession({
      student: student?.name,
      scenario: selectedScenario,
      startTime: new Date()
    })
    setCheckedItems({})
    setShowModal(false)
    setShowActiveSession(true)
  }

  const toggleCheck = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const calculateScore = () => {
    let score = 0
    evaluationCriteria.forEach(item => {
      if (checkedItems[item.id]) {
        score += item.points
      }
    })
    return score
  }

  const completeSession = () => {
    const score = calculateScore()
    const newSession = {
      id: Date.now(),
      student: activeSession.student,
      scenario: activeSession.scenario.name,
      score: score,
      passed: score >= 70,
      date: new Date().toISOString().split('T')[0]
    }
    setSessions([newSession, ...sessions])
    setShowActiveSession(false)
    setActiveSession(null)
    setSelectedStudent('')
    setSelectedScenario(null)
    setCheckedItems({})
  }

  const currentScore = calculateScore()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Gamepad2 className="w-7 h-7 text-purple-600" />
          VR Training Sessions
        </h1>
        <p className="text-gray-500">Manage VR simulation sessions for your students</p>
      </div>

      {/* Active Session Banner */}
      {showActiveSession && activeSession && (
        <div className="card mb-6 bg-purple-50 border-2 border-purple-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center animate-pulse">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-purple-800">Session In Progress</p>
                <p className="text-sm text-purple-600">{activeSession.student} - {activeSession.scenario.name}</p>
              </div>
            </div>
            <button onClick={() => setShowActiveSession(false)} className="btn bg-purple-600 text-white hover:bg-purple-700">
              End Session
            </button>
          </div>
        </div>
      )}

      {/* Quick Start */}
      <div className="card mb-6">
        <h2 className="font-semibold mb-4">Start New VR Session</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => { setSelectedScenario(scenario); setShowModal(true); }}
              className="p-4 border rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left"
            >
              <div className="text-2xl mb-2">🎮</div>
              <div className="font-medium text-sm">{scenario.name}</div>
              <div className="mt-2">{getDifficultyBadge(scenario.difficulty)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="card">
        <h2 className="font-semibold mb-4">Recent VR Sessions</h2>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-500">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Scenario</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Result</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id} className="border-t">
                <td className="px-4 py-3">{session.date}</td>
                <td className="px-4 py-3 font-medium">{session.student}</td>
                <td className="px-4 py-3">{session.scenario}</td>
                <td className="px-4 py-3">
                  <span className={`font-bold ${session.score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                    {session.score}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  {session.passed ? (
                    <span className="badge badge-success">Passed</span>
                  ) : (
                    <span className="badge badge-danger">Failed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Start Session Modal */}
      {showModal && selectedScenario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md m-4">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Start VR Session</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-purple-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold">{selectedScenario.name}</h3>
                <div className="flex items-center gap-3 mt-2">
                  {getDifficultyBadge(selectedScenario.difficulty)}
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {selectedScenario.duration} min
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Select Student *</label>
                <select 
                  className="input"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                >
                  <option value="">Choose student...</option>
                  {mockStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button 
                  onClick={startSession}
                  disabled={!selectedStudent}
                  className="btn bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Play className="w-4 h-4" /> Start Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Evaluation Checklist Modal */}
      {showActiveSession && activeSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-4">
          <div className="bg-white rounded-xl w-full max-w-lg m-4">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">VR Session Evaluation</h2>
              <p className="text-sm text-gray-500 mt-1">{activeSession.student} - {activeSession.scenario.name}</p>
            </div>
            <div className="p-6">
              {/* Score Display */}
              <div className={`p-4 rounded-lg mb-4 text-center ${currentScore >= 70 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className="text-sm text-gray-600">Current Score</p>
                <p className={`text-4xl font-bold ${currentScore >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                  {currentScore}%
                </p>
                <p className={`text-sm font-medium ${currentScore >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                  {currentScore >= 70 ? '✓ PASSING' : '✗ NEEDS 70% TO PASS'}
                </p>
              </div>

              {/* Checklist */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                <p className="text-sm font-medium text-gray-700 mb-2">Evaluation Criteria:</p>
                {evaluationCriteria.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                      checkedItems[item.id] 
                        ? 'bg-green-50 border-green-300' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {checkedItems[item.id] ? (
                      <CheckSquare className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                    <span className={`flex-1 ${checkedItems[item.id] ? 'text-green-800' : 'text-gray-700'}`}>
                      {item.label}
                    </span>
                    <span className={`text-sm font-medium ${checkedItems[item.id] ? 'text-green-600' : 'text-gray-400'}`}>
                      +{item.points}%
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button onClick={() => setShowActiveSession(false)} className="btn btn-secondary">Cancel</button>
                <button onClick={completeSession} className="btn btn-success flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Complete Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
