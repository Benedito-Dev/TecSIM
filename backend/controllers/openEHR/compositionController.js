const CompositionService = require('../../services/openEHR/compositionServices');

class CompositionController {
  constructor() {
    console.log('🔄 Inicializando CompositionController...');
    
    try {
      this.compositionService = new CompositionService();
      console.log('✅ CompositionService carregado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao carregar CompositionService:', error);
    }
    
    // Bind dos métodos para manter o contexto do 'this'
    this.createComposition = this.createComposition.bind(this);
    this.getPatientCompositions = this.getPatientCompositions.bind(this);
    this.getComposition = this.getComposition.bind(this);
    this.updateComposition = this.updateComposition.bind(this);
    this.deleteComposition = this.deleteComposition.bind(this);
    this.getPatientClinicalSummary = this.getPatientClinicalSummary.bind(this);
    this.healthCheck = this.healthCheck.bind(this);
  }

  // POST /ehr/compositions
  async createComposition(req, res) {
    try {
      console.log('📝 Criando composição:', req.body); // Debug
      
      const compositionData = {
        ...req.body,
        author: req.user?.id || 'system'
      };

      const composition = await this.compositionService.createComposition(compositionData);

      res.status(201).json({
        success: true,
        data: composition,
        message: 'Composição criada com sucesso'
      });

    } catch (error) {
      console.error('❌ Erro ao criar composição:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // GET /ehr/compositions/patient/:pacienteId
  async getPatientCompositions(req, res) {
    try {
      const { pacienteId } = req.params;
      const { 
        templateId, 
        limit = 50, 
        offset = 0,
        status = 'active'
      } = req.query;

      console.log('🔍 Buscando composições do paciente:', pacienteId); // Debug

      const compositions = await this.compositionService.getPatientCompositions(
        parseInt(pacienteId), 
        { 
          templateId, 
          limit: parseInt(limit), 
          offset: parseInt(offset),
          status 
        }
      );

      res.json({
        success: true,
        data: compositions,
        count: compositions.length
      });

    } catch (error) {
      console.error('❌ Erro ao buscar composições:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // GET /ehr/compositions/:compositionId
  async getComposition(req, res) {
    try {
      const { compositionId } = req.params;
      console.log('🔍 Buscando composição:', compositionId); // Debug

      const composition = await this.compositionService.getComposition(compositionId);

      res.json({
        success: true,
        data: composition
      });

    } catch (error) {
      console.error('❌ Erro ao buscar composição:', error);
      if (error.message === 'Composição não encontrada') {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // PUT /ehr/compositions/:compositionId
  async updateComposition(req, res) {
    try {
      const { compositionId } = req.params;
      const updateData = {
        ...req.body,
        author: req.user?.id || 'system'
      };

      console.log('✏️ Atualizando composição:', compositionId); // Debug

      const updatedComposition = await this.compositionService.updateComposition(
        compositionId, 
        updateData
      );

      res.json({
        success: true,
        data: updatedComposition,
        message: 'Composição atualizada com sucesso'
      });

    } catch (error) {
      console.error('❌ Erro ao atualizar composição:', error);
      if (error.message === 'Composição não encontrada') {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // DELETE /ehr/compositions/:compositionId
  async deleteComposition(req, res) {
    try {
      const { compositionId } = req.params;
      console.log('🗑️ Deletando composição:', compositionId); // Debug

      await this.compositionService.deleteComposition(compositionId);

      res.json({
        success: true,
        message: 'Composição removida com sucesso'
      });

    } catch (error) {
      console.error('❌ Erro ao deletar composição:', error);
      if (error.message === 'Composição não encontrada') {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // GET /ehr/patient/:pacienteId/summary
  async getPatientClinicalSummary(req, res) {
    try {
      const { pacienteId } = req.params;
      console.log('📊 Gerando resumo clínico para paciente:', pacienteId); // Debug

      const summary = await this.compositionService.getPatientClinicalSummary(parseInt(pacienteId));

      res.json({
        success: true,
        data: summary
      });

    } catch (error) {
      console.error('❌ Erro ao gerar resumo clínico:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Health check
  async healthCheck(req, res) {
    try {
      console.log('❤️ Health check openEHR'); // Debug
      res.json({
        success: true,
        message: 'Serviço openEHR está funcionando corretamente',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Erro no health check:', error);
      res.status(500).json({
        success: false,
        error: 'Serviço openEHR com problemas: ' + error.message
      });
    }
  }
}

module.exports = CompositionController;