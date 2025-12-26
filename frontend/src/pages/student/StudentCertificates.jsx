import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Award, Download, QrCode, CheckCircle, Clock, Printer } from 'lucide-react'
import { downloadCertificatePDF } from '../../utils/generateCertificatePDF'

const mockCertificates = [
  { id: 1, certificate_number: 'THE-2024-000123', type: 'theory_exam', issue_date: '2024-12-15', expiry_date: '2025-12-15', is_valid: true },
]

const pendingCertificates = [
  { type: 'practical_exam', name: 'Practical Driving Exam', requirement: 'Complete all practical hours' },
  { type: 'completion', name: 'Course Completion', requirement: 'Pass all exams' },
  { type: 'lto_ready', name: 'LTO Ready Certificate', requirement: 'Complete full course' },
]

export default function StudentCertificates() {
  const { user } = useAuth()
  const [showPreview, setShowPreview] = useState(false)
  const [selectedCert, setSelectedCert] = useState(null)
  const [downloading, setDownloading] = useState(false)

  const getCertTypeName = (type) => {
    const names = {
      completion: 'Course Completion',
      theory_exam: 'Theoretical Driving Course (TDC)',
      practical_exam: 'Practical Driving Course (PDC)',
      lto_ready: 'LTO Ready Certificate'
    }
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

  const printCertificate = () => {
    window.print()
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Certificates</h1>
        <p className="text-gray-500">View and download your earned certificates</p>
      </div>

      {/* Earned Certificates */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" /> Earned Certificates
        </h2>
        {mockCertificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockCertificates.map((cert) => (
              <div key={cert.id} className="card border-2 border-green-200 bg-green-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="badge badge-success">Valid</span>
                </div>
                <h3 className="font-semibold text-lg">{getCertTypeName(cert.type)}</h3>
                <p className="text-sm text-gray-500 font-mono">{cert.certificate_number}</p>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Issued: {cert.issue_date}</p>
                  <p>Expires: {cert.expiry_date}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => viewCertificate(cert)}
                    className="btn btn-secondary flex-1 flex items-center justify-center gap-2"
                  >
                    <QrCode className="w-4 h-4" /> View
                  </button>
                  <button 
                    onClick={() => handleDownloadPDF(cert)}
                    disabled={downloading}
                    className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> {downloading ? 'Generating...' : 'Download PDF'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-8">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No certificates earned yet</p>
          </div>
        )}
      </div>

      {/* Pending Certificates */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-500" /> Pending Certificates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pendingCertificates.map((cert, i) => (
            <div key={i} className="card border border-dashed border-gray-300 bg-gray-50">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="font-semibold">{cert.name}</h3>
              <p className="text-sm text-gray-500 mt-2">{cert.requirement}</p>
              <div className="mt-4">
                <span className="badge bg-gray-200 text-gray-600">Pending</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Preview Modal */}
      {showPreview && selectedCert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl m-4">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Certificate Preview</h2>
              <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="p-8" id="certificate-content">
              <div className="border-4 border-double border-green-600 p-8 text-center bg-gradient-to-b from-green-50 to-white">
                <div className="mb-4">
                  <h1 className="text-3xl font-bold text-green-800">PasaHero</h1>
                  <p className="text-sm text-gray-600">Smart Driving School</p>
                </div>
                <div className="my-8">
                  <p className="text-lg text-gray-600 mb-2">This is to certify that</p>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.name || 'Student Name'}</h2>
                  <p className="text-gray-600">has successfully completed the</p>
                  <h3 className="text-xl font-semibold text-green-700 mt-2">{getCertTypeName(selectedCert.type)}</h3>
                </div>
                <div className="flex justify-between items-end mt-8">
                  <div className="text-left">
                    <p className="text-sm text-gray-500">Certificate No:</p>
                    <p className="font-mono">{selectedCert.certificate_number}</p>
                  </div>
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-gray-400" />
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
                disabled={downloading}
                className="btn btn-primary flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> {downloading ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
