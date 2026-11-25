import jsPDF from "jspdf";
import type { Transaction } from "@/types/banking";

export const downloadTransactionReceiptPDF = (txn: Transaction) => {
  const doc = new jsPDF();

  // Header
  doc.setFillColor(13, 13, 15);
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 90, 31);
  doc.setFontSize(22);
  doc.text("NOVABANK", 20, 22);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text("OFFICIAL TRANSACTION RECEIPT", 20, 31);

  // Body Details
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(12);

  let y = 60;
  const rows = [
    ["Transaction Reference:", txn.transactionId],
    ["Date & Time:", new Date(txn.createdAt).toLocaleString()],
    ["Transaction Type:", txn.transactionType.replace("_", " ").toUpperCase()],
    ["Amount:", `$${Number(txn.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`],
    ["Transaction Fee:", `$${Number(txn.transactionFee).toFixed(2)}`],
    ["Status:", txn.status.toUpperCase()],
    ["Description:", txn.description || "N/A"],
    ["System Reference:", txn.reference || "N/A"],
  ];

  rows.forEach(([label, val]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(String(val), 80, y);
    y += 12;
  });

  // Footer
  doc.setDrawColor(220, 220, 220);
  doc.line(20, y + 10, 190, y + 10);
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "This is an electronically generated receipt by NovaBank Digital Banking System.",
    20,
    y + 20
  );

  doc.save(`receipt-${txn.transactionId}.pdf`);
};

