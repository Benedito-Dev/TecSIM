import React from 'react';
import { useRegisterData } from '../hooks/pages/register/useRegisterData';
import { 
  BackgroundEffects,
  RegisterHeader,
  PersonalInfoForm,
  HealthInfoForm,
  SubmitButton,
  LoginLink,
  TermsModal
} from '../components/pages/register';

export default function RegisterPage() {
  const {
    formData,
    validation,
    showTerms,
    allValid,
    updateField,
    updateValidation,
    setShowTerms,
    handleCreateAccount,
    handleAcceptTerms
  } = useRegisterData();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 lg:p-10 relative overflow-hidden">
      <BackgroundEffects />

      <div className="w-full max-w-5xl mx-auto z-10 animate-fade-in-down">
        <RegisterHeader />

        <div className="bg-white p-6 md:p-10 rounded-2xl border-2 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
            <PersonalInfoForm 
              formData={formData}
              updateField={updateField}
              updateValidation={updateValidation}
            />
            
            <HealthInfoForm 
              formData={formData}
              updateField={updateField}
              updateValidation={updateValidation}
            />
          </div>

          <SubmitButton 
            allValid={allValid}
            onCreateAccount={handleCreateAccount}
          />
        </div>

        <LoginLink />
      </div>

      <TermsModal 
        showTerms={showTerms}
        onCancel={() => setShowTerms(false)}
        onAccept={handleAcceptTerms}
      />
    </div>
  );
}