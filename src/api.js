import axios from 'axios'

//const SERVER_URL = " https://petitionserver.herokuapp.com/api/v1";
const SERVER_URL = "http://localhost:4941/api/v1"
console.log(SERVER_URL);

const axiosInstance = axios.create({
  baseURL: SERVER_URL,
  timeout: 10000
});

export default {
  SERVER_URL,
  getDetailedPetiton: (id) => axiosInstance.get('/petitions/' + id),
  getPetitions: (searchParams = {}) => axiosInstance.get('/petitions', {params: searchParams}),
  getPetitionImage: (id) => axiosInstance.get('/petitions/' + id + "/photo"),
  createPetition: (petition) => axiosInstance.post('/petitions', petition, {
    headers: {
      'X-Authorization': sessionStorage.getItem("token")
    }
  }),
  addPetitionImage: (id, image) => axiosInstance.put(`/petitions/${id}/photo`, image, {
    headers: {
      'Content-Type': image.type,
      'X-Authorization': sessionStorage.getItem("token")
    }
  }),
  addPetitionImageAWS: (id, imageFormData) => {
    alert('attempting to upload aws photo')
    axiosInstance.put(`/petitions/${id}/awsphoto`, imageFormData, {
    headers: {
      //'Content-Type': image.type,
      'X-Authorization': sessionStorage.getItem("token")
    }
  })},
  getUserImage: () => axiosInstance.get(`/users/${sessionStorage.getItem("userId")}/photo`),
  addUserImage: (image) => axiosInstance.put(`/users/${sessionStorage.getItem("userId")}/photo`, image, {
    headers: {
      'Content-Type': image.type,
      'X-Authorization':sessionStorage.getItem("token")
    }
  }),
  signPetition: (petitionId) => axiosInstance.post(`/petitions/${petitionId}/signatures`, null, {
    headers: {
      'X-Authorization':sessionStorage.getItem("token")
    }
  }),
  removeSignature: (petitionId) => axiosInstance.delete(`/petitions/${petitionId}/signatures`, {
    headers: {
      'X-Authorization':sessionStorage.getItem("token")
    }
  }),
  getPetitionCategories: () => axiosInstance.get('/petitions/categories'),
  getPetitionSignatures: (id) => axiosInstance.get(`/petitions/${id}'/signatures`),
  getUser: () => axiosInstance.get(`/users/${sessionStorage.getItem("userId")}`, {headers: {
    'X-Authorization':sessionStorage.getItem("token")
    }}),
  editUser: (editFields) => axiosInstance.patch(`/users/${sessionStorage.getItem("userId")}`, editFields, {headers: {
    'X-Authorization':sessionStorage.getItem("token")
    }}),
  editPetition: (petitionId, editFields) => axiosInstance.patch(`/petitions/${petitionId}`, editFields, {headers: {
      'X-Authorization':sessionStorage.getItem("token")
    }}),
  removeUserImage: () => axiosInstance.delete(`/users/${sessionStorage.getItem("userId")}/photo`, {headers: {
    'X-Authorization':sessionStorage.getItem("token")
    }}),
  registerUser: (user) => axiosInstance.post('users/register', user),
  loginUser: (user) => axiosInstance.post('users/login', user),
  deletePetition: (petitionId) => axiosInstance.delete(`petitions/${petitionId}`, {
    headers: {
      'X-Authorization':sessionStorage.getItem("token")
    }
  })
}
