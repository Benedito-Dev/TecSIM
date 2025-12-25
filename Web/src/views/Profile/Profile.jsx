import React from "react";
import { Stethoscope } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import { PageContainer } from "../../components/layout/PageContainer";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useProfileData } from "../../hooks/pages/profile/useProfileData";
import { 
  ProfileHeader,
  ContactInfo,
  ProfessionalBadges,
  ProfessionalInfo,
  ActivityStats,
  ProfileLoadingState,
  ProfileErrorState
} from "../../components/pages/profile";

export default function Profile() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { 
    enfermeiro, 
    loading, 
    formatarData, 
    calcularExperiencia, 
    getIniciais 
  } = useProfileData();

  const handleEditProfile = () => {
    navigate('/perfil/editar');
  };

  if (loading) {
    return <ProfileLoadingState />;
  }

  if (!enfermeiro) {
    return <ProfileErrorState />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <PageContainer 
        title="Perfil do Enfermeiro" 
        icon={Stethoscope}
        buttonText="Editar Perfil"
        onButtonClick={handleEditProfile}
      >
        <div className="max-w-4xl mx-auto">
          <div 
            className="shadow-md rounded-2xl p-6 border"
            style={{
              background: theme.backgroundCard,
              borderColor: theme.border
            }}
          >
            <ProfileHeader 
              enfermeiro={enfermeiro} 
              getIniciais={getIniciais} 
            />
            
            <ContactInfo 
              enfermeiro={enfermeiro} 
              formatarData={formatarData} 
            />
            
            <ProfessionalBadges enfermeiro={enfermeiro} />
            
            <ProfessionalInfo 
              enfermeiro={enfermeiro} 
              formatarData={formatarData}
              calcularExperiencia={calcularExperiencia}
            />
            
            <ActivityStats />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}