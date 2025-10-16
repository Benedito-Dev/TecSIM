const PrescricaoController = require('../../controllers/prescricaoController');
const service = require('../../services/prescricaoServices');
const generatePrescriptionPDF = require('../../utils/Prescription-Pdf');

// Mock das dependências
jest.mock('../../services/prescricaoServices');
jest.mock('../../utils/Prescription-Pdf');

// Mock do console para evitar logs nos testes
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('PrescricaoController', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {},
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // =============================================
  // TESTES DO FINDALL
  // =============================================
  describe('findAll', () => {
    it('deve retornar todas as prescrições com sucesso', async () => {
      const mockPrescricoes = [
        { id: 1, descricao: 'Prescrição 1' },
        { id: 2, descricao: 'Prescrição 2' }
      ];
      service.findAll.mockResolvedValue(mockPrescricoes);

      await PrescricaoController.findAll(req, res, next);

      expect(service.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPrescricoes);
      expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next com erro quando service falhar', async () => {
      const mockError = new Error('Database error');
      service.findAll.mockRejectedValue(mockError);

      await PrescricaoController.findAll(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  // =============================================
  // TESTES DO FIND BY ID
  // =============================================
  describe('findById', () => {
    it('deve retornar prescrição por ID com sucesso', async () => {
      req.params.id = '1';
      const mockPrescricao = { id: 1, descricao: 'Prescrição Teste' };
      service.findById.mockResolvedValue(mockPrescricao);

      await PrescricaoController.findById(req, res, next);

      expect(service.findById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPrescricao);
      expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next com erro quando service falhar', async () => {
      req.params.id = '1';
      const mockError = new Error('Not found');
      service.findById.mockRejectedValue(mockError);

      await PrescricaoController.findById(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  // =============================================
  // TESTES DO FIND BY PACIENTE ID
  // =============================================
  describe('findByPacienteId', () => {
    it('deve retornar prescrições por ID do paciente', async () => {
      req.params.id_paciente = '123';
      const mockPrescricoes = [
        { id: 1, id_paciente: 123 },
        { id: 2, id_paciente: 123 }
      ];
      service.findByPacienteId.mockResolvedValue(mockPrescricoes);

      await PrescricaoController.findByPacienteId(req, res, next);

      expect(service.findByPacienteId).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPrescricoes);
      expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next com erro quando service falhar', async () => {
      req.params.id_paciente = '123';
      const mockError = new Error('Patient not found');
      service.findByPacienteId.mockRejectedValue(mockError);

      await PrescricaoController.findByPacienteId(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  // =============================================
  // TESTES DO FIND BY MEDICO CRM
  // =============================================
  describe('findByMedicoCrm', () => {
    it('deve retornar prescrições por CRM do médico', async () => {
      req.params.crm = 'CRM/SP-123456';
      const mockPrescricoes = [
        { id: 1, medico_crm: 'CRM/SP-123456' },
        { id: 2, medico_crm: 'CRM/SP-123456' }
      ];
      service.findByMedicoCrm.mockResolvedValue(mockPrescricoes);

      await PrescricaoController.findByMedicoCrm(req, res, next);

      expect(service.findByMedicoCrm).toHaveBeenCalledWith('CRM/SP-123456');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPrescricoes);
      expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next com erro quando service falhar', async () => {
      req.params.crm = 'CRM/SP-123456';
      const mockError = new Error('Doctor not found');
      service.findByMedicoCrm.mockRejectedValue(mockError);

      await PrescricaoController.findByMedicoCrm(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  // =============================================
  // TESTES DO CREATE
  // =============================================
  describe('create', () => {
    it('deve criar prescrição com sucesso', async () => {
      const prescricaoData = {
        descricao: 'Prescrição nova',
        id_paciente: 1,
        medico_crm: 'CRM/SP-123456'
      };
      req.body = prescricaoData;
      const mockPrescricaoCriada = { id: 1, ...prescricaoData };
      service.create.mockResolvedValue(mockPrescricaoCriada);

      await PrescricaoController.create(req, res, next);

      expect(service.create).toHaveBeenCalledWith(prescricaoData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockPrescricaoCriada);
      expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next com erro quando service falhar', async () => {
      req.body = { descricao: 'Prescrição inválida' };
      const mockError = new Error('Validation error');
      service.create.mockRejectedValue(mockError);

      await PrescricaoController.create(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  // =============================================
  // TESTES DO UPDATE
  // =============================================
  describe('update', () => {
    it('deve atualizar prescrição com sucesso', async () => {
      req.params.id = '1';
      req.body = { descricao: 'Prescrição atualizada' };
      const mockPrescricaoAtualizada = { id: 1, descricao: 'Prescrição atualizada' };
      service.update.mockResolvedValue(mockPrescricaoAtualizada);

      await PrescricaoController.update(req, res, next);

      expect(service.update).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Prescrição atualizada com sucesso',
        data: mockPrescricaoAtualizada
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next com erro quando service falhar', async () => {
      req.params.id = '1';
      req.body = { descricao: 'Prescrição inválida' };
      const mockError = new Error('Update error');
      service.update.mockRejectedValue(mockError);

      await PrescricaoController.update(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  // =============================================
  // TESTES DO REMOVE
  // =============================================
  describe('remove', () => {
    it('deve remover prescrição com sucesso', async () => {
      req.params.id = '1';
      const mockPrescricaoRemovida = { id: 1, descricao: 'Prescrição removida' };
      service.remove.mockResolvedValue(mockPrescricaoRemovida);

      await PrescricaoController.remove(req, res, next);

      expect(service.remove).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Prescrição removida com sucesso',
        data: mockPrescricaoRemovida
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next com erro quando service falhar', async () => {
      req.params.id = '1';
      const mockError = new Error('Delete error');
      service.remove.mockRejectedValue(mockError);

      await PrescricaoController.remove(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  // =============================================
  // TESTES DO DOWNLOAD
  // =============================================
  describe('download', () => {
    it('deve baixar PDF da prescrição com sucesso', async () => {
      req.params.id = '1';
      const mockPrescricao = {
        id: 1,
        descricao: 'Prescrição teste',
        medicamentos: [
          { nome: 'Medicamento 1', dosagem: '500mg' }
        ]
      };
      const mockPdfBuffer = Buffer.from('PDF content');

      service.findById.mockResolvedValue(mockPrescricao);
      generatePrescriptionPDF.mockReturnValue(mockPdfBuffer);

      await PrescricaoController.download(req, res);

      expect(service.findById).toHaveBeenCalledWith('1', { include: ['medicamentos'] });
      expect(generatePrescriptionPDF).toHaveBeenCalledWith(mockPrescricao);
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename=prescricao_1.pdf'
      );
      expect(res.send).toHaveBeenCalledWith(mockPdfBuffer);
    });

    it('deve retornar 404 quando prescrição não for encontrada', async () => {
      req.params.id = '999';
      service.findById.mockResolvedValue(null);

      await PrescricaoController.download(req, res);

      expect(service.findById).toHaveBeenCalledWith('999', { include: ['medicamentos'] });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Prescrição não encontrada' });
      expect(generatePrescriptionPDF).not.toHaveBeenCalled();
    });

    it('deve retornar 500 quando ocorrer erro ao gerar PDF', async () => {
      req.params.id = '1';
      const mockPrescricao = {
        id: 1,
        descricao: 'Prescrição teste',
        medicamentos: []
      };

      service.findById.mockResolvedValue(mockPrescricao);
      generatePrescriptionPDF.mockImplementation(() => {
        throw new Error('PDF generation error');
      });

      await PrescricaoController.download(req, res);

      expect(service.findById).toHaveBeenCalledWith('1', { include: ['medicamentos'] });
      expect(generatePrescriptionPDF).toHaveBeenCalledWith(mockPrescricao);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao gerar PDF' });
    });

    it('deve lidar com erro no service.findById', async () => {
      req.params.id = '1';
      service.findById.mockRejectedValue(new Error('Service error'));

      await PrescricaoController.download(req, res);

      expect(service.findById).toHaveBeenCalledWith('1', { include: ['medicamentos'] });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao gerar PDF' });
    });
  });
});