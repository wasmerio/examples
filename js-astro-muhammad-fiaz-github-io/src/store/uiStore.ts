import { create } from 'zustand';

interface Project {
  name: string;
  description: string;
  url: string;
  html_url: string;
  homepage?: string;
  stargazers_count: number;
  forks_count: number;
  language?: string;
  topics?: string[];
  created_at: string;
  updated_at: string;
}

interface UIState {
  activeProject: Project | null;
  isProjectModalOpen: boolean;
  openProjectModal: (project: Project) => void;
  closeProjectModal: () => void;
  
  isTransitioning: boolean;
  setTransitioning: (state: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeProject: null,
  isProjectModalOpen: false,
  openProjectModal: (project) => set({ activeProject: project, isProjectModalOpen: true }),
  closeProjectModal: () => set({ activeProject: null, isProjectModalOpen: false }),

  isTransitioning: false,
  setTransitioning: (state) => set({ isTransitioning: state }),
}));
