import { NextApiRequest, NextApiResponse } from 'next';
import { useState } from 'react';

const PRIME_ID = 'p';
const FIBONACCI_ID = 'f';
const EVEN_ID = 'e';
const RANDOM_ID = 'r';

const WINDOW_SIZE = 10;

let windowHistory: number[] = [];

function generateNumber(id: string): number | null {
  switch (id) {
    case PRIME_ID:
      return findNextPrime();
    case FIBONACCI_ID:
      return findNextFibonacci();
    case EVEN_ID:
      return findNextEven();
    case RANDOM_ID:
      return getRandomNumber();
    default:
      return null;
  }
}

function findNextPrime(): number {
  let candidate = 2;
  while (true) {
    if (isPrime(candidate)) {
      return candidate;
    }
    candidate++;
  }
}

function findNextFibonacci(): number {
  let a = 0;
  let b = 1;
  while (true) {
    const next = a + b;
    a = b;
    b = next;
    return next;
  }
}

function findNextEven(): number {
  return Math.floor(Math.random() * 50) * 2;
}

function getRandomNumber(): number {
  return Math.floor(Math.random() * 100) + 1;
}

function isPrime(n: number): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  let i = 5;
  while (i * i <= n) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
    i += 6;
  }
  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const startTime = Date.now();

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  const newNumber = generateNumber(id);

  if (newNumber === null) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  if (!windowHistory.includes(newNumber)) {
    if (windowHistory.length >= WINDOW_SIZE) {
      windowHistory.shift(); // Remove the oldest number
    }
    windowHistory.push(newNumber);
  }

  const average = windowHistory.reduce((acc, num) => acc + num, 0) / windowHistory.length