import api from '../api/api'

export const getMedicametos = async () => {
    try {
        const response = await api.get('/medicamentos');
        console.log(response.data

            
        )

        return response.data;
    } catch (error) {
        console.error('Detalhes do Erro', {
            message: error.message
        });
    }
}