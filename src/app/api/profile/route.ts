import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/mongodb';
import Profile from '@/models/Profile';

export async function GET() {
  try {
    await dbConnect();
    const profile = await Profile.findOne();
    return NextResponse.json(profile || {});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const profile = await Profile.create(body);
    revalidatePath('/');
    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    // For profile, we usually update the first one or create if not exists
    const profile = await Profile.findOneAndUpdate({}, body, { upsert: true, new: true });
    revalidatePath('/');
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await dbConnect();
    await Profile.deleteMany({});
    revalidatePath('/');
    return NextResponse.json({ message: 'Profile deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 });
  }
}
