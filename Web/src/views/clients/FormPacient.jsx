import React from "react";
import { FileText } from "lucide-react";
import { StepProgress, Step1, Step2, Step3, Step4 } from "../../components/pages/form-pacient";

const FormPacient = ({
  currentStep,
  patientData,
  errors,
  isSubmitting,
  onChange,
  onCondicoesChange,
  onNext,
  onBack,
  onCancel,
  onSave
}) => {
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 patientData={patientData} errors={errors} onChange={onChange} />;
      case 2:
        return <Step2 patientData={patientData} errors={errors} onChange={onChange} onCondicoesChange={onCondicoesChange} />;
      case 3:
        return <Step3 patientData={patientData} errors={errors} onChange={onChange} />;
      case 4:
        return <Step4 patientData={patientData} />;
      default:
        return <Step1 patientData={patientData} errors={errors} onChange={onChange} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Barra de Progresso */}
      <StepProgress currentStep={currentStep} />

      <form onSubmit={(e) => e.preventDefault()}>
        {/* Renderiza a etapa atual */}
        {renderCurrentStep()}

        {/* Botões de Navegação */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={currentStep === 1 ? onCancel : onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            {currentStep === 1 ? "Cancelar" : "Anterior"}
          </button>

          <div className="flex gap-3">
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={onNext}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Próximo
              </button>
            ) : (
              <button
                type="button"
                onClick={onSave}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
              >
                <FileText size={18} />
                <span>{isSubmitting ? "Salvando..." : "Finalizar Cadastro"}</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormPacient;