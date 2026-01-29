import axios from 'axios'

export default axios.create({
  baseURL: 'https://timely.edu.netlor.fr',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `key=${import.meta.env.VITE_API_KEY}`
  }
})
