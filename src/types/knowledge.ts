export interface KnowledgeBase {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  fileCount: number
}

export interface KnowledgeFile {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: string
  knowledgeId: string
}

export interface CreateKnowledgeBaseParams {
  name: string
  description?: string
}

export interface UpdateKnowledgeBaseParams {
  name?: string
  description?: string
}