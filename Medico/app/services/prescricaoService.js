import api from '../api/api';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from "react-native";
import { IP_HOST } from '@env';

// 🟢 [GET] Lista todas as prescrições
export const getPrescricoes = async () => {
  try {
    const response = await api.get('/prescricoes');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar prescrições:', error.message);
    throw error;
  }
};

// 🟢 [GET] Busca prescrição por ID
export const getPrescricaoById = async (id) => {
  try {
    const response = await api.get(`/prescricoes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar prescrição ID ${id}:`, error.message);
    throw error;
  }
};

// 🟢 [GET] Busca prescrições por paciente
export const getPrescricoesByPaciente = async (id_paciente) => {
  try {
    const response = await api.get(`/prescricoes/paciente/${id_paciente}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar prescrições do paciente ${id_paciente}:`, error.message);
    throw error;
  }
};

// 🟢 [GET] Busca prescrições por médico
export const getPrescricoesByMedico = async (crm) => {
  try {
    const response = await api.get(`/prescricoes/medico/${crm}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar prescrições do médico ${crm}:`, error.message);
    throw error;
  }
};

// 🟡 [POST] Cria uma nova prescrição
export const createPrescricao = async (prescricaoData) => {
  try {
    const response = await api.post('/prescricoes', prescricaoData);
    return response.data;
  } catch (error) {
    if (error.response) {
      const errorMsg = error.response.data.error || 'Erro ao criar prescrição';
      console.error('Erro detalhado:', errorMsg);
      throw new Error(errorMsg);
    } else if (error.request) {
      throw new Error('Sem resposta do servidor');
    } else {
      throw new Error('Erro ao configurar a requisição');
    }
  }
};

// 🟠 [PUT] Atualiza uma prescrição existente
export const updatePrescricao = async (id, prescricaoData) => {
  try {
    const response = await api.put(`/prescricoes/${id}`, prescricaoData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar prescrição ID ${id}:`, error.message);
    throw error;
  }
};

// 🔴 [DELETE] Remove uma prescrição
export const deletePrescricao = async (id) => {
  try {
    const response = await api.delete(`/prescricoes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar prescrição ID ${id}:`, error.message);
    throw error;
  }
};

// 📄 [GET] Download do PDF da prescrição
export const downloadPrescricao = async (id) => {
  try {
    // Versão Web
    if (Platform.OS === "web") {
      // 🌐 Web: cria um link temporário e dispara o download
      const response = await fetch(`http://${IP_HOST}:3000/prescricoes/${id}/download`);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `prescricao_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      console.log("PDF baixado no navegador");
      return `prescricao_${id}.pdf`;
    } else { // Versão mobile
      // 📱 Mobile: usa FileSystem + Sharing
      const fileUri = `${FileSystem.documentDirectory}prescricao_${id}.pdf`;
      const downloadResult = await FileSystem.downloadAsync(
        `http://${IP_HOST}:3000/prescricoes/${id}/download`,
        fileUri
      );

      console.log("PDF salvo em:", downloadResult.uri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadResult.uri);
      }

      return downloadResult.uri;
    }
  } catch (error) {
    console.error(`Erro ao baixar PDF da prescrição ${id}:`, error);
    throw error;
  }
};