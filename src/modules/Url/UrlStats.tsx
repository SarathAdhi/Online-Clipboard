import { CChart } from "@coreui/react-chartjs";
import type { ChartData } from "chart.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";

type Props = {
  barCharts: ChartData<any>[];
  pieCharts: ChartData<any>[];
};

const UrlStats: React.FC<Props> = ({ barCharts = [], pieCharts = [] }) => {
  return (
    <div className="flex flex-col lg:items-center lg:justify-center gap-8">
      <Tabs defaultValue="pie" className="w-full space-y-4">
        <TabsList className="bg-slate-200/40">
          <TabsTrigger value="pie">Pie Chart</TabsTrigger>
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="pie">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {pieCharts.map((chart) => (
              <div className="card space-y-4">
                <h2>{chart.datasets[0].label}</h2>

                <CChart
                  height={400}
                  options={{ maintainAspectRatio: false }}
                  type="pie"
                  data={chart}
                  customTooltips={false}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {barCharts.map((chart) => (
              <div className="card space-y-4">
                <h2>{chart.datasets[0].label}</h2>

                <CChart
                  height={400}
                  options={{ maintainAspectRatio: false }}
                  type="bar"
                  data={chart}
                  customTooltips={false}
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UrlStats;
