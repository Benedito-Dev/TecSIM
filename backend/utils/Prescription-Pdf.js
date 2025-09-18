const { jsPDF } = require('jspdf');

const formatarData = (dataString) => {
  if (!dataString) return 'Não informado';
  const data = new Date(dataString);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

const generatePrescriptionPDF = (prescricao) => {
  const doc = new jsPDF();
  let y = 25;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;

  // --- CABEÇALHO ---
  doc.setFontSize(20).setFont(undefined, 'bold');
  doc.text('Prescrição Médica', pageWidth / 2, y, { align: 'center' });
  y += 8;

  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;

  // --- DADOS PRINCIPAIS ---
  doc.setFontSize(12).setFont(undefined, 'bold');
  doc.text('Diagnóstico:', margin, y);
  doc.setFont(undefined, 'normal');
  const diagnostico = prescricao.diagnostico || 'Não informado';
  const diagnosticoLines = doc.splitTextToSize(diagnostico, contentWidth - 30);
  doc.text(diagnosticoLines, margin + 30, y);
  y += diagnosticoLines.length * 7 + 5;

  doc.setFont(undefined, 'bold').text('CRM:', margin, y);
  doc.setFont(undefined, 'normal').text(prescricao.crm || 'Não informado', margin + 15, y);
  y += 8;

  doc.setFont(undefined, 'bold').text('Data da Prescrição:', margin, y);
  doc.setFont(undefined, 'normal').text(formatarData(prescricao.data_prescricao), margin + 50, y);
  y += 8;

  doc.setFont(undefined, 'bold').text('Validade:', margin, y);
  doc.setFont(undefined, 'normal').text(formatarData(prescricao.validade), margin + 30, y);
  y += 15;

  // --- SEÇÃO DE MEDICAMENTOS ---
  doc.setFontSize(14).setFont(undefined, 'bold');
  doc.text('Medicamentos Prescritos', pageWidth / 2, y, { align: 'center' });
  y += 10;

  doc.setFontSize(12);
  if (prescricao.medicamentos && prescricao.medicamentos.length > 0) {
    prescricao.medicamentos.forEach((med, i) => {
      if (y > 260) { // quebra de página
        doc.addPage();
        y = 25;
      }

      doc.setFont(undefined, 'bold').text(`${i + 1}. ${med.nome}`, margin, y);
      y += 6;

      doc.setFont(undefined, 'normal');
      doc.text(`   • Dosagem: ${med.dosagem || 'Não informada'}`, margin, y);
      y += 6;
      doc.text(`   • Frequência: ${med.frequencia || '?'}x ao dia`, margin, y);
      y += 6;
      doc.text(`   • Duração: ${med.duracao_dias || '?'} dias`, margin, y);
      y += 6;
      doc.text(`   • Via: ${med.via || 'Não informada'}`, margin, y);
      y += 10;
    });
  } else {
    doc.setFont(undefined, 'normal');
    doc.text('Nenhum medicamento prescrito.', margin, y);
    y += 10;
  }

  // --- ESPAÇO PARA ASSINATURA ---
  y = doc.internal.pageSize.getHeight() - 50;
  doc.setLineWidth(0.2);
  doc.line(pageWidth / 2 - 40, y, pageWidth / 2 + 40, y);
  doc.setFontSize(12).setFont(undefined, 'normal');
  doc.text('Assinatura do Médico', pageWidth / 2, y + 8, { align: 'center' });

  // --- RODAPÉ ---
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(10).setFont(undefined, 'italic');
  doc.text(
    'Documento gerado automaticamente pelo Sistema de Prescrições',
    pageWidth / 2,
    footerY,
    { align: 'center' }
  );

  return Buffer.from(doc.output('arraybuffer'));
};

module.exports = generatePrescriptionPDF;
