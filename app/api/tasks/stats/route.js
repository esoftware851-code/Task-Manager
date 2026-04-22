import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';

// GET /api/tasks/stats — Get dashboard statistics
export async function GET() {
  try {
    await dbConnect();

    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ completed: true });
    const activeTasks = await Task.countDocuments({ completed: false });
    const completionRate = totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

    // Count by priority
    const priorityBreakdown = await Task.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    const priorities = { low: 0, medium: 0, high: 0, critical: 0 };
    priorityBreakdown.forEach((p) => {
      priorities[p._id] = p.count;
    });

    // Count by category
    const categoryBreakdown = await Task.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Overdue tasks
    const overdueTasks = await Task.countDocuments({
      completed: false,
      dueDate: { $lt: new Date(), $ne: null },
    });

    // Recent tasks (last 5)
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: {
          totalTasks,
          completedTasks,
          activeTasks,
          completionRate,
          priorities,
          categories: categoryBreakdown,
          overdueTasks,
          recentTasks,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
