import { useState } from 'react'
import { BookOpen, Car, Gamepad2, CheckCircle, Circle, Award } from 'lucide-react'

const mockProgress = {
  course: {
    name: 'TDC + PDC Non-Professional',
    theory_hours: 15,
    practical_hours: 8,
    vr_simulation_hours: 2
  },
  theory: {
    completed: 10,
    total: 15,
    modules: [
      { name: 'Traffic Rules & Regulations', status: 'completed', hours: 3 },
      { name: 'Road Signs & Markings', status: 'completed', hours: 2 },
      { name: 'Defensive Driving', status: 'completed', hours: 3 },
      { name: 'Vehicle Maintenance Basics', status: 'completed', hours: 2 },
      { name: 'Emergency Procedures', status: 'in_progress', hours: 3 },
      { name: 'LTO Requirements & Process', status: 'pending', hours: 2 },
    ]
  },
  practical: {
    completed: 5,
    total: 8,
    modules: [
      { name: 'Basic Vehicle Controls', status: 'completed', hours: 2 },
      { name: 'Starting & Stopping', status: 'completed', hours: 1 },
      { name: 'Steering & Lane Keeping', status: 'completed', hours: 2 },
      { name: 'Parking (Parallel & Perpendicular)', status: 'in_progress', hours: 2 },
      { name: 'Road Driving Practice', status: 'pending', hours: 1 },
    ]
  },
  vr: {
    completed: 1,
    total: 2,
    sessions: [
      { name: 'City Driving - Basic', score: 85, passed: true },
      { name: 'Parking Scenarios', score: null, passed: null },
    ]
  }
}

export default function StudentProgress() {
  const [data] = useState(mockProgress)

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in_progress': return <Circle className="w-5 h-5 text-yellow-500 fill-yellow-500" />
      default: return <Circle className="w-5 h-5 text-gray-300" />
    }
  }

  const overallProgress = Math.round(
    ((data.theory.completed + data.practical.completed + data.vr.completed) /
    (data.theory.total + data.practical.total + data.vr.total)) * 100
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Progress</h1>
        <p className="text-gray-500">{data.course.name}</p>
      </div>

      {/* Overall Progress */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Overall Progress</h2>
          <span className="text-3xl font-bold text-green-600">{overallProgress}%</span>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${overallProgress}%` }} />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <p className="font-bold">{data.theory.completed}/{data.theory.total}h</p>
            <p className="text-xs text-gray-500">Theory</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Car className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <p className="font-bold">{data.practical.completed}/{data.practical.total}h</p>
            <p className="text-xs text-gray-500">Practical</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Gamepad2 className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <p className="font-bold">{data.vr.completed}/{data.vr.total}h</p>
            <p className="text-xs text-gray-500">VR Simulation</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theory Modules */}
        <div className="card">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" /> Theory Modules
          </h3>
          <div className="space-y-3">
            {data.theory.modules.map((module, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {getStatusIcon(module.status)}
                <div className="flex-1">
                  <p className="font-medium">{module.name}</p>
                  <p className="text-xs text-gray-500">{module.hours} hours</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  module.status === 'completed' ? 'bg-green-100 text-green-700' :
                  module.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {module.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Practical Modules */}
        <div className="card">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Car className="w-5 h-5 text-green-600" /> Practical Modules
          </h3>
          <div className="space-y-3">
            {data.practical.modules.map((module, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {getStatusIcon(module.status)}
                <div className="flex-1">
                  <p className="font-medium">{module.name}</p>
                  <p className="text-xs text-gray-500">{module.hours} hours</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  module.status === 'completed' ? 'bg-green-100 text-green-700' :
                  module.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {module.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VR Sessions */}
      <div className="card mt-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-purple-600" /> VR Simulation Sessions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.vr.sessions.map((session, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <p className="font-medium">{session.name}</p>
                {session.score !== null ? (
                  <span className={`font-bold ${session.passed ? 'text-green-600' : 'text-red-600'}`}>
                    {session.score}%
                  </span>
                ) : (
                  <span className="text-gray-400">Not taken</span>
                )}
              </div>
              {session.passed !== null && (
                <div className="mt-2">
                  {session.passed ? (
                    <span className="badge badge-success">Passed</span>
                  ) : (
                    <span className="badge badge-danger">Failed</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
