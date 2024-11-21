'use server';

import { Client, Functions, ExecutionMethod } from 'appwrite';
import { NextResponse } from 'next/server';

export default async function doFn() {
  const client = new Client();
  client.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!); // Your project ID
  const functions = new Functions(client);

  try {
    const data = await functions.createExecution('tofo', '', false, '/', ExecutionMethod.GET);
    return JSON.parse(data.responseBody);
  } catch (err) {
    return {
      error: 'Invalid Credentials',
    };
  }
}
