import { FileText } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-app-text-tertiary mb-4">
        {icon || <FileText size={48} />}
      </div>
      <h3 className="text-lg font-medium text-app-text-primary mb-2">{title}</h3>
      {description && <p className="text-sm text-app-text-secondary mb-4">{description}</p>}
      {action}
    </div>
  );
}
