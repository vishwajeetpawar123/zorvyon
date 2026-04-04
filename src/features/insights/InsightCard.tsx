import { Card } from '../../components/ui/Card';
import { Insight } from '../../types';
import { AlertTriangle, TrendingUp, PieChart, Calendar, Zap } from 'lucide-react';

interface InsightCardProps {
  insight: Insight;
  index: number;
}

export function InsightCard({ insight, index }: InsightCardProps) {
  
  const getIcon = (name: string, type: string) => {
    let colorClass = 'text-text-secondary';
    let bgClass = 'bg-bg-elevated';
    
    if (type === 'positive') { colorClass = 'text-color-success'; bgClass = 'bg-color-success/15'; }
    if (type === 'negative') { colorClass = 'text-color-error'; bgClass = 'bg-color-error/15'; }
    if (type === 'warning') { colorClass = 'text-color-warning'; bgClass = 'bg-color-warning/15'; }
    if (type === 'neutral') { colorClass = 'text-accent-primary'; bgClass = 'bg-accent-primary/15'; }

    const wrapper = (IconObj: any) => (
      <div className={`p-3 rounded-full ${bgClass} ${colorClass}`}>
        <IconObj className="h-5 w-5" />
      </div>
    );

    switch(name) {
      case 'trending-up': return wrapper(TrendingUp);
      case 'alert': return wrapper(AlertTriangle);
      case 'pie-chart': return wrapper(PieChart);
      case 'calendar': return wrapper(Calendar);
      default: return wrapper(Zap);
    }
  };

  return (
    <Card 
      glass
      className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
      style={{ animationDelay: `${100 + index * 100}ms` }}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          {getIcon(insight.icon, insight.type)}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-primary">{insight.title}</h3>
          <p className="text-sm text-text-secondary mt-1 max-w-prose leading-relaxed">
            {insight.description}
          </p>
        </div>
        <div className="flex-shrink-0 text-right self-center pl-4 border-l border-border-default h-full">
          <span className="text-xl font-bold font-mono tracking-tight text-text-primary block">
            {insight.value}
          </span>
        </div>
      </div>
    </Card>
  );
}
