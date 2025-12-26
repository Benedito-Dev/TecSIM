import React from "react";
import Sidebar from "../../components/layout/Sidebar";
import { PageContainer } from "../../components/layout/PageContainer";
import { Pill } from "lucide-react";
import { useMedicinesData } from "../../hooks/pages/medicines/useMedicinesData";
import { 
  SearchBar, 
  LoadingState, 
  ErrorState, 
  EmptyState, 
  MedicineCard, 
  PaginationInfo,
  PaginationControls
} from "../../components/pages/medicines";

const Medicamentos = () => {
  const {
    search,
    setSearch,
    isLoading,
    error,
    currentPage,
    itemsPerPage,
    filteredMedicamentos,
    currentMedicamentos,
    totalPages,
    handlePageChange,
    handleItemsPerPageChange,
    handleAddMedicamento,
    formatPrice
  } = useMedicinesData();

  const handleNovoMedicamento = () => {
    console.log("Novo medicamento");
    alert("Funcionalidade de novo medicamento em desenvolvimento!");
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <PageContainer 
        title="Medicamentos" 
        icon={Pill}
        buttonText="Novo Medicamento"
        onButtonClick={handleNovoMedicamento}
      >
        <SearchBar 
          search={search}
          setSearch={setSearch}
          placeholder="Buscar por nome, tipo ou descrição..."
        />

        {isLoading && <LoadingState message="Carregando medicamentos..." />}

        {error && !isLoading && <ErrorState error={error} />}

        {!isLoading && !error && filteredMedicamentos.length === 0 && (
          <EmptyState search={search} setSearch={setSearch} />
        )}

        {!isLoading && !error && filteredMedicamentos.length > 0 && (
          <div className="space-y-6">
            <PaginationInfo
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredMedicamentos.length}
              search={search}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
            
            <div className="space-y-4">
              {currentMedicamentos.map((med) => (
                <MedicineCard
                  key={med.id_medicamento}
                  medicine={med}
                  onAdd={handleAddMedicamento}
                  formatPrice={formatPrice}
                />
              ))}
            </div>

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </PageContainer>
    </div>
  );
};

export default Medicamentos;