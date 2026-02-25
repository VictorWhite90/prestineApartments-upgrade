import { jsPDF } from 'jspdf'

const BRAND_ORANGE = [212, 107, 8]
const BRAND_ORANGE_LIGHT = [255, 237, 213]
const DARK = [31, 31, 31]
const GRAY = [100, 100, 100]
const LIGHT_GRAY = [240, 240, 240]
const GREEN = [22, 163, 74]
const WHITE = [255, 255, 255]

const fmt = (amount) =>
  amount !== undefined && amount !== null
    ? 'NGN ' + Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })
    : 'NGN 0.00'

const fmtDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
}

const fmtDateTime = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

const loadImageAsBase64 = async (url) => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

export const generateReceipt = async (booking) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 15
  const contentW = pageW - margin * 2
  // Left column width for labels, right column starts here
  const labelW = contentW * 0.55
  const valueX = margin + labelW

  // ── HEADER BAND ──────────────────────────────────────────────────────────
  doc.setFillColor(...BRAND_ORANGE)
  doc.rect(0, 0, pageW, 36, 'F')

  // Logo (smaller)
  const logoBase64 = await loadImageAsBase64('/images/loggoo.png')
  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', margin, 5, 18, 18)
  }

  // Company name
  doc.setTextColor(...WHITE)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Prestine Apartments', margin + 22, 14)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.text('Premium Short-Let & Serviced Apartments', margin + 22, 20)

  // PAYMENT RECEIPT label (right side)
  const isGroup = booking.unit_count > 1
  const unitCount = isGroup ? booking.unit_count : 1
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('PAYMENT RECEIPT', pageW - margin, 16, { align: 'right' })
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.text('Official Booking Receipt', pageW - margin, 22, { align: 'right' })

  // ── RECEIPT META ─────────────────────────────────────────────────────────
  doc.setFillColor(...BRAND_ORANGE_LIGHT)
  doc.rect(0, 36, pageW, 12, 'F')

  doc.setTextColor(...DARK)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  const receiptNo = `PRA-${(booking.id || '').substring(0, 8).toUpperCase()}`
  doc.text(`Receipt No: ${receiptNo}`, margin, 44)
  const paymentDateStr = fmtDateTime(booking.paymentDate || booking.updatedAt)
  doc.text(`Payment Date: ${paymentDateStr}`, pageW - margin, 44, { align: 'right' })

  let y = 56

  // ── HELPERS ───────────────────────────────────────────────────────────────
  const drawSection = (title, startY) => {
    doc.setFillColor(...BRAND_ORANGE)
    doc.rect(margin, startY, contentW, 7, 'F')
    doc.setTextColor(...WHITE)
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'bold')
    doc.text(title, margin + 3, startY + 5)
    return startY + 7
  }

  const drawRow = (label, value, rowY, shade = false) => {
    if (shade) {
      doc.setFillColor(...LIGHT_GRAY)
      doc.rect(margin, rowY, contentW, 7, 'F')
    }
    // Label
    doc.setTextColor(...GRAY)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(label, margin + 3, rowY + 5)
    // Value — clipped to value column, right-aligned
    const valStr = String(value ?? 'N/A')
    doc.setTextColor(...DARK)
    doc.setFont('helvetica', 'bold')
    // Clip value to fit within right column (max width = labelW - 6 chars padding)
    const maxValW = contentW - labelW - 4
    const fitted = doc.splitTextToSize(valStr, maxValW)[0]
    doc.text(fitted, pageW - margin - 3, rowY + 5, { align: 'right' })
    return rowY + 7
  }

  // ── GUEST INFORMATION ────────────────────────────────────────────────────
  y = drawSection('GUEST INFORMATION', y)
  const guestName = `${booking.user_title || ''} ${booking.first_name || ''} ${booking.last_name || ''}`.trim()
  y = drawRow('Full Name', guestName, y, false)
  y = drawRow('Email Address', booking.user_email || 'N/A', y, true)
  y = drawRow('Phone Number', booking.user_phone || 'N/A', y, false)

  y += 5

  // ── BOOKING DETAILS ───────────────────────────────────────────────────────
  y = drawSection('BOOKING DETAILS', y)
  y = drawRow('Apartment', booking.apartment_name || 'N/A', y, false)
  if (isGroup) {
    y = drawRow('Number of Apartments', `${booking.unit_count} Apartments`, y, true)
  }
  y = drawRow('Check-In Date', fmtDate(booking.checkin_date), y, isGroup ? false : true)
  y = drawRow('Check-Out Date', fmtDate(booking.checkout_date), y, true)
  y = drawRow('Number of Nights', `${booking.total_nights || 'N/A'} night(s)`, y, false)
  y = drawRow('Number of Guests', `${booking.guest_number || 'N/A'} guest(s)`, y, true)
  if (isGroup) {
    y = drawRow('Group Reference', booking.group_booking_id || 'N/A', y, false)
  }
  y = drawRow('Booking Reference', receiptNo, y, isGroup ? true : false)

  y += 5

  // ── PAYMENT BREAKDOWN ─────────────────────────────────────────────────────
  y = drawSection('PAYMENT BREAKDOWN', y)

  // All amounts shown as group totals (×unitCount) so the receipt covers the full booking
  const hasNegotiated = booking.negotiated_price && booking.negotiated_price > 0

  y = drawRow('Rate per Night', fmt(booking.price_per_night || booking.room_rate), y, false)
  y = drawRow('Subtotal', fmt((booking.subtotal || 0) * unitCount), y, true)

  if (hasNegotiated) {
    // Original total with strikethrough
    doc.setFillColor(...LIGHT_GRAY)
    doc.rect(margin, y, contentW, 7, 'F')
    doc.setTextColor(...GRAY)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Original Total', margin + 3, y + 5)
    const origStr = fmt((booking.grand_total || 0) * unitCount)
    doc.setTextColor(160, 160, 160)
    doc.setFont('helvetica', 'bold')
    doc.text(origStr, pageW - margin - 3, y + 5, { align: 'right' })
    const strW = doc.getTextWidth(origStr)
    doc.setDrawColor(160, 160, 160)
    doc.setLineWidth(0.3)
    doc.line(pageW - margin - 3 - strW, y + 3.5, pageW - margin - 3, y + 3.5)
    y += 7

    // Negotiated / agreed price (group total)
    doc.setFillColor(219, 234, 254)
    doc.rect(margin, y, contentW, 7, 'F')
    doc.setTextColor(29, 78, 216)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Agreed / Negotiated Price', margin + 3, y + 5)
    doc.setFont('helvetica', 'bold')
    doc.text(fmt((booking.negotiated_price || 0) * unitCount), pageW - margin - 3, y + 5, { align: 'right' })
    y += 7
  } else {
    y = drawRow('Total', fmt((booking.grand_total || 0) * unitCount), y, false)
  }

  // Amount paid (group total)
  doc.setFillColor(220, 252, 231)
  doc.rect(margin, y, contentW, 8, 'F')
  doc.setTextColor(...GREEN)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('Amount Paid', margin + 3, y + 5.5)
  doc.text(fmt((booking.amount_paid || 0) * unitCount), pageW - margin - 3, y + 5.5, { align: 'right' })
  y += 8

  // Balance (group total)
  const balance = (booking.balance ?? 0) * unitCount
  const balColor = balance > 0 ? [212, 107, 8] : [...GREEN]
  doc.setFillColor(balance > 0 ? 255 : 220, balance > 0 ? 237 : 252, balance > 0 ? 213 : 231)
  doc.rect(margin, y, contentW, 8, 'F')
  doc.setTextColor(...balColor)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('Balance Remaining', margin + 3, y + 5.5)
  doc.text(fmt(balance), pageW - margin - 3, y + 5.5, { align: 'right' })
  y += 8

  y += 10

  // ── DIVIDER ───────────────────────────────────────────────────────────────
  doc.setDrawColor(...BRAND_ORANGE)
  doc.setLineWidth(0.5)
  doc.line(margin, y, pageW - margin, y)

  // ── FOOTER ───────────────────────────────────────────────────────────────
  doc.setFillColor(...BRAND_ORANGE)
  doc.rect(0, pageH - 20, pageW, 20, 'F')
  doc.setTextColor(...WHITE)
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.text('Thank you for choosing Prestine Apartments. We look forward to hosting you!', pageW / 2, pageH - 12, { align: 'center' })
  doc.setFont('helvetica', 'bold')
  doc.text('Support@prestineapartment.com   |   +234 0802 982 3593', pageW / 2, pageH - 6, { align: 'center' })

  // ── DOWNLOAD ─────────────────────────────────────────────────────────────
  const safeName = `${booking.first_name || ''}-${booking.last_name || ''}`.replace(/\s+/g, '-')
  doc.save(`Receipt-${safeName}-${receiptNo}.pdf`)
}
