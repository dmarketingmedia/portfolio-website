import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import dbConnect from '@/lib/mongodb';
import Settings from '@/models/Settings';

export async function GET() {
  try {
    await dbConnect();
    const settings = await Settings.findOne();
    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const settings = await Settings.create(body);
    revalidatePath('/');
    revalidateTag('portfolio');
    return NextResponse.json(settings, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    // For settings, we usually update the first one or create if not exists
    const settings = await Settings.findOneAndUpdate({}, body, { upsert: true, new: true });
    revalidatePath('/');
    revalidateTag('portfolio');
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await dbConnect();
    await Settings.deleteMany({});
    revalidatePath('/');
    revalidateTag('portfolio');
    return NextResponse.json({ message: 'Settings deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete settings' }, { status: 500 });
  }
}
