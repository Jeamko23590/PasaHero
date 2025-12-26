import { useState } from 'react'
import { FileText, Download, QrCode, CheckCircle, Clock, Search, Award, Printer, Plus, X } from 'lucide-react'
import { downloadCertificatePDF } from '../utils/generateCertificatePDF'

const initialCertificates = [
  { id: 1, certificate_number: 'CERT-2024-000001', student: { full_name: 'Pedro Reyes', student_id: 'STU-2024-00003' }, type: 'completion', issue_date: '2024-12-15', expiry_date: '2025-12-15', is_valid: true },
  { id: 2, certificate_number: 'THE-2024-000045', student: { full_name: 'Maria Garcia', student_id: 'STU-2024-00002' }, type: 'theory_exam', issue_date: '2024-12-10', expiry_date: '2025-12-10', is_valid: true },
  { id: 3, certificate_number: 'PRA-2024-000032', student: { full_name: 'Juan Dela Cruz', student_id: 'STU-2024-00001' }, type: 'practical_exam', issue_date: '2024-12-08', expiry_date: '2025-12-08', is_valid: true },
  { id: 4, certificate_number: 'LTO-2024-000018', student: { full_name: 'Ana Santos', student_id: 'STU-2024-00004' }, type: 'lto_ready', issue_date: '2024-11-20', expiry_date: '2025-11-20', is_valid: true },
]

const mockStudentRecords = [
  { id: 1, student: { full_name: 'Juan Dela Cruz', student_id: 'STU-2024-00001' }, course: 'TDC + PDC Non-Pro', enrollment_date: '2024-12-01', theory_completed: 12, theory_total: 15, practical_completed: 6, practical_total: 8, vr_completed: 2, vr_total: 2, status: 'in_progress' },
  { id: 2, student: { full_name: 'Maria Garcia', student_id: 'STU-2024-00002' }, course: 'Professional Driver Course', enrollment_date: '2024-12-05', theory_completed: 8, theory_total: 20, practical_completed: 3, practical_total: 15, vr_completed: 1, vr_total: 5, status: 'in_progress' },
  { id: 3, student: { full_name: 'Pedro Reyes', student_id: 'STU-2024-00003' }, course: 'Motorcycle Course', enrollment_date: '2024-11-15', theory_completed: 8, theory_total: 8, practical_completed: 5, practical_total: 5, vr_completed: 2, vr_total: 2, status: 'completed' },
]

const mockStudents = [
  { id: 1, full_name: 'Juan Dela Cruz', student_id: 'STU-2024-00001' },
  { id: 2, full_name: 'Maria Garcia', student_id: 'STU-2024-00002' },
  { id: 3, full_name: 'Pedro Reyes', student_id: 'STU-2024-00003' },
  { id: 4, full_name: 'Ana Santos', student_id: 'STU-2024-00004' },
]

export default function Records() {
  const [activeTab, setActiveTab] = useState('certificates')
  const [search, setSearch] = useState('')
  const [showCertModal, setShowCertModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedCert, setSelectedCert] = useState(null)
  const [certificates, setCertificates] = useState(initialCertificates)
  const [downloading, setDownloading] = useState(null)
  const [newCert, setNewCert] = useState({ student_id: '', type: 'completion' })

  const getCertTypeName = (type) => {
    const names = {
      completion: 'Course Completion',
      theory_exam: 'Theoretical Driving Course (TDC)',
      practical_exam: 'Practical Driving Course (PDC)',
      lto_ready: 'LTO Ready Certificate'
    }
    return names[type] || type
  }

  const getCertTypeBadge = (type) => {
    const config = {
      completion: { label: 'Course Completion', color: 'bg-green-100 text-green-700' },
      theory_exam: { label: 'Theory Exam', color: 'bg-blue-100 text-blue-700' },
      practical_exam: { label: 'Practical Exam', color: 'bg-purple-100 text-purple-700' },
      lto_ready: { label: 'LTO Ready', color: 'bg-orange-100 text-orange-700' }
    }
    const { label, color } = config[type] || { label: type, color: 'bg-gray-100 text-gray-700' }
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>
  }

  const viewCertificate = (cert) => {
    setSelectedCert(cert)
    setShowCertModal(true)
  }

  const handleDownloadPDF = async (cert) => {
    setDownloading(cert.id)
    await new Promise(resolve => setTimeout(resolve, 500))
    downloadCertificatePDF(cert, cert.student.full_name)
    setDownloading(null)
  }

  const printCertificate = () => {
    window.print()
  }

  const generateCertNumber = (type) => {
    const prefix = { completion: 'CERT', theory_exam: 'THE', practical_exam: 'PRA', lto_ready: 'LTO' }[type] || 'CERT'
    const num = String(certificates.length + 1).padStart(6, '0')
    return `${prefix}-2024-${num}`
  }

  const createCertificate = () => {
    const student = mockStudents.find(s => s.id === parseInt(newCert.student_id))
    if (!student) return

    const today = new Date()
    const expiry = new Date(today)
    expiry.setFullYear(expiry.getFullYear() + 1)

    const cert = {
      id: Date.now(),
      certificate_number: generateCertNumber(newCert.type),
      student: { full_name: student.full_name, student_id: student.student_id },
      type: newCert.type,
      issue_date: today.toISOString().split('T')[0],
      expiry_date: expiry.toISOString().split('T')[0],
      is_valid: true
    }

    setCertificates([cert, ...certificates])
    setShowCreateModal(false)
    setNewCert({ student_id: '', type: 'completion' })
  }

  const filteredCerts = certificates.filter(c => 
    c.certificate_number.toLowerCase().includes(search.toLowerCase()) ||
    c.student.full_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Digital Records</h1>
          <p className="text-gray-500">Manage certificates and student training records</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Issue Certificate
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'certificates' ? 'bg-primary-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <span className="flex items-center gap-2"><Award className="w-4 h-4" /> Certificates ({certificates.length})</span>
        </button>
        <button 
          onClick={() => setActiveTab('training')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'training' ? 'bg-primary-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Training Records</span>
        </button>
      </div>

      {/* Certificates Tab */}
      {activeTab === 'certificates' && (
        <>
          <div className="card mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by certificate number or student..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCerts.map((cert) => (
              <div key={cert.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary-600" />
                  </div>
                  {cert.is_valid ? (
                    <span className="badge badge-success flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Valid
                    </span>
                  ) : (
                    <span className="badge badge-danger">Expired</span>
                  )}
                </div>
                <div className="mb-3">{getCertTypeBadge(cert.type)}</div>
                <h3 className="font-mono text-sm text-gray-500 mb-1">{cert.certificate_number}</h3>
                <p className="font-semibold">{cert.student.full_name}</p>
                <p className="text-sm text-gray-500">{cert.student.student_id}</p>
                <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
                  <div>
                    <p className="text-gray-500">Issued: {cert.issue_date}</p>
                    <p className="text-gray-500">Expires: {cert.expiry_date}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => viewCertificate(cert)} className="p-2 hover:bg-gray-100 rounded-lg" title="View">
                      <QrCode className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => handleDownloadPDF(cert)} 
                      disabled={downloading === cert.id}
                      className="p-2 hover:bg-gray-100 rounded-lg" 
                      title="Download PDF"
                    >
                      <Download className={`w-4 h-4 ${downloading === cert.id ? 'animate-bounce text-primary-600' : 'text-gray-600'}`} />
                    </button>
                    <button onClick={printCertificate} className="p-2 hover:bg-gray-100 rounded-lg" title="Print">
                      <Printer className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Training Records Tab */}
      {activeTab === 'training' && (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Theory Progress</th>
                <th className="px-4 py-3">Practical Progress</th>
                <th className="px-4 py-3">VR Progress</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockStudentRecords.map((record) => {
                const theoryPct = Math.round((record.theory_completed / record.theory_total) * 100)
                const practicalPct = Math.round((record.practical_completed / record.practical_total) * 100)
                const vrPct = Math.round((record.vr_completed / record.vr_total) * 100)
                
                return (
                  <tr key={record.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium">{record.student.full_name}</div>
                      <div className="text-xs text-gray-500">{record.student.student_id}</div>
                    </td>
                    <td className="px-4 py-3">{record.course}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden w-20">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${theoryPct}%` }} />
                        </div>
                        <span className="text-xs">{record.theory_completed}/{record.theory_total}h</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden w-20">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${practicalPct}%` }} />
                        </div>
                        <span className="text-xs">{record.practical_completed}/{record.practical_total}h</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden w-20">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${vrPct}%` }} />
                        </div>
                        <span className="text-xs">{record.vr_completed}/{record.vr_total}h</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {record.status === 'completed' ? (
                        <span className="badge badge-success">Completed</span>
                      ) : (
                        <span className="badge badge-primary">In Progress</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button className="btn btn-secondary text-sm py-1 px-3">View Details</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Certificate Preview Modal */}
      {showCertModal && selectedCert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl m-4">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Certificate Preview</h2>
              <button onClick={() => setShowCertModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8">
              <div className="border-4 border-double border-primary-600 p-8 text-center bg-gradient-to-b from-primary-50 to-white">
                <div className="mb-4">
                  <h1 className="text-3xl font-bold text-primary-800">PasaHero</h1>
                  <p className="text-sm text-gray-600">Smart Driving School</p>
                </div>
                <div className="my-8">
                  <p className="text-lg text-gray-600 mb-2">This is to certify that</p>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCert.student.full_name}</h2>
                  <p className="text-gray-600">has successfully completed the</p>
                  <h3 className="text-xl font-semibold text-primary-700 mt-2">{getCertTypeName(selectedCert.type)}</h3>
                </div>
                <div className="flex justify-between items-end mt-8">
                  <div className="text-left">
                    <p className="text-sm text-gray-500">Certificate No:</p>
                    <p className="font-mono">{selectedCert.certificate_number}</p>
                  </div>
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-gray-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Issue Date:</p>
                    <p>{selectedCert.issue_date}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button onClick={printCertificate} className="btn btn-secondary flex items-center gap-2">
                <Printer className="w-4 h-4" /> Print
              </button>
              <button 
                onClick={() => handleDownloadPDF(selectedCert)}
                disabled={downloading === selectedCert.id}
                className="btn btn-primary flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> {downloading === selectedCert.id ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Certificate Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md m-4">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Issue New Certificate</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Student *</label>
                  <select 
                    className="input"
                    value={newCert.student_id}
                    onChange={(e) => setNewCert({...newCert, student_id: e.target.value})}
                  >
                    <option value="">Select student...</option>
                    {mockStudents.map(s => (
                      <option key={s.id} value={s.id}>{s.full_name} ({s.student_id})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Certificate Type *</label>
                  <select 
                    className="input"
                    value={newCert.type}
                    onChange={(e) => setNewCert({...newCert, type: e.target.value})}
                  >
                    <option value="completion">Course Completion</option>
                    <option value="theory_exam">Theory Exam (TDC)</option>
                    <option value="practical_exam">Practical Exam (PDC)</option>
                    <option value="lto_ready">LTO Ready</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowCreateModal(false)} className="btn btn-secondary">Cancel</button>
                <button 
                  onClick={createCertificate}
                  disabled={!newCert.student_id}
                  className="btn btn-primary"
                >
                  Issue Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
