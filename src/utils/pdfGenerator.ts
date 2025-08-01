import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface PresupuestoData {
  id: number
  codigo: string
  descripcion: string
  person: {
    id: number
    nombre: string
    direccion: string
    ciudad: string
    pais: string
    rut: string
  }
  items: Array<{
    descripcion: string
    cantidad: number
    precioUnitario: number
    precioTotal: number
  }>
  baseImponible: number
  iva: number
  precioLiquido: number
  status: string
  fechaElaboracion: string
  fechaVencimiento: string
}

export const generatePresupuestoPDF = async (presupuesto: PresupuestoData) => {
  const doc = new jsPDF()

  // Colors
  const primaryColor = [64, 64, 64] // Dark gray
  const secondaryColor = [128, 128, 128] // Light gray
  const accentColor = [0, 0, 0] // Black

  // Header background
  doc.setFillColor(240, 240, 240)
  doc.rect(0, 0, 210, 60, "F")

  // VENCHI Logo placeholder (you can replace with actual logo)
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text("VENCHI", 20, 25)
  doc.setFontSize(8)
  doc.text("SPA", 20, 35)

  // Company info (right side)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Distribuidora Venchi SPA", 210 - 20, 25, { align: "right" })
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text("Chile", 210 - 20, 35, { align: "right" })

  // Client information
  let yPos = 70
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`${presupuesto.person.nombre}`, 20, yPos)
  doc.text(`${presupuesto.person.direccion}`, 20, yPos + 5)
  doc.text(`${presupuesto.person.ciudad}`, 20, yPos + 10)
  doc.text(`${presupuesto.person.pais}`, 20, yPos + 15)
  doc.text(`RUT: ${presupuesto.person.rut}`, 20, yPos + 20)

  // Budget number (right side)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text(`Presupuesto # ${presupuesto.codigo}`, 210 - 20, yPos + 10, { align: "right" })

  // Date information box
  yPos += 35
  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(0.5)
  doc.rect(20, yPos, 170, 15)

  // Date headers
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.text("Fecha del presupuesto", 25, yPos + 5)
  doc.text("Vencimiento", 80, yPos + 5)
  doc.text("Comercial", 135, yPos + 5)

  // Date values
  doc.setFont("helvetica", "normal")
  doc.text(new Date(presupuesto.fechaElaboracion).toLocaleDateString("es-CL"), 25, yPos + 10)
  doc.text(new Date(presupuesto.fechaVencimiento).toLocaleDateString("es-CL"), 80, yPos + 10)
  doc.text("DISTRIBUIDORA VENCHI SPA", 135, yPos + 10)

  // Products table
  yPos += 25

  const tableData = presupuesto.items.map((item) => [
    item.descripcion,
    `${item.cantidad.toFixed(2)} Unidades`,
    `$${item.precioUnitario.toLocaleString("es-CL")}`,
    `$${item.precioTotal.toLocaleString("es-CL")}`,
  ])

  autoTable(doc, {
    startY: yPos,
    head: [["DESCRIPCIÓN", "CANTIDAD", "PRECIO UNITARIO", "IMPORTE"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [64, 64, 64],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [0, 0, 0],
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 30, halign: "center" },
      2: { cellWidth: 30, halign: "right" },
      3: { cellWidth: 30, halign: "right" },
    },
    margin: { left: 20, right: 20 },
  })

  // Get the final Y position after the table
  const finalY = (doc as any).lastAutoTable.finalY + 10

  // Totals section
  const totalsX = 210 - 80
  doc.setFillColor(240, 240, 240)
  doc.rect(totalsX, finalY, 60, 25, "F")
  doc.setDrawColor(0, 0, 0)
  doc.rect(totalsX, finalY, 60, 25)

  // Totals text
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.text("Base Imponible", totalsX + 5, finalY + 7)
  doc.text("IVA 19%", totalsX + 5, finalY + 14)

  doc.setFont("helvetica", "bold")
  doc.setFillColor(64, 64, 64)
  doc.rect(totalsX, finalY + 17, 60, 8, "F")
  doc.setTextColor(255, 255, 255)
  doc.text("Total", totalsX + 5, finalY + 23)

  // Totals values
  doc.setTextColor(0, 0, 0)
  doc.setFont("helvetica", "normal")
  doc.text(`$${presupuesto.baseImponible.toLocaleString("es-CL")}`, totalsX + 55, finalY + 7, { align: "right" })
  doc.text(`$${presupuesto.iva.toLocaleString("es-CL")}`, totalsX + 55, finalY + 14, { align: "right" })

  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.text(`$${presupuesto.precioLiquido.toLocaleString("es-CL")}`, totalsX + 55, finalY + 23, { align: "right" })

  // Terms and conditions
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.text("Términos y condiciones: https://distribuidora-venchi-spa.odoo.com/terms", 20, finalY + 40)

  // Save the PDF
  doc.save(`Presupuesto_${presupuesto.codigo}.pdf`)
}
