"use client";

import React, { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { z } from "zod";

import PageContainer from '@/components/layout/page-container';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

const salesDataSchema = z.object({
  month: z.string(),
  revenue: z.number().positive(),
  unitsSold: z.number().int().positive(),
});

const categorySchema = z.object({
  name: z.string(),
  value: z.number(),
});

const dashboardDataSchema = z.object({
    salesOverTime: z.array(salesDataSchema),
    salesByCategory: z.array(categorySchema),
});

type SalesData = z.infer<typeof salesDataSchema>;
type DashboardData = z.infer<typeof dashboardDataSchema>;

const MOCK_DATA = {
    salesOverTime: [
        { month: 'Jan', revenue: 4000, unitsSold: 240 },
        { month: 'Feb', revenue: 3000, unitsSold: 139 },
        { month: 'Mar', revenue: 2000, unitsSold: 980 },
        { month: 'Apr', revenue: 2780, unitsSold: 390 },
        { month: 'May', revenue: 1890, unitsSold: 480 },
        { month: 'Jun', revenue: 2390, unitsSold: 380 },
    ],
    salesByCategory: [
        { name: 'Electronics', value: 400 },
        { name: 'Fashion', value: 300 },
        { name: 'Home Goods', value: 300 },
        { name: 'Books', value: 200 },
    ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const SalesDashboardPage = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const validatedData = dashboardDataSchema.parse(MOCK_DATA);
                setData(validatedData);
            } catch (err) {
                 if (err instanceof z.ZodError) {
                    setError("Data validation failed: " + err.errors.map(e => e.message).join(', '));
                 } else {
                    setError("Failed to fetch data.");
                 }
                 console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        setTimeout(fetchData, 1000);
    }, []);

    if (isLoading) {
        return <PageContainer><div className='flex items-center justify-center h-full'>Loading dashboard...</div></PageContainer>;
    }

    if (error || !data) {
        return <PageContainer><div className='flex items-center justify-center h-full text-red-500'>Error: {error || "Data could not be loaded."}</div></PageContainer>;
    }

    return (
        <PageContainer>
            <div className='flex flex-col gap-6 p-4'>
                <div className='flex justify-between items-center'>
                    <div>
                        <h1 className='text-3xl font-bold'>Sales Dashboard</h1>
                        <p className='text-muted-foreground'>Overview of sales performance.</p>
                    </div>
                    <Button asChild>
                        <Link href="/api/export-sales">Export Data</Link>
                    </Button>
                </div>

                <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    <ChartCard title="Revenue Over Time" description="Monthly revenue trend">
                        <RevenueChart data={data.salesOverTime} />
                    </ChartCard>
                    <ChartCard title="Sales by Category" description="Contribution of each category">
                        <CategoryPieChart data={data.salesByCategory} />
                    </ChartCard>
                     <ChartCard title="Units Sold" description="Monthly units sold">
                        <UnitsSoldChart data={data.salesOverTime} />
                    </ChartCard>
                </div>
            </div>
        </PageContainer>
    );
};

interface ChartCardProps {
    title: string;
    description: string;
    children: React.ReactElement;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, description, children }) => (
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className='w-full h-[300px]'>
                <ResponsiveContainer width="100%" height="100%">
                    {children}
                </ResponsiveContainer>
            </div>
        </CardContent>
    </Card>
);

const RevenueChart = ({ data, width, height }: { data: SalesData[], width?: number, height?: number }) => (
    <LineChart width={width} height={height} data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
);

const CategoryPieChart = ({ data, width, height }: { data: {name: string, value: number}[], width?: number, height?: number }) => (
     <PieChart width={width} height={height}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
     </PieChart>
);

const UnitsSoldChart = ({ data, width, height }: { data: SalesData[], width?: number, height?: number }) => (
    <BarChart width={width} height={height} data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
        <Legend />
        <Bar dataKey="unitsSold" fill="#82ca9d" />
    </BarChart>
);

export default SalesDashboardPage;