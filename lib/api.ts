import axios from "axios";


// aqui ele bate na API do back-end que tá rodando em http://localhost:3001/v1, que faz as requisições e rotas por lá, e devolve o JSON que a gente quer. O axios é só um jeito mais fácil de fazer fetch() e res.json() juntos, e ele já joga o JSON dentro de res.data que é usado depois para montar a telas e usar os dados do backend
const publicApi = axios.create({
  baseURL: process.env.API_URL || "http://localhost:3001/v1",
  headers: {
    "Content-Type": "application/json",
  },
});


export default publicApi;