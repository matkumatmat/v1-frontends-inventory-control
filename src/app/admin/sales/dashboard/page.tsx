"use client";

import React, { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { z } from "zod";

import PageContainer from '@/components/layout/page-container';
import { Button } from "@/components/ui/button";
// Benar
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

// Pro Tip 1: Definisikan skema data dengan Zod
// Ini memastikan data yang Anda terima (misalnya dari API) memiliki struktur yang benar.
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

// Pro Tip 2: Gunakan z.infer untuk membuat tipe TypeScript dari skema Zod
type SalesData = z.infer<typeof salesDataSchema>;
type DashboardData = z.infer<typeof dashboardDataSchema>;

// Mock data (simulasi data dari API)
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

//================================================================//
//                            KOMPONEN UTAMA                      //
//================================================================//

const SalesDashboardPage = () => {
    // Pro Tip 3: Kelola state untuk loading, data, and error
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simulasi fetching data dari API
        const fetchData = async () => {
            try {
                // di dunia nyata, Anda akan fetch dari API:
                // const response = await fetch('/api/sales-data');
                // const rawData = await response.json();

                // Validasi data dengan Zod
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

        // Tambahkan sedikit delay untuk simulasi network latency
        setTimeout(fetchData, 1000);
    }, []);

    if (isLoading) {
        return <PageContainer><div className='flex items-center justify-center h-full'>Loading dashboard...</div></PageContainer>;
    }

    if (error || !data) {
        return <PageContainer><div className='flex items-center justify-center h-full text-red-500'>Error: {error || "Data could not be loaded."}</div></PageContainer>;
    }

    // Pro Tip 4: Gunakan komponen Card dari Shadcn untuk konsistensi UI
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

                {/* Pro Tip 5: Gunakan CSS Grid untuk layout yang responsif */}
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

//================================================================//
//                      KOMPONEN PENDUKUNG                          //
//================================================================//

// Pro Tip 6: Buat komponen wrapper untuk Chart agar reusable
interface ChartCardProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, description, children }) => (
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
            {/* Pro Tip 7: Gunakan ResponsiveContainer agar chart menyesuaikan ukuran Card */}
            <div className='w-full h-[300px]'>
                <ResponsiveContainer width="100%" height="100%">
                    {children}
                </ResponsiveContainer>
            </div>
        </CardContent>
    </Card>
);


// Contoh Chart 1: Line Chart
const RevenueChart = ({ data }: { data: SalesData[] }) => (
    <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
);

// Contoh Chart 2: Pie Chart
const CategoryPieChart = ({ data }: { data: {name: string, value: number}[] }) => (
     <PieChart>
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

// Contoh Chart 3: Bar Chart
const UnitsSoldChart = ({ data }: { data: SalesData[] }) => (
    <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
        <Legend />
        <Bar dataKey="unitsSold" fill="#82ca9d" />
    </BarChart>
);


export default SalesDashboardPage;