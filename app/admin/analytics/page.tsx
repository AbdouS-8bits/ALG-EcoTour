"use client"; 
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import EmailMarketingDashboard from '@/components/admin/EmailMarketingDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AnalyticsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Marketing</h1>
        <p className="text-gray-600 mt-1">Track performance and manage campaigns</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex gap-4 px-6">
            <button
              onClick={(e) => {
                const target = e.currentTarget;
                document.querySelectorAll('[data-tab]').forEach(el => el.classList.remove('active'));
                target.classList.add('active');
                document.querySelectorAll('[data-content]').forEach(el => el.classList.add('hidden'));
                document.querySelector('[data-content="analytics"]')?.classList.remove('hidden');
              }}
              data-tab="analytics"
              className="active px-4 py-3 font-medium border-b-2 border-transparent hover:border-gray-300 data-[active]:border-green-600 data-[active]:text-green-600"
            >
              Analytics
            </button>
            <button
              onClick={(e) => {
                const target = e.currentTarget;
                document.querySelectorAll('[data-tab]').forEach(el => el.classList.remove('active'));
                target.classList.add('active');
                document.querySelectorAll('[data-content]').forEach(el => el.classList.add('hidden'));
                document.querySelector('[data-content="marketing"]')?.classList.remove('hidden');
              }}
              data-tab="marketing"
              className="px-4 py-3 font-medium border-b-2 border-transparent hover:border-gray-300 data-[active]:border-green-600 data-[active]:text-green-600"
            >
              Email Marketing
            </button>
          </div>
        </div>

        <div data-content="analytics">
          <AnalyticsDashboard />
        </div>

        <div data-content="marketing" className="hidden">
          <EmailMarketingDashboard />
        </div>
      </div>
    </div>
  );
}
