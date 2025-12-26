import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Award, Download, QrCode, CheckCircle, Clock, X } from 'lucide-react'
import { downloadCertificatePDF } from '../../utils/generateCertificatePDF'

const mockCertificates = [
  { id: 1, certificate_number: 'THE-2024-000123', type: 'theory_exam', issue_date: '2024-12-15', expiry_date: '2025-12-15', is_valid: true },
]

const pendingCertificates = [
  { type: 'practical_exam', name: 'Practical Driving', requirement: 'Complete practical hours' },
  { type: 'completion', name: 'Course Completion', requirement: 'Pass all exams' },
  { type: 'lto_ready', name: 'LTO Ready', requirement: 'Complete full course' },
]

export default function StudentCertificates() {
  const { user } = useAuth()
  const [showPreview, setShowPreview] = useState(false)
  const [selectedCert, setSelectedCert] = useState(null)
  const [downloading, setDownloading] = useState(false)

  const getCertTypeName = (type) => {
    const names = { completion: 'Course Completion', theory_exam: 'TDC Certificate', practical_exam: 'PDC Certificate', lto_ready: 'LTO Ready' }
    return names[type] || type
  }

  const viewCertificate = (cert) => {
    setSelectedCert(cert)
    setShowPreview(true)
  }

  const handleDownloadPDF = async (cert) => {
    setDownloading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    downloadCertificatePDF(cert, user?.name || 'Student Name')
    setDownloading(false)
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-xl md:text-2xl font-bold">My Certificates</h1>
        <p className="text-sm text-gray-500">Your earned certificates</p>
      </div>

      {/* Earned Certificates */}
      <div className="mb-6">
        <h2 className="font-semibold mb-3 flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 text-green-500" /> Earned
        </h2>
        {mockCertificates.length > 0 ? (
          <div className="space-y-3">
            {mockCertificates.map((cert) => (
              <div key={cert.id} className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{getCertTypeName(cert.type)}</h3>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Valid</span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono">{cert.certificate_number}</p>
                    <p className="text-xs text-gray-500 mt-1">Issued: {cert.issue_date}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => viewCertificate(cert)} className="btn btn-secondary flex-1 text-sm py-2">
                    <QrCode className="w-4 h-4 inline mr-1" /> View
                  </button>
                  <button onClick={() => handleDownloadPDF(cert)} disabled={downloading} className="btn btn-primary flex-1 text-sm py-2">
                    <Download className="w-4 h-4 inline mr-1" /> {downloading ? '...' : 'PDF'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 text-center border">
            <Award className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No certificates yet</p>
          </div>
        )}
      </div>

      {/* Pending Certificates */}
      <div>
        <h2 className="font-semibold mb-3 flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-yellow-500" /> Pending
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {pendingCertificates.map((cert, i) => (
            <div key={i} className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                <Award className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="font-medium text-sm">{cert.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{cert.requirement}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && selectedCert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-bold">Certificate</h2>
              <button onClick={() => setShowPreview(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4">
              <div className="border-4 border-double border-green-600 p-6 text-center bg-gradient-to-b from-green-50 to-white rounded">
                <h1 className="text-2xl font-bold text-green-800">PasaHero</h1>
                <p className="text-xs text-gray-600 mb-4">Smart Driving School</p>
                <p className="text-sm text-gray-600">This certifies that</p>
                <h2 className="text-xl font-bold my-2">{user?.name || 'Student'}</h2>
                <p className="text-sm text-gray-600">has completed the</p>
                <h3 className="text-lg font-semibold text-green-700 mt-1">{getCertTypeName(selectedCert.type)}</h3>
                <div className="flex justify-between items-center mt-6 text-xs">
                  <div className="text-left">
                    <p className="text-gray-500">No:</p>
                    <p className="font-mono">{selectedCert.certificate_number}</p>
                  </div>
                  <QrCode className="w-12 h-12 text-gray-300" />
                  <div className="text-right">
                    <p className="text-gray-500">Date:</p>
                    <p>{selectedCert.issue_date}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t">
              <button onClick={() => handleDownloadPDF(selectedCert)} disabled={downloading} className="btn btn-primary w-full">
                <Download className="w-4 h-4 inline mr-2" /> {downloading ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
