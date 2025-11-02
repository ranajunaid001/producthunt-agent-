import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: "GET method works",
    method: "GET"
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ 
      message: "POST method works",
      method: "POST",
      received: body
    });
  } catch (error) {
    return NextResponse.json({ 
      message: "POST method works but no JSON body",
      method: "POST"
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}
