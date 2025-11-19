'use client';

import { getRepositoryAnalytics } from "@/actions/repository/getRepositoryAnalytics/action";
import { useAction } from "next-safe-action/hooks";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function RepositoryAnalytics() {
  const params = useParams();
  const repositoryId = params.id as string;

  const { execute, result, status } = useAction(getRepositoryAnalytics, {
    onSuccess: (data) => {
      console.log("Analytics data fetched successfully:", data);
    },
    onError: (error) => {
      console.error("Error fetching analytics data:", error);
    },
  });

  useEffect(() => {
    if (repositoryId) {
      execute({ repositoryId });
    }
  }, [repositoryId, execute]);

  if (status === "executing") {
    return <div>Loading analytics...</div>;
  }

  if (status === "error") {
    return <div>Error loading analytics. Please ensure you are the repository owner.</div>;
  }

  const analyticsData = result.data;

  if (!analyticsData) {
    return null;
  }

  const { voteTrends, uniqueVoters, votingPowerDistribution, weeklyPerformance } = analyticsData;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Repository Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Current Week Votes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{weeklyPerformance.currentWeekVotes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Previous Week Votes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{weeklyPerformance.previousWeekVotes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Weekly Change</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {weeklyPerformance.previousWeekVotes > 0
                ? ((weeklyPerformance.currentWeekVotes - weeklyPerformance.previousWeekVotes) / weeklyPerformance.previousWeekVotes * 100).toFixed(2)
                : weeklyPerformance.currentWeekVotes > 0 ? '100.00' : '0.00'}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      <div className="grid grid-cols-1 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Vote Trends Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={voteTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="votes" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unique Voters Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={uniqueVoters}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="uniqueVoters" stroke="#82ca9d" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Voting Power Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={votingPowerDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="votes"
                  nameKey="voterName"
                  label={({ voterName, percent }) => `${voterName}: ${(percent * 100).toFixed(0)}%`}
                >
                  {votingPowerDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
