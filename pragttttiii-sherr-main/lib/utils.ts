import { type ClassValue, clsx } from 'clsx';
import { RiskTier } from '@/lib/types';
import { CONFIDENCE_LABELS } from '@/lib/constants';

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function formatCurrency(amountCrore: number): string {
  return `₹${amountCrore.toLocaleString('en-IN')} Cr`;
}

export function formatLakhCrore(amountLakhCrore: number): string {
  return `₹${amountLakhCrore.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Lakh Cr`;
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function formatMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function getRiskTierFromScore(score: number): RiskTier {
  if (score <= 30) return 'low';
  if (score <= 55) return 'medium';
  if (score <= 75) return 'high';
  return 'critical';
}

export function getConfidenceLabel(confidence: number): { label: string, color: string } {
  const match = CONFIDENCE_LABELS.find(l => confidence >= l.min && confidence < l.max);
  return match || CONFIDENCE_LABELS[0];
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function formatCostEscalation(original: number, revised: number): { percentage: string, isEscalated: boolean } {
  if (original <= 0) return { percentage: '0.0%', isEscalated: false };
  const diff = revised - original;
  const isEscalated = diff > 0;
  const percentage = (Math.abs(diff) / original) * 100;
  return { percentage: `${percentage.toFixed(1)}%`, isEscalated };
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
