import { ComplaintTicket, Technician, ServiceCentre } from '../types';

/**
 * Format clean, professional WhatsApp message to technician
 */
export function generateTechnicianWhatsAppText(
  ticket: ComplaintTicket,
  technician?: Technician | ServiceCentre
): string {
  const techName = technician?.name || 'Technician';
  const warrantyLabel = ticket.warrantyStatus === 'In Warranty' ? '✅ IN WARRANTY' : '⚠️ OUT OF WARRANTY';
  const typeLabel = ticket.complaintType === 'Home Visit' ? '🏠 HOME VISIT (On-Site)' : '🏢 SHOP REPAIR';

  const lines = [
    `*🔧 SINGH ELECTRONICS, KORBA - JOB ASSIGNMENT*`,
    `----------------------------------------`,
    `Hello *${techName}*, a new service job has been assigned to you.`,
    ``,
    `*📋 Ticket No:* ${ticket.ticketNumber}`,
    `*📅 Date:* ${ticket.date}`,
    `*📍 Job Type:* ${typeLabel}`,
    `*🏷️ Warranty:* ${warrantyLabel}`,
    ticket.companyLoginNumber ? `*🏢 Company Portal ID:* ${ticket.companyLoginNumber}` : '',
    ``,
    `*👤 CUSTOMER DETAILS:*`,
    `• Name: *${ticket.customerName}*`,
    `• Mobile: *${ticket.mobile}*${ticket.alternateMobile ? ` / ${ticket.alternateMobile}` : ''}`,
    `• Address: ${ticket.address} (Area: ${ticket.area})`,
    ``,
    `*📺 PRODUCT & PROBLEM:*`,
    `• Product: ${ticket.brand} ${ticket.productCategory}`,
    `• Model: ${ticket.model || 'N/A'}`,
    ticket.serialNumber ? `• Serial No: ${ticket.serialNumber}` : '',
    ticket.accessoriesReceived.length > 0 ? `• Accessories: ${ticket.accessoriesReceived.join(', ')}` : '',
    `• Problem: *${ticket.problemDescription}*`,
    ticket.remarks ? `• Notes: ${ticket.remarks}` : '',
    ``,
    `*🎯 Status:* ${ticket.status}`,
    `*⏰ Follow-up:* ${ticket.followUp?.followUpDate || 'Today'}`,
    `----------------------------------------`,
    `Please inspect promptly and update diagnosis / estimate in the portal.`,
    `Singh Electronics, Kosabadi, Korba | +91 98261 99880`
  ].filter(Boolean);

  return lines.join('\n');
}

/**
 * Format clean, professional WhatsApp message to Customer
 */
export function generateCustomerWhatsAppText(ticket: ComplaintTicket): string {
  let statusDetail = '';
  if (ticket.status === 'Ready' || ticket.status === 'Customer Informed') {
    statusDetail = `🎉 *Good news!* Your ${ticket.brand} ${ticket.productCategory} has been repaired and is tested OK. It is ready for delivery / pickup. Total payable: ₹${ticket.billing.balanceAmount}.`;
  } else if (ticket.status === 'Customer Approval Pending') {
    statusDetail = `🔍 *Diagnosis Complete:* Estimate for repair is ₹${ticket.diagnosis.estimateAmount || ticket.billing.customerAmount}. Problem: ${ticket.diagnosis.faultFound || ticket.problemDescription}. Please reply with your approval.`;
  } else if (ticket.status === 'Parts Pending') {
    statusDetail = `⏳ *Update:* We have ordered genuine replacement parts for your ${ticket.brand} ${ticket.productCategory}. Tentative ready date is ${ticket.diagnosis.tentativeReadyDate || '2-3 days'}.`;
  } else if (ticket.status === 'Delivered' || ticket.status === 'Closed') {
    statusDetail = `✅ *Delivered:* Thank you for choosing Singh Electronics, Korba! Your ticket ${ticket.ticketNumber} is closed. For any query, call us at 07759-224488.`;
  } else {
    statusDetail = `We have registered your service complaint. Our technician is attending to your request. Current status: *${ticket.status}*.`;
  }

  const lines = [
    `*SINGH ELECTRONICS, KORBA*`,
    `_Sales & Multi-Brand Service Care_`,
    `----------------------------------------`,
    `Dear *${ticket.customerName}*,`,
    ``,
    `Update on your service ticket: *${ticket.ticketNumber}*`,
    `Product: *${ticket.brand} ${ticket.productCategory} (${ticket.model})*`,
    ``,
    statusDetail,
    ``,
    `*📍 Shop Address:* Near Old Bus Stand, Kosabadi Main Road, Korba (C.G.)`,
    `*📞 Helpline:* +91 98261 99880 / 07759-224488`,
    `Thank you for trusting Singh Electronics!`
  ];

  return lines.join('\n');
}

/**
 * Open WhatsApp Web or Mobile link
 */
export function openWhatsApp(phone: string, text: string) {
  // Clean phone number: remove non-digits
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const encodedText = encodeURIComponent(text);
  const url = `https://wa.me/${formattedPhone}?text=${encodedText}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
