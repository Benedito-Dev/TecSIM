import jsPDF from 'jspdf';

// Função auxiliar para formatar data
const formatarData = (dataString) => {
  const data = new Date(dataString);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

export const generatePrescriptionPDF = (prescricao) => {
  const doc = new jsPDF();

  // --- seu layout exatamente como já está ---
  let yPosition = 20;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - (margin * 2);

  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('PRESCRIÇÃO MÉDICA', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 15;

  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');

  doc.setFont(undefined, 'bold');
  doc.text('Diagnóstico:', margin, yPosition);
  doc.setFont(undefined, 'normal');
  const diagnosticoLines = doc.splitTextToSize(prescricao.diagnostico || 'Não informado', contentWidth);
  doc.text(diagnosticoLines, margin + 25, yPosition);
  yPosition += diagnosticoLines.length * 7;

  doc.setFont(undefined, 'bold');
  doc.text('CRM:', margin, yPosition);
  doc.setFont(undefined, 'normal');
  doc.text(prescricao.crm || 'Não informado', margin + 15, yPosition);
  yPosition += 8;

  doc.setFont(undefined, 'bold');
  doc.text('Data:', margin, yPosition);
  doc.setFont(undefined, 'normal');
  doc.text(formatarData(prescricao.data_prescricao), margin + 18, yPosition);
  yPosition += 8;

  doc.setFont(undefined, 'bold');
  doc.text('Validade:', margin, yPosition);
  doc.setFont(undefined, 'normal');
  doc.text(formatarData(prescricao.validade), margin + 25, yPosition);
  yPosition += 15;

  if (yPosition > 200) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('MEDICAMENTOS PRESCRITOS', margin, yPosition);
  yPosition += 10;

  if (prescricao.medicamentos && prescricao.medicamentos.length > 0) {
    prescricao.medicamentos.forEach((med, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`${index + 1}. ${med.nome}`, margin, yPosition);
      yPosition += 7;

      doc.setFont(undefined, 'normal');
      doc.text(`   Dosagem: ${med.dosagem || 'Não informada'}`, margin, yPosition);
      yPosition += 6;
      doc.text(`   Frequência: ${med.frequencia}x ao dia`, margin, yPosition);
      yPosition += 6;
      doc.text(`   Duração: ${med.duracao_dias} dias`, margin, yPosition);
      yPosition += 6;
      doc.text(`   Via: ${med.via || 'Não informada'}`, margin, yPosition);
      yPosition += 10;
    });
  } else {
    doc.text('Nenhum medicamento prescrito', margin, yPosition);
    yPosition += 10;
  }

  const footerY = 280;
  doc.setFontSize(10);
  doc.text('Documento gerado automaticamente - Sistema de Prescrições', pageWidth / 2, footerY, { align: 'center' });

  // 🎯 AQUI: pegue direto como data URI (base64)
  const dataUri = doc.output('datauristring'); // "data:application/pdf;...;base64,JVBERi0xLjcK..."
  const base64 = dataUri.split(',')[1];       // só o trecho base64
  return base64;
};
