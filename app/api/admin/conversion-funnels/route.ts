import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get('days') || '7';
    const days = parseInt(daysParam);

    let dateFilter = '';
    if (days > 0) {
      dateFilter = `AND cf.created_at >= NOW() - INTERVAL '${days} days'`;
    }

    // Get all funnel steps with their data
    const result = await query(
      `SELECT 
        cf.step,
        cf.step_order,
        COUNT(*) as count,
        COUNT(CASE WHEN cf.completed = true THEN 1 END) as completed_count,
        ROUND(COUNT(CASE WHEN cf.completed = true THEN 1 END)::numeric / COUNT(*), 3) as completion_rate
      FROM conversion_funnels cf
      WHERE 1=1 ${dateFilter}
      GROUP BY cf.step, cf.step_order
      ORDER BY cf.step_order ASC`
    );

    const steps = result.rows;

    // Calculate dropoff rates
    const stepsWithDropoff = steps.map((step: any, index: number) => {
      let dropoffCount = 0;
      let dropoffRate = 0;

      if (index > 0) {
        const prevStep = steps[index - 1];
        dropoffCount = parseInt(prevStep.count) - parseInt(step.count);
        dropoffRate = dropoffCount > 0 ? dropoffCount / parseInt(prevStep.count) : 0;
      }

      return {
        step: step.step,
        step_order: step.step_order,
        count: parseInt(step.count),
        completed_count: parseInt(step.completed_count),
        completion_rate: parseFloat(step.completion_rate),
        dropoff_count: dropoffCount,
        dropoff_rate: dropoffRate
      };
    });

    // Get totals
    const firstStep = stepsWithDropoff[0];
    const lastStep = stepsWithDropoff[stepsWithDropoff.length - 1];

    const totalStarted = firstStep?.count || 0;
    const totalCompleted = lastStep?.completed_count || 0;
    const overallCompletionRate = totalStarted > 0 ? totalCompleted / totalStarted : 0;

    return NextResponse.json({
      steps: stepsWithDropoff,
      total_started: totalStarted,
      total_completed: totalCompleted,
      overall_completion_rate: overallCompletionRate
    });
  } catch (error) {
    console.error('Error fetching funnel data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch funnel data', details: (error as Error).message },
      { status: 500 }
    );
  }
}
