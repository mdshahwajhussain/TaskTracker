import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useThemeStore } from '../../stores/themeStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ProjectStatsProps {
  tasksByStatus: {
    not_started: number;
    in_progress: number;
    completed: number;
    on_hold: number;
    cancelled: number;
  };
  tasksByDate: {
    labels: string[];
    data: number[];
  };
}

const ProjectStats = ({ tasksByStatus, tasksByDate }: ProjectStatsProps) => {
  const { isDarkMode } = useThemeStore();
  const textColor = isDarkMode ? '#e5e7eb' : '#374151';
  const gridColor = isDarkMode ? '#374151' : '#e5e7eb';

  const statusData = {
    labels: ['Not Started', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
    datasets: [
      {
        data: [
          tasksByStatus.not_started,
          tasksByStatus.in_progress,
          tasksByStatus.completed,
          tasksByStatus.on_hold,
          tasksByStatus.cancelled,
        ],
        backgroundColor: [
          '#9CA3AF',
          '#60A5FA',
          '#34D399',
          '#FBBF24',
          '#EF4444',
        ],
      },
    ],
  };

  const timelineData = {
    labels: tasksByDate.labels,
    datasets: [
      {
        label: 'Tasks Created',
        data: tasksByDate.data,
        backgroundColor: isDarkMode ? '#3B82F6' : '#60A5FA',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
      x: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Task Status Distribution
        </h3>
        <div className="h-64">
          <Doughnut data={statusData} options={options} />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Tasks Timeline
        </h3>
        <div className="h-64">
          <Bar data={timelineData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ProjectStats;