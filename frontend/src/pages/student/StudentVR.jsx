import { useState } from 'react'
import { Gamepad2, Award, Clock, TrendingUp, Target } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'

const mockData = {
  sessions: [
    { id: 1, scenario: 'City Driving - Basic', score: 85, passed: true, date: '2024-12-20', duration: 15 },
    { id: 2, scenario: 'Parking Scenarios', score: 78, passed: true, date: '2024-12-22', duration: 15 },
  ],
  stats: {
    total_sessions: 2,
    average_score: 81.5,
    pass_rate: 100,
    total_time: 30
  },
  skills: [
    { skill: 'Reaction Time', value: 85 },
    { skill: 'Lane Discipline', value: 78 },
    { skill: 'Speed Control', value: 82 },
    { skill: 'Signal Usage', value: 90 },
    { skill: 'Mirror Checks', value: 75 },
  ],
  upcoming: [
    { id: 'highway', name: 'Highway Driving', difficulty: 'intermediate', scheduled: '2024-12-30' },
  ]
}

export default function StudentVR() {
  const [data] = useState(mockData)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Gamepad2 className="w-7 h-7 text-purple-600" />
          VR Training
        </h1>
        <p className="text-gray-500">Your virtual reality driving practice</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data.stats.total_sessions}</p>
              <p className="text-sm text-gray-500">Sessions</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data.stats.average_score}%</p>
              <p className="text-sm text-gray-500">Avg Score</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data.stats.pass_rate}%</p>
              <p className="text-sm text-gray-500">Pass Rate</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data.stats.total_time}m</p>
              <p className="text-sm text-gray-500">Total Time</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Radar */}
        <div className="card">
          <h3 className="font-semibold mb-4">Skill Assessment</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={data.skills}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Score" dataKey="value" stroke="#9333ea" fill="#9333ea" fillOpacity={0.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Upcoming VR Session */}
        <div className="card">
          <h3 className="font-semibold mb-4">Upcoming VR Session</h3>
          {data.upcoming.length > 0 ? (
            <div className="space-y-3">
              {data.upcoming.map((session) => (
                <div key={session.id} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🎮</div>
                    <div>
                      <p className="font-semibold">{session.name}</p>
                      <p className="text-sm text-gray-600">Scheduled: {session.scheduled}</p>
                      <span className="inline-block mt-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        {session.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No upcoming VR sessions scheduled</p>
          )}
        </div>
      </div>

      {/* Session History */}
      <div className="card mt-6">
        <h3 className="font-semibold mb-4">Session History</h3>
        <div className="space-y-3">
          {data.sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-2xl">🎮</div>
                <div>
                  <p className="font-medium">{session.scenario}</p>
                  <p className="text-sm text-gray-500">{session.date} • {session.duration} min</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xl font-bold ${session.passed ? 'text-green-600' : 'text-red-600'}`}>
                  {session.score}%
                </p>
                {session.passed ? (
                  <span className="badge badge-success">Passed</span>
                ) : (
                  <span className="badge badge-danger">Failed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
