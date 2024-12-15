// middleware/pagination.ts
import { NextRequest, NextResponse } from 'next/server';

export async function paginationMiddleware(req: NextRequest) {
  const url = new URL(req.url);
  const page = url.searchParams.get('page') || '1';
  const limit = url.searchParams.get('limit') || '50';
  
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const skip = (pageNumber - 1) * limitNumber;

  // Instead of modifying the request directly, we'll return the pagination data
  return { page: pageNumber, limit: limitNumber, skip };
}