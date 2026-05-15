import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, pickupTime, items } = body;

    // Hitung total harga dari server untuk keamanan
    const totalAmount = items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);

    const order = await prisma.order.create({
      data: {
        customerName,
        pickupTime: new Date(pickupTime), // Di sini kita asumsikan sudah dikirim format Date/ISO yang valid
        totalAmount,
        paymentStatus: 'SUCCESS', // Karena kita simulasikan sukses
        orderStatus: 'PREPARING',
        items: {
          create: items.map((item: any) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity
          }))
        }
      }
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
