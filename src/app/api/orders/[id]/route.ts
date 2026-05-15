import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const body = await request.json();
    const { orderStatus } = body;

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { orderStatus }
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
