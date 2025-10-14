const CompositionRepository = require('../../repository/openEHR/CompositionRepository');
const PacienteService = require('../pacientesService');

class CompositionService {
  constructor() {
    this.compositionRepo = new CompositionRepository();
  }

  async createComposition(compositionData) {
    try {
      const paciente = await PacienteService.getById(compositionData.paciente_id);
      if (!paciente) {
        throw new Error('Paciente não encontrado');
      }

      console.log('✅ Paciente validado:', paciente.nome);

      const validationErrors = this.validateCompositionData(compositionData);
      if (validationErrors.length > 0) {
        throw new Error(`Dados inválidos: ${validationErrors.join(', ')}`);
      }

      await this.validateTemplateData(compositionData.template_id, compositionData.composition_data);

      const composition = await this.compositionRepo.create(compositionData);
      return composition;

    } catch (error) {
      throw new Error(`Erro ao criar composição: ${error.message}`);
    }
  }

  async getComposition(compositionId) {
    try {
      console.log('🔍 Service - Buscando composição:', compositionId);
      
      const composition = await this.compositionRepo.findById(compositionId);
      if (!composition) {
        throw new Error('Composição não encontrada');
      }
      
      console.log('✅ Composição encontrada:', composition.composition_id);
      return composition;
      
    } catch (error) {
      console.error('❌ Erro no Service - getComposition:', error);
      throw new Error(`Erro ao buscar composição: ${error.message}`);
    }
  }

  async getPatientCompositions(pacienteId, filters = {}) {
    try {
      await PacienteService.getById(pacienteId);
      return await this.compositionRepo.findByPatientId(pacienteId, filters);
    } catch (error) {
      throw new Error(`Erro ao buscar composições do paciente: ${error.message}`);
    }
  }

  async updateComposition(compositionId, updateData) {
    try {
      const existing = await this.getComposition(compositionId);
      
      const validationErrors = this.validateCompositionData(updateData, true);
      if (validationErrors.length > 0) {
        throw new Error(`Dados de atualização inválidos: ${validationErrors.join(', ')}`);
      }

      return await this.compositionRepo.update(compositionId, updateData);

    } catch (error) {
      throw new Error(`Erro ao atualizar composição: ${error.message}`);
    }
  }

  async deleteComposition(compositionId) {
    try {
      await this.getComposition(compositionId);
      return await this.compositionRepo.delete(compositionId);
    } catch (error) {
      throw new Error(`Erro ao deletar composição: ${error.message}`);
    }
  }

  async getPatientClinicalSummary(pacienteId) {
    try {
      await PacienteService.getById(pacienteId);

      const [compositions, summary] = await Promise.all([
        this.compositionRepo.findByPatientId(pacienteId, { limit: 10 }),
        this.compositionRepo.getPatientClinicalSummary(pacienteId)
      ]);

      return {
        paciente_id: pacienteId,
        total_compositions: compositions.length,
        clinical_summary: summary,
        recent_compositions: compositions,
        last_update: compositions[0]?.created_at || null
      };

    } catch (error) {
      throw new Error(`Erro ao gerar resumo clínico: ${error.message}`);
    }
  }

  validateCompositionData(compositionData, isUpdate = false) {
    const errors = [];

    if (!isUpdate) {
      if (!compositionData.paciente_id) {
        errors.push('paciente_id é obrigatório');
      }
      if (!compositionData.template_id) {
        errors.push('template_id é obrigatório');
      }
    }

    if (compositionData.composition_data) {
      if (typeof compositionData.composition_data !== 'object') {
        errors.push('composition_data deve ser um objeto');
      }
    }

    return errors;
  }

  async validateTemplateData(templateId, compositionData) {
    switch (templateId) {
      case 'BLOOD_PRESSURE_V1':
        if (!compositionData.systolic || !compositionData.diastolic) {
          throw new Error('Pressão sistólica e diastólica são obrigatórias');
        }
        break;
      case 'HEART_RATE_V1':
        if (!compositionData.rate) {
          throw new Error('Frequência cardíaca é obrigatória');
        }
        break;
      case 'TEMPERATURE_V1':
        if (!compositionData.value) {
          throw new Error('Temperatura é obrigatória');
        }
        break;
      case 'SYMPTOMS_V1':
        if (!compositionData.symptoms || compositionData.symptoms.length === 0) {
          throw new Error('Pelo menos um sintoma é obrigatório');
        }
        break;
      case 'MEDICATION_V1':
        if (!compositionData.name) {
          throw new Error('Nome da medicação é obrigatório');
        }
        break;
    }
  }
}

module.exports = CompositionService;