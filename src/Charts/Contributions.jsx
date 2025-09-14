import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

export default function ContributionGraph() {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">My Contributions</h2>
      <CalendarHeatmap
        startDate={new Date('2025-01-01')}
        endDate={new Date('2025-12-31')}
        values={[
          { date: '2025-01-01', count: 1 },
          { date: '2025-01-02', count: 4 },
          { date: '2025-01-03', count: 2 },
        ]}
      />
    </div>
  );
}
