import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminNavbar from '@/components/AdminNavbar';

const AdminReports = () => {
  const revenueData = [
    { date: '2024-12-10', revenue: 1200 },
    { date: '2024-12-11', revenue: 800 },
    { date: '2024-12-12', revenue: 1500 },
    { date: '2024-12-13', revenue: 900 },
    { date: '2024-12-14', revenue: 1800 },
    { date: '2024-12-15', revenue: 1390 },
  ];

  const kpis = [
    { title: 'Total Revenue', value: '৳8,690', change: '+12%' },
    { title: 'Total Orders', value: '45', change: '+8%' },
    { title: 'Avg Order Value', value: '৳193', change: '+5%' },
    { title: 'Conversion Rate', value: '3.2%', change: '+0.5%' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <Button className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
        </div>

        {/* Date Range Selector */}
        <Card className="p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" defaultValue="2024-12-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input id="end-date" type="date" defaultValue="2024-12-15" />
            </div>
            <Button className="mt-8">Apply Filter</Button>
          </div>
        </Card>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <Card key={index} className="p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">{kpi.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{kpi.value}</span>
                <span className="text-sm text-green-600 font-medium">{kpi.change}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Revenue Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Daily Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`৳${value}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </main>
    </div>
  );
};

export default AdminReports;