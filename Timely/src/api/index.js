import axios from 'axios'

export default axios.create({
  baseURL: 'https://timely.edu.netlor.fr',
  headers: {
    'Content-Type': 'application/json',
  }
})
