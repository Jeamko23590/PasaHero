import { useState } from 'react'
import { Gamepad2, Play, Award, AlertTriangle, TrendingUp, Clock, Target, Zap, X, CheckCircle, Square, CheckSquare } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const scenarios = [
  { id: 'city_basic', name: 'City Driving - Basic', difficulty: 'beginner', duration: 15, description: 'Navigate through basic city streets with light traffic' },
  { id: 'city_traffic', name: 'City Driving - Heavy Traffic', difficulty: 'intermediate', duration: 20, description: 'Handle congested urban roads and intersections' },
  { id: 'highway', name: 'Highway Driving', difficulty: 'intermediate', duration: 25, description: 'Practice highway merging, lane changes, and exits' },
  { id: 'night_driving', name: 'Night Driving', difficulty: 'intermediate', duration: 20, description: 'Drive safely in low visibility conditions' },
  { id: 'rain_conditions', name: 'Rainy Conditions', difficulty: 'advanced', duration: 25, description: 'Handle wet roads and reduced visibility' },
  { id: 'emergency', name: 'Emergency Situations', difficulty: 'advanced', duration: 30, description: 'React to sudden hazards and emergency scenarios' },
  { id: 'parking', name: 'Parking Scenarios', difficulty: 'beginner', duration: 15, description: 'Practice parallel, perpendicular, and angle parking' },
  { id: 'mountain', name: 'Mountain Roads', difficulty: 'advanced', duration: 30, description: 'Navigate steep grades and winding mountain roads' },
]

const mockStudents = [
  { id: 1, name: 'Juan Dela Cruz' },
  { id: 2, name: 'Maria Garcia' },
  { id: 3, name: 'Pedro Reyes' },
  { id: 4, name: 'Ana Santos' },
]

