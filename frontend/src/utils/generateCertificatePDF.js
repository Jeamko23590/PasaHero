import { jsPDF } from 'jspdf'

export function generateCertificatePDF(cert, studentName) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Border
  doc.setDrawColor(34, 139, 34)
  doc.setLineWidth(3)
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20)
  doc.setLineWidth(1)
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30)

  // Header
  doc.setFontSize(36)
  doc.setTextColor(34, 139, 34)
  doc.setFont('helvetica', 'bold')
  doc.text('PasaHero', pageWidth / 2, 38, { align: 'center' })

  doc.setFontSize(14)
  doc.setTextColor(100, 100, 100)
  doc.setFont('helvetica', 'normal')
  doc.text('Smart Driving School', pageWidth / 2, 47, { align: 'center' })

  // Certificate Title
  doc.setFontSize(28)
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'bold')
  doc.text('CERTIFICATE', pageWidth / 2, 65, { align: 'center' })

  // Certificate Type
  const certTypes = {
    completion: 'of Course Completion',
    theory_exam: 'of Theoretical Driving Course (TDC)',
    practical_exam: 'of Practical Driving Course (PDC)',
    lto_ready: 'LTO Ready Certificate'
  }
  doc.setFontSize(18)
  doc.setFont('helvetica', 'italic')
  doc.text(certTypes[cert.type] || 'of Completion', pageWidth / 2, 76, { align: 'center' })

  // Body text
  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(60, 60, 60)
  doc.text('This is to certify that', pageWidth / 2, 92, { align: 'center' })

  // Student Name
  doc.setFontSize(26)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text(studentName, pageWidth / 2, 106, { align: 'center' })

  // Underline for name
  const nameWidth = doc.getTextWidth(studentName)
  doc.setDrawColor(34, 139, 34)
  doc.setLineWidth(0.5)
  doc.line((pageWidth - nameWidth) / 2, 109, (pageWidth + nameWidth) / 2, 109)

  // Completion text
  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(60, 60, 60)
  doc.text('has successfully completed the requirements for the above certification', pageWidth / 2, 120, { align: 'center' })
  doc.text('and is hereby granted this certificate.', pageWidth / 2, 128, { align: 'center' })

  // Certificate details
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  
  // Left side - Certificate Number
  doc.setFont('helvetica', 'normal')
  doc.text('Certificate No:', 40, 145)
  doc.setFont('helvetica', 'bold')
  doc.text(cert.certificate_number, 40, 151)

  // Center - Signature
  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(0.3)
  doc.line(pageWidth / 2 - 35, 150, pageWidth / 2 + 35, 150)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('Authorized Signature', pageWidth / 2, 155, { align: 'center' })

  // Right side - Dates
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Issue Date: ' + cert.issue_date, pageWidth - 70, 145)
  doc.text('Valid Until: ' + cert.expiry_date, pageWidth - 70, 151)

  // Footer - separate section at bottom
  doc.setFontSize(8)
  doc.setTextColor(130, 130, 130)
  doc.text('This certificate is computer-generated and valid for LTO application purposes.', pageWidth / 2, 170, { align: 'center' })
  doc.text('Verify at: www.pasahero.com/verify/' + cert.certificate_number, pageWidth / 2, 175, { align: 'center' })

  return doc
}

export function downloadCertificatePDF(cert, studentName) {
  const doc = generateCertificatePDF(cert, studentName)
  doc.save(`${cert.certificate_number}.pdf`)
}
