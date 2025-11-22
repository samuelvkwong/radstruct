import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Template {
  id: number;
  name: string;
  description: string;
  template_type: string;
  structure: any;
  is_public: boolean;
  created_at: string;
}

export interface ReportBatch {
  id: number;
  name: string;
  status: string;
  total_reports: number;
  processed_reports: number;
  template_id: number;
  created_at: string;
  completed_at?: string;
}

export interface StructuredReport {
  id: number;
  batch_id: number;
  template_id: number;
  original_text: string;
  structured_data: any;
  confidence_score?: number;
  status: string;
  error_message?: string;
  filename?: string;
  created_at: string;
  processed_at?: string;
}

// Template API calls
export const getTemplates = async (): Promise<Template[]> => {
  const response = await api.get('/templates/');
  return response.data;
};

export const getTemplate = async (id: number): Promise<Template> => {
  const response = await api.get(`/templates/${id}`);
  return response.data;
};

export const createTemplate = async (template: Partial<Template>): Promise<Template> => {
  const response = await api.post('/templates/', template);
  return response.data;
};

export const updateTemplate = async (id: number, template: Partial<Template>): Promise<Template> => {
  const response = await api.put(`/templates/${id}`, template);
  return response.data;
};

export const deleteTemplate = async (id: number): Promise<void> => {
  await api.delete(`/templates/${id}`);
};

// Report Batch API calls
export const createBatch = async (
  name: string,
  templateId: number,
  files: File[]
): Promise<ReportBatch> => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('template_id', templateId.toString());
  
  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await api.post('/reports/batches', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getBatches = async (): Promise<ReportBatch[]> => {
  const response = await api.get('/reports/batches');
  return response.data;
};

export const getBatch = async (id: number): Promise<ReportBatch> => {
  const response = await api.get(`/reports/batches/${id}`);
  return response.data;
};

export const getBatchReports = async (batchId: number): Promise<StructuredReport[]> => {
  const response = await api.get(`/reports/batches/${batchId}/reports`);
  return response.data;
};

export const getReport = async (id: number): Promise<StructuredReport> => {
  const response = await api.get(`/reports/${id}`);
  return response.data;
};

export default api;
