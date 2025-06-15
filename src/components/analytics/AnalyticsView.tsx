
import { useEffect, useState } from "react";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Legend, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { TabsList } from "@/components/ui/TabsList";
import { TabItem, PromptDB } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { fetchPrompts } from "@/utils/supabasePromptUtils";

const CHART_COLORS = ['#fb923c', '#f97316', '#10b981', '#8b5cf6', '#ec4899', '#6366f1'];

export default function AnalyticsView() {
  const { user } = useAuth();
  const [myPrompts, setMyPrompts] = useState<PromptDB[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (!user) {
      setMyPrompts([]);
      setLoading(false);
      return;
    }
    fetchPrompts().then((allPrompts) => {
      const userPrompts = allPrompts.filter(p => p.created_by === user.id);
      setMyPrompts(userPrompts);
      setLoading(false);
    });
  }, [user]);

  // Build analytics based on user's own prompts
  const totalPrompts = myPrompts.length;
  const totalViews = myPrompts.reduce((sum, prompt) => sum + (prompt.views || 0), 0);
  const totalRatings = myPrompts.reduce((sum, prompt) => sum + (prompt.ratings_count || 0), 0);
  const totalCopies = myPrompts.reduce((sum, prompt) => sum + (prompt.views || 0), 0); // counting views as copies for now, unless separate
  const averageRating = totalPrompts > 0
    ? (myPrompts.reduce((sum, prompt) => sum + (prompt.avg_rating || 0), 0) / totalPrompts).toFixed(2)
    : "0.00";

  // Generate role and task distribution just for your prompts
  const roleSet = new Set(myPrompts.flatMap(p => p.roles || []));
  const taskSet = new Set(myPrompts.flatMap(p => p.tasks || []));
  const roleDistributionData = Array.from(roleSet).map(role => ({
    name: role,
    value: myPrompts.filter(p => (p.roles || []).includes(role)).length,
  }));
  const taskDistributionData = Array.from(taskSet).map(task => ({
    name: task,
    value: myPrompts.filter(p => (p.tasks || []).includes(task)).length,
  }));

  // Example: usageData is monthly prompts created over last 6 months
  // Fake sample data; in production, you'd use created_at date and aggregate
  const usageData = [
    { name: 'Jan', Count: 0 },
    { name: 'Feb', Count: 0 },
    { name: 'Mar', Count: 0 },
    { name: 'Apr', Count: 0 },
    { name: 'May', Count: 0 },
    { name: 'Jun', Count: 0 },
  ];
  myPrompts.forEach(prompt => {
    const month = new Date(prompt.created_at).toLocaleString('default', { month: 'short' });
    const idx = usageData.findIndex(u => u.name === month);
    if (idx >= 0) usageData[idx].Count += 1;
  });

  // Ratings distribution (according to your prompts' ratings)
  const ratingData = [
    { name: '≥ 4.8', count: myPrompts.filter(p => p.avg_rating >= 4.8).length },
    { name: '4.5-4.7', count: myPrompts.filter(p => p.avg_rating >= 4.5 && p.avg_rating < 4.8).length },
    { name: '4.0-4.4', count: myPrompts.filter(p => p.avg_rating >= 4.0 && p.avg_rating < 4.5).length },
    { name: '< 4.0', count: myPrompts.filter(p => p.avg_rating < 4.0).length },
  ];

  const analyticsTabs: TabItem[] = [
    { id: '1', label: 'Overview', value: 'overview', count: 4 },
    { id: '2', label: 'Usage Trends', value: 'usage', count: 1 },
    { id: '3', label: 'Prompt Distribution', value: 'distribution', count: 2 },
    { id: '4', label: 'Ratings', value: 'ratings', count: 1 },
  ];

  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return <div className="p-4">Loading your prompt analytics...</div>;
  }

  if (!user) {
    return (
      <div className="p-4 text-center text-lg">
        Please sign in to see your prompt analytics.
      </div>
    );
  }

  if (myPrompts.length === 0) {
    return (
      <div className="p-4 text-center text-lg">
        You haven't created any prompts yet.
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Prompt Analytics</h1>
        <p className="text-muted-foreground">
          Insights and statistics about your prompt usage and performance.
        </p>
      </div>

      <TabsList
        tabs={analyticsTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-animation">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Prompts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalPrompts}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across your roles and tasks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {totalViews}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All-time prompt views (yours)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {averageRating}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                From your prompt ratings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Unique Roles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{roleDistributionData.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Your professional categories
              </p>
            </CardContent>
          </Card>

          <Card className="col-span-full md:col-span-2">
            <CardHeader>
              <CardTitle>Usage Trends</CardTitle>
              <CardDescription>
                Prompts you created over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Count" stroke="#fb923c" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-full md:col-span-2">
            <CardHeader>
              <CardTitle>Prompt Ratings Distribution</CardTitle>
              <CardDescription>
                Your prompts by rating categories
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#fb923c" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-full lg:col-span-2">
            <CardHeader>
              <CardTitle>Distribution by Role</CardTitle>
              <CardDescription>
                Number of your prompts available for each role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roleDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#fb923c"
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {roleDistributionData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-full lg:col-span-2">
            <CardHeader>
              <CardTitle>Distribution by Task</CardTitle>
              <CardDescription>
                Number of your prompts available for each task type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#fb923c"
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {taskDistributionData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'usage' && (
        <div className="animate-fade-in">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Monthly Usage Trends</CardTitle>
              <CardDescription>
                Your prompt creation trend over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Count" stroke="#fb923c" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'distribution' && (
        <div className="grid grid-cols-1 gap-8 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Distribution by Role</CardTitle>
              <CardDescription>
                Number of your prompts for each role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roleDistributionData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#fb923c" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribution by Task</CardTitle>
              <CardDescription>
                Number of your prompts for each task type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taskDistributionData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#fb923c" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'ratings' && (
        <div className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Prompt Ratings Distribution</CardTitle>
              <CardDescription>
                Your prompts by rating categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#fb923c" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
