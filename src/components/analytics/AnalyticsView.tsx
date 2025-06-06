
import { useState } from "react";
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
import { TabItem } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prompts } from "@/data/prompts";

const usageData = [
  { name: 'Jan', Developer: 120, Designer: 110, Marketer: 80, Writer: 90 },
  { name: 'Feb', Developer: 132, Designer: 123, Marketer: 90, Writer: 85 },
  { name: 'Mar', Developer: 145, Designer: 140, Marketer: 105, Writer: 100 },
  { name: 'Apr', Developer: 160, Designer: 150, Marketer: 110, Writer: 120 },
  { name: 'May', Developer: 170, Designer: 160, Marketer: 125, Writer: 130 },
  { name: 'Jun', Developer: 185, Designer: 170, Marketer: 140, Writer: 145 },
];

const roleDistributionData = [
  { name: 'Developer', value: prompts.filter(p => p.roles.includes('Developer')).length },
  { name: 'Designer', value: prompts.filter(p => p.roles.includes('Designer')).length },
  { name: 'Marketer', value: prompts.filter(p => p.roles.includes('Marketer')).length },
  { name: 'Writer', value: prompts.filter(p => p.roles.includes('Writer')).length },
  { name: 'Analyst', value: prompts.filter(p => p.roles.includes('Analyst')).length },
  { name: 'Manager', value: prompts.filter(p => p.roles.includes('Manager')).length },
];

const taskDistributionData = [
  { name: 'Writing', value: prompts.filter(p => p.tasks.includes('Writing')).length },
  { name: 'Analysis', value: prompts.filter(p => p.tasks.includes('Analysis')).length },
  { name: 'Code Review', value: prompts.filter(p => p.tasks.includes('Code Review')).length },
  { name: 'Creative', value: prompts.filter(p => p.tasks.includes('Creative')).length },
  { name: 'Technical', value: prompts.filter(p => p.tasks.includes('Technical')).length },
  { name: 'Planning', value: prompts.filter(p => p.tasks.includes('Planning')).length },
];

const ratingData = [
  { name: '≥ 4.8', count: prompts.filter(p => p.rating >= 4.8).length },
  { name: '4.5-4.7', count: prompts.filter(p => p.rating >= 4.5 && p.rating < 4.8).length },
  { name: '4.0-4.4', count: prompts.filter(p => p.rating >= 4.0 && p.rating < 4.5).length },
  { name: '< 4.0', count: prompts.filter(p => p.rating < 4.0).length },
];

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#0ea5e9', '#10b981'];

export default function AnalyticsView() {
  const analyticsTabs: TabItem[] = [
    { id: '1', label: 'Overview', value: 'overview', count: 4 },
    { id: '2', label: 'Usage Trends', value: 'usage', count: 1 },
    { id: '3', label: 'Prompt Distribution', value: 'distribution', count: 2 },
    { id: '4', label: 'Ratings', value: 'ratings', count: 1 },
  ];
  
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">
          Insights and statistics about prompt usage and performance.
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
              <div className="text-3xl font-bold">{prompts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all roles and tasks
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
                {prompts.reduce((sum, prompt) => sum + prompt.views, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All-time prompt views
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
                {(prompts.reduce((sum, prompt) => sum + prompt.rating, 0) / prompts.length).toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                From all prompt ratings
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
                Professional categories
              </p>
            </CardContent>
          </Card>

          {/* Main charts */}
          <Card className="col-span-full md:col-span-2">
            <CardHeader>
              <CardTitle>Usage Trends</CardTitle>
              <CardDescription>
                Prompt usage by professional role over the last 6 months
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
                    <Line type="monotone" dataKey="Developer" stroke="#6366f1" strokeWidth={2} />
                    <Line type="monotone" dataKey="Designer" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="Marketer" stroke="#ec4899" strokeWidth={2} />
                    <Line type="monotone" dataKey="Writer" stroke="#f97316" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-full md:col-span-2">
            <CardHeader>
              <CardTitle>Prompt Ratings Distribution</CardTitle>
              <CardDescription>
                Number of prompts by rating categories
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
                    <Bar dataKey="count" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-full lg:col-span-2">
            <CardHeader>
              <CardTitle>Distribution by Role</CardTitle>
              <CardDescription>
                Number of prompts available for each role
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
                      fill="#8884d8"
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
                Number of prompts available for each task type
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
                      fill="#8884d8"
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
                Prompt usage by professional role over the last 6 months
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
                    <Line type="monotone" dataKey="Developer" stroke="#6366f1" strokeWidth={2} />
                    <Line type="monotone" dataKey="Designer" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="Marketer" stroke="#ec4899" strokeWidth={2} />
                    <Line type="monotone" dataKey="Writer" stroke="#f97316" strokeWidth={2} />
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
                Number of prompts available for each role
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
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Distribution by Task</CardTitle>
              <CardDescription>
                Number of prompts available for each task type
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
                    <Bar dataKey="value" fill="#ec4899" />
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
                Number of prompts by rating categories
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
                    <Bar dataKey="count" fill="#8b5cf6" />
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
