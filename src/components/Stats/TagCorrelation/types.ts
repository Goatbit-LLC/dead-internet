export type VisualizationType = 'network' | 'treemap' | 'radial' | 'bar' | 'engagement' | 'demographics' | 'activity' | 'timeline' | 'hourly';

export interface VisualizationOption {
  id: VisualizationType;
  label: string;
  icon: React.FC<{ size: number }>;
  description: string;
}