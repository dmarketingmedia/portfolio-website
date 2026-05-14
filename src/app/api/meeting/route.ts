import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Meeting from '@/models/Meeting';

export async function GET() {
  try {
    await dbConnect();
    const meetings = await Meeting.find().sort({ createdAt: -1 });
    return NextResponse.json(meetings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch meetings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const meeting = await Meeting.create(body);
    return NextResponse.json(meeting, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to schedule meeting' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    const meeting = await Meeting.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(meeting);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update meeting' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    await Meeting.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Meeting deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete meeting' }, { status: 500 });
  }
}
