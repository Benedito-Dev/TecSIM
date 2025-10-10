import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const downloadPDF = async (pdfBase64, filename) => {
  try {
    const path = `${FileSystem.documentDirectory}${filename}.pdf`;

    await FileSystem.writeAsStringAsync(path, pdfBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(path);
    }

    return path;
  } catch (error) {
    console.error('Erro ao baixar PDF:', error);
    throw error;
  }
};
