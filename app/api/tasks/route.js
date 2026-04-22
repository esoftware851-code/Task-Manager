import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';

// GET /api/tasks — List all tasks with optional filters
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // all, active, completed
    const priority = searchParams.get('priority'); // low, medium, high, critical
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest'; // newest, oldest, priority, title

    // Build filter query
    const filter = {};

    if (status === 'active') {
      filter.completed = false;
    } else if (status === 'completed') {
      filter.completed = true;
    }

    if (priority && priority !== 'all') {
      filter.priority = priority;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort query
    let sortQuery = {};
    switch (sort) {
      case 'oldest':
        sortQuery = { createdAt: 1 };
        break;
      case 'priority':
        sortQuery = { priority: -1, createdAt: -1 };
        break;
      case 'title':
        sortQuery = { title: 1 };
        break;
      case 'dueDate':
        sortQuery = { dueDate: 1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }

    const tasks = await Task.find(filter).sort(sortQuery).lean();

    return NextResponse.json({ success: true, data: tasks }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/tasks — Create a new task
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const task = await Task.create(body);

    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