const initialHistory = [
  { id: 1, scenario_name: 'City Driving - Basic', student: 'Juan Dela Cruz', score: 85, passed: true, created_at: '2024-12-20', duration_minutes: 15 },
  { id: 2, scenario_name: 'Parking Scenarios', student: 'Maria Garcia', score: 78, passed: true, created_at: '2024-12-21', duration_minutes: 15 },
  { id: 3, scenario_name: 'Highway Driving', student: 'Pedro Reyes', score: 65, passed: false, created_at: '2024-12-22', duration_minutes: 25 },
  { id: 4, scenario_name: 'City Driving - Heavy Traffic', student: 'Ana Santos', score: 72, passed: true, created_at: '2024-12-23', duration_minutes: 20 },
  { id: 5, scenario_name: 'Night Driving', student: 'Juan Dela Cruz', score: 88, passed: true, created_at: '2024-12-24', duration_minutes: 20 },
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

// Performance data per student
const studentPerformanceData = {
  'all': {
    skills: [
      { skill: 'Reaction Time', value: 85 },
      { skill: 'Lane Discipline', value: 78 },
      { skill: 'Speed Control', value: 82 },
      { skill: 'Signal Usage', value: 90 },
      { skill: 'Mirror Checks', value: 75 },
      { skill: 'Hazard Awareness', value: 70 },
    ],
    progress: [
      { session: '1', score: 65 },
      { session: '2', score: 72 },
      { session: '3', score: 68 },
      { session: '4', score: 78 },
      { session: '5', score: 85 },
    ]
  },
  'Juan Dela Cruz': {
    skills: [
      { skill: 'Reaction Time', value: 88 },
      { skill: 'Lane Discipline', value: 82 },
      { skill: 'Speed Control', value: 85 },
      { skill: 'Signal Usage', value: 92 },
      { skill: 'Mirror Checks', value: 80 },
      { skill: 'Hazard Awareness', value: 75 },
    ],
    progress: [
      { session: '1', score: 70 },
      { session: '2', score: 78 },
      { session: '3', score: 85 },
      { session: '4', score: 88 },
    ]
  },
  'Maria Garcia': {
    skills: [
      { skill: 'Reaction Time', value: 80 },
      { skill: 'Lane Discipline', value: 75 },
      { skill: 'Speed Control', value: 78 },
      { skill: 'Signal Usage', value: 88 },
      { skill: 'Mirror Checks', value: 72 },
      { skill: 'Hazard Awareness', value: 68 },
    ],
    progress: [
      { session: '1', score: 65 },
      { session: '2', score: 72 },
      { session: '3', score: 78 },
    ]
  },
  'Pedro Reyes': {
    skills: [
      { skill: 'Reaction Time', value: 72 },
      { skill: 'Lane Discipline', value: 68 },
      { skill: 'Speed Control', value: 70 },
      { skill: 'Signal Usage', value: 82 },
      { skill: 'Mirror Checks', value: 65 },
      { skill: 'Hazard Awareness', value: 60 },
    ],
    progress: [
      { session: '1', score: 55 },
      { session: '2', score: 62 },
      { session: '3', score: 65 },
    ]
  },
  'Ana Santos': {
    skills: [
      { skill: 'Reaction Time', value: 85 },
      { skill: 'Lane Discipline', value: 80 },
      { skill: 'Speed Control', value: 82 },
      { skill: 'Signal Usage', value: 90 },
      { skill: 'Mirror Checks', value: 78 },
      { skill: 'Hazard Awareness', value: 72 },
    ],
    progress: [
      { session: '1', score: 68 },
      { session: '2', score: 72 },
    ]
  },
}

export default function VRSimulation() {
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [activeTab, setActiveTab] = useState('scenarios')
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [showActiveModal, setShowActiveModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState('')
  const [analyticsStudent, setAnalyticsStudent] = useState('all')
  const [sessions, setSessions] = useState(initialHistory)
  const [activeSession, setActiveSession] = useState(null)
  const [checkedItems, setCheckedItems] = useState({})

  const stats = {
    total_sessions: sessions.length,
    average_score: Math.round(sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length * 10) / 10,
    pass_rate: Math.round((sessions.filter(s => s.passed).length / sessions.length) * 100),
    total_time: sessions.reduce((sum, s) => sum + s.duration_minutes, 0)
  }

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
      scenario: selectedScenario
    })
    setCheckedItems({})
    setShowSessionModal(false)
    setShowActiveModal(true)
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
      scenario_name: activeSession.scenario.name,
      student: activeSession.student,
      score: score,
      passed: score >= 70,
      created_at: new Date().toISOString().split('T')[0],
      duration_minutes: activeSession.scenario.duration
    }
    setSessions([newSession, ...sessions])
    setShowActiveModal(false)
    setActiveSession(null)
    setSelectedStudent('')
    setSelectedScenario(null)
    setCheckedItems({})
  }

  const currentScore = calculateScore()

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 sm:w-7 sm:h-7 text-purple-600" />
            VR Simulation
          </h1>
          <p className="text-xs sm:text-base text-gray-500">Immersive driving training</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button 
          onClick={() => setActiveTab('scenarios')}
          className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm whitespace-nowrap ${
            activeTab === 'scenarios' ? 'bg-purple-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Scenarios
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm whitespace-nowrap ${
            activeTab === 'history' ? 'bg-purple-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          History
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm whitespace-nowrap ${
            activeTab === 'analytics' ? 'bg-purple-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Scenarios Tab */}
      {activeTab === 'scenarios' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {scenarios.map((scenario) => (
            <div 
              key={scenario.id}
              className={`card cursor-pointer transition-all hover:shadow-lg ${
                selectedScenario?.id === scenario.id ? 'ring-2 ring-purple-500' : ''
              }`}
              onClick={() => setSelectedScenario(scenario)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                {getDifficultyBadge(scenario.difficulty)}
              </div>
              <h3 className="font-semibold mb-1 text-sm sm:text-base">{scenario.name}</h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-3 line-clamp-2">{scenario.description}</p>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" /> {scenario.duration}m
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedScenario(scenario); setShowSessionModal(true); }}
                  className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium"
                >
                  <Play className="w-3 h-3 sm:w-4 sm:h-4" /> Start
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="card">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold">{stats.total_sessions}</p>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">Sessions</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold">{stats.average_score}%</p>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">Avg Score</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold">{stats.pass_rate}%</p>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">Pass Rate</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold">{stats.total_time}m</p>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">Total Time</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-0 sm:p-6">
            <h3 className="font-semibold mb-4 px-4 pt-4 sm:px-0 sm:pt-0 text-sm sm:text-base">Recent Sessions</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs sm:text-sm text-gray-500">
                    <th className="px-3 sm:px-4 py-3">Date</th>
                    <th className="px-3 sm:px-4 py-3">Student</th>
                    <th className="px-3 sm:px-4 py-3 hidden sm:table-cell">Scenario</th>
                    <th className="px-3 sm:px-4 py-3">Score</th>
                    <th className="px-3 sm:px-4 py-3">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => (
                    <tr key={session.id} className="border-t text-xs sm:text-sm">
                      <td className="px-3 sm:px-4 py-3">{session.created_at}</td>
                      <td className="px-3 sm:px-4 py-3 font-medium">{session.student}</td>
                      <td className="px-3 sm:px-4 py-3 hidden sm:table-cell">{session.scenario_name}</td>
                      <td className="px-3 sm:px-4 py-3">
                        <span className={`font-bold ${session.score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                          {session.score}%
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        {session.passed ? (
                          <span className="badge badge-success">Pass</span>
                        ) : (
                          <span className="badge badge-danger">Fail</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          {/* Student Filter */}
          <div className="card mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <label className="font-medium text-gray-700 text-sm">Filter by Student:</label>
              <select
                className="input sm:max-w-xs"
                value={analyticsStudent}
                onChange={(e) => setAnalyticsStudent(e.target.value)}
              >
                <option value="all">All Students (Average)</option>
                {mockStudents.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="card">
              <h3 className="font-semibold mb-4 text-sm sm:text-base">Skill Assessment</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={studentPerformanceData[analyticsStudent]?.skills || studentPerformanceData['all'].skills}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 9 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Radar name="Score" dataKey="value" stroke="#9333ea" fill="#9333ea" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4 text-sm sm:text-base">Score Progress</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={studentPerformanceData[analyticsStudent]?.progress || studentPerformanceData['all'].progress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="session" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#9333ea" strokeWidth={2} dot={{ fill: '#9333ea' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card lg:col-span-2">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm sm:text-base">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                AI Recommendations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {analyticsStudent === 'Pedro Reyes' ? (
                  <>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-yellow-800 text-sm">Focus Area</span>
                      </div>
                      <p className="text-xs text-yellow-700">Hazard awareness needs improvement.</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-800 text-sm">Strength</span>
                      </div>
                      <p className="text-xs text-green-700">Good signal usage!</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-800 text-sm">Next Goal</span>
                      </div>
                      <p className="text-xs text-blue-700">Focus on beginner scenarios.</p>
                    </div>
                  </>
                ) : analyticsStudent === 'Juan Dela Cruz' ? (
                  <>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-yellow-800 text-sm">Focus Area</span>
                      </div>
                      <p className="text-xs text-yellow-700">Try more emergency scenarios.</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-800 text-sm">Strength</span>
                      </div>
                      <p className="text-xs text-green-700">Excellent performance!</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-800 text-sm">Next Goal</span>
                      </div>
                      <p className="text-xs text-blue-700">Ready for certification!</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-yellow-800 text-sm">Focus Area</span>
                      </div>
                      <p className="text-xs text-yellow-700">Practice emergency scenarios.</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-800 text-sm">Strength</span>
                      </div>
                      <p className="text-xs text-green-700">Excellent signal usage!</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-800 text-sm">Next Goal</span>
                      </div>
                      <p className="text-xs text-blue-700">Try "Rain Conditions".</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Start Session Modal */}
      {showSessionModal && selectedScenario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md m-4">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Start VR Session</h2>
              <button onClick={() => setShowSessionModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-purple-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-purple-800">{selectedScenario.name}</h3>
                <p className="text-sm text-purple-600 mt-1">{selectedScenario.description}</p>
                <div className="flex items-center gap-4 mt-3">
                  {getDifficultyBadge(selectedScenario.difficulty)}
                  <span className="text-sm text-purple-600 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {selectedScenario.duration} minutes
                  </span>
                </div>
              </div>
              <div className="space-y-3">
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
                <div>
                  <label className="block text-sm font-medium mb-1">VR Station</label>
                  <select className="input">
                    <option>Station 1 - Available</option>
                    <option>Station 2 - Available</option>
                    <option disabled>Station 3 - In Use</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowSessionModal(false)} className="btn btn-secondary">Cancel</button>
                <button 
                  onClick={startSession}
                  disabled={!selectedStudent}
                  className="btn bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Play className="w-4 h-4" /> Launch Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Evaluation Checklist Modal */}
      {showActiveModal && activeSession && (
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
                <button onClick={() => setShowActiveModal(false)} className="btn btn-secondary">Cancel</button>
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
