import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Navigation from '@/models/Navigation';

export async function GET() {
  try {
    await dbConnect();
    const navItems = await Navigation.find().sort({ displayOrder: 1 });
    return NextResponse.json(navItems);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch navigation' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const navItem = await Navigation.create(body);
    return NextResponse.json(navItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create navigation item' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    
    // Support both ID in URL and ID in body
    const targetId = id || body._id;
    
    if (!targetId) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const { _id, ...updateData } = body;
    const navItem = await Navigation.findByIdAndUpdate(targetId, updateData, { new: true });
    return NextResponse.json(navItem);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update navigation item' }, { status: 500 });
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
    await Navigation.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Navigation item deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete navigation item' }, { status: 500 });
  }
}
