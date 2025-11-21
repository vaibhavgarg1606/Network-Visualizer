import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import mime from 'mime';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const relativePath = searchParams.get('path');

  if (!relativePath) {
    return new NextResponse('Missing path parameter', { status: 400 });
  }

  // Hardcoded path as requested
  const BASE_PATH = path.normalize('d:/VAIBHAV/Machine_learning/clg_proj/visxai/backend/output');
  const fullPath = path.normalize(path.join(BASE_PATH, relativePath));

  console.log(`API Request: ${relativePath}`);
  console.log(`Base Path: ${BASE_PATH}`);
  console.log(`Full Path: ${fullPath}`);

  // Security check: ensure we don't traverse out of the base path
  if (!fullPath.startsWith(BASE_PATH)) {
    console.error('Invalid path traversal attempt');
    return new NextResponse('Invalid path', { status: 403 });
  }

  if (!fs.existsSync(fullPath)) {
    console.error('File not found:', fullPath);
    return new NextResponse('File not found', { status: 404 });
  }

  try {
    const fileBuffer = fs.readFileSync(fullPath);
    const mimeType = mime.getType(fullPath) || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error reading file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
