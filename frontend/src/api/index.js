import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Dashboard
export const getDashboard = () => api.get('/dashboard')

// Students
export const getStudents = (params) => api.get('/students', { params })
export const getStudent = (id) => api.get(`/students/${id}`)
export const createStudent = (data) => api.post('/students', data)
export const updateStudent = (id, data) => api.put(`/students/${id}`, data)
export const deleteStudent = (id) => api.delete(`/students/${id}`)

// Enrollments
export const getEnrollments = (params) => api.get('/enrollments', { params })
export const getEnrollment = (id) => api.get(`/enrollments/${id}`)
export const createEnrollment = (data) => api.post('/enrollments', data)
export const addPayment = (id, amount) => api.post(`/enrollments/${id}/payment`, { amount })

// Schedules
export const getSchedules = (params) => api.get('/schedules', { params })
export const createSchedule = (data) => api.post('/schedules', data)
export const updateSchedule = (id, data) => api.put(`/schedules/${id}`, data)
export const getAvailableSlots = (params) => api.get('/available-slots', { params })

// VR Sessions
export const getVrScenarios = () => api.get('/vr/scenarios')
export const createVrSession = (data) => api.post('/vr/sessions', data)
export const getStudentVrHistory = (studentId) => api.get(`/vr/student/${studentId}/history`)

// Resources
export const getCourses = () => api.get('/courses')
export const getInstructors = () => api.get('/instructors')
export const getVehicles = () => api.get('/vehicles')

export default api
