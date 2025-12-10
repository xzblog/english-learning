import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import StudyPlan from "@/models/StudyPlan";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  // @ts-expect-error session.user.id
  const userId = session.user.id;
  const plans = await StudyPlan.find({ userId }).sort({ startDate: -1 });
  return NextResponse.json(plans);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, dailyGoal, targetLevel, startDate } = body;

  if (!name || !dailyGoal || !targetLevel) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await dbConnect();
  // @ts-expect-error session.user.id
  const userId = session.user.id;
  const plan = await StudyPlan.create({
    userId,
    name,
    dailyGoal,
    targetLevel,
    startDate: startDate ? new Date(startDate) : new Date(),
    status: "active",
  });
  return NextResponse.json(plan);
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, status, dailyGoal, name } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await dbConnect();
  const plan = await StudyPlan.findById(id);
  if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (status) plan.status = status;
  if (dailyGoal) plan.dailyGoal = dailyGoal;
  if (name) plan.name = name;
  await plan.save();
  return NextResponse.json(plan);
}
