import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <AlertTriangle size={48} className="text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-app-text-primary mb-2">页面出错了</h3>
          <p className="text-sm text-app-text-secondary mb-4">
            {this.state.error?.message || '发生了未知错误'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-app-accent text-white text-sm font-medium active:scale-95 transition-transform"
          >
            <RefreshCw size={16} />
            刷新页面
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
