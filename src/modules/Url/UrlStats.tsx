import { CChart } from "@coreui/react-chartjs";
import type { ChartData } from "chart.js";

type Props = {
  barCharts: ChartData[];
  pieCharts: ChartData[];
};

const UrlStats: React.FC<Props> = ({ barCharts = [], pieCharts = [] }) => {
  return (
    <div className="flex flex-col lg:items-center lg:justify-center gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {barCharts.map((chart) => (
          <CChart type="bar" data={chart} customTooltips={false} />
        ))}

        {pieCharts.map((chart) => (
          <CChart type="pie" data={chart} customTooltips={false} />
        ))}
      </div>
    </div>
  );
};

export default UrlStats;
