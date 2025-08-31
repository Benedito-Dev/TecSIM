import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView
} from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import { X, Calendar, Pill, User, FileText } from "lucide-react-native";

const PrescriptionSummaryModal = ({ visible, onClose, onSave, prescription }) => {
  const { theme } = useContext(ThemeContext);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (!prescription) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{flex: 1, backgroundColor: theme.overlay}}>
        <KeyboardAvoidingView 
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={{flex: 1, justifyContent: "center", alignItems: "center", width: '100%'}}>
            <View style={{
              width: Platform.OS === 'ios' ? '90%' : '95%',
              maxHeight: Platform.OS === 'ios' ? '85%' : '90%',
              backgroundColor: theme.backgroundCard,
              borderRadius: 16,
              overflow: 'hidden',
              shadowColor: theme.shadowColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: theme.border,
                paddingTop: Platform.OS === 'ios' ? 20 : 16
              }}>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: theme.textPrimary,
                }}>Resumo da Prescrição</Text>
                <TouchableOpacity onPress={onClose} style={{padding: 4}}>
                  <X size={24} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={{paddingHorizontal: 16, maxHeight: '70%'}}
                showsVerticalScrollIndicator={false}
              >
                {/* Informações do médico */}
                <View style={{marginVertical: 12}}>
                  <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
                    <User size={18} color={theme.primary} />
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: theme.textPrimary,
                      marginLeft: 8,
                    }}>Informações do Médico</Text>
                  </View>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingHorizontal: 8}}>
                    <Text style={{fontSize: 14, fontWeight: '500', color: theme.textSecondary}}>CRM:</Text>
                    <Text style={{fontSize: 14, fontWeight: '500', color: theme.textPrimary}}>{prescription.crm}</Text>
                  </View>
                </View>

                {/* Datas */}
                <View style={{marginVertical: 12}}>
                  <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
                    <Calendar size={18} color={theme.primary} />
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: theme.textPrimary,
                      marginLeft: 8,
                    }}>Datas</Text>
                  </View>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingHorizontal: 8}}>
                    <Text style={{fontSize: 14, fontWeight: '500', color: theme.textSecondary}}>Data da prescrição:</Text>
                    <Text style={{fontSize: 14, fontWeight: '500', color: theme.textPrimary}}>{formatDate(prescription.data_prescricao)}</Text>
                  </View>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingHorizontal: 8}}>
                    <Text style={{fontSize: 14, fontWeight: '500', color: theme.textSecondary}}>Validade:</Text>
                    <Text style={{fontSize: 14, fontWeight: '500', color: theme.textPrimary}}>{formatDate(prescription.validade)}</Text>
                  </View>
                </View>

                {/* Diagnóstico */}
                <View style={{marginVertical: 12}}>
                  <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
                    <FileText size={18} color={theme.primary} />
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: theme.textPrimary,
                      marginLeft: 8,
                    }}>Diagnóstico</Text>
                  </View>
                  <Text style={{
                    fontSize: 14,
                    color: theme.textPrimary,
                    backgroundColor: theme.backgroundSecondary,
                    padding: 12,
                    borderRadius: 8,
                    borderLeftWidth: 3,
                    borderLeftColor: theme.primary,
                  }}>{prescription.diagnostico}</Text>
                </View>

                {/* Medicamentos */}
                <View style={{marginVertical: 12}}>
                  <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
                    <Pill size={18} color={theme.primary} />
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: theme.textPrimary,
                      marginLeft: 8,
                    }}>Medicamentos Prescritos</Text>
                  </View>
                  {prescription.medicamentos.map((med, index) => (
                    <View key={med.id} style={{
                      backgroundColor: theme.backgroundSecondary,
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 12,
                      borderWidth: 1,
                      borderColor: theme.border,
                    }}>
                      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
                        <View style={{
                          backgroundColor: theme.primary,
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 8
                        }}>
                          <Text style={{
                            color: theme.textOnPrimary,
                            fontSize: 12,
                            fontWeight: '600'
                          }}>{index + 1}</Text>
                        </View>
                        <Text style={{
                          fontSize: 15,
                          fontWeight: '600',
                          color: theme.textPrimary,
                        }}>{med.nome}</Text>
                      </View>
                      
                      <View style={{paddingLeft: 32}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4}}>
                          <Text style={{fontSize: 13, color: theme.textSecondary}}>Dosagem:</Text>
                          <Text style={{fontSize: 13, fontWeight: '500', color: theme.textPrimary}}>{med.dosagem}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4}}>
                          <Text style={{fontSize: 13, color: theme.textSecondary}}>Frequência:</Text>
                          <Text style={{fontSize: 13, fontWeight: '500', color: theme.textPrimary}}>{med.frequencia}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4}}>
                          <Text style={{fontSize: 13, color: theme.textSecondary}}>Via:</Text>
                          <Text style={{fontSize: 13, fontWeight: '500', color: theme.textPrimary}}>{med.via}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4}}>
                          <Text style={{fontSize: 13, color: theme.textSecondary}}>Duração:</Text>
                          <Text style={{fontSize: 13, fontWeight: '500', color: theme.textPrimary}}>{med.duracao_dias} dias</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Observações */}
                {prescription.observacoes ? (
                  <View style={{marginVertical: 12}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
                      <FileText size={18} color={theme.primary} />
                      <Text style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: theme.textPrimary,
                        marginLeft: 8,
                      }}>Observações</Text>
                    </View>
                    <Text style={{
                      fontSize: 14,
                      color: theme.textPrimary,
                      backgroundColor: theme.backgroundSecondary,
                      padding: 12,
                      borderRadius: 8,
                      borderLeftWidth: 3,
                      borderLeftColor: theme.info,
                    }}>{prescription.observacoes}</Text>
                  </View>
                ) : null}
              </ScrollView>

              {/* Botões de ação */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 16,
                borderTopWidth: 1,
                borderTopColor: theme.border,
                paddingBottom: Platform.OS === 'ios' ? 24 : 16
              }}>
                <TouchableOpacity 
                  style={{
                    flex: 1,
                    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: theme.border,
                    marginRight: 8,
                  }} 
                  onPress={onClose}
                >
                  <Text style={{
                    color: theme.textSecondary,
                    fontWeight: '600',
                    fontSize: 14,
                  }}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={{
                    flex: 1,
                    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.success,
                    marginLeft: 8,
                  }} 
                  onPress={onSave}
                >
                  <Text style={{
                    color: theme.textOnSuccess,
                    fontWeight: '600',
                    fontSize: 14,
                  }}>Salvar Prescrição</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default PrescriptionSummaryModal;