
import { Letter, Template, Variable } from './types';

export const VARIABLE_TAGS: Variable[] = [
  { tag: '[Recipient Name]', description: 'Full name of the recipient' },
  { tag: '[Recipient Address]', description: 'Full address of the recipient' },
  { tag: '[Sender Name]', description: 'Full name of the sender' },
  { tag: '[Sender Title]', description: 'Job title of the sender' },
  { tag: '[Company Name]', description: 'Name of the sender\'s company' },
  { tag: '[Date]', description: 'Current date of sending' },
  { tag: '[Reference Number]', description: 'A unique reference for the letter' },
];

export const DEFAULT_LETTERS: Letter[] = [
  {
    id: 'l1',
    title: 'Project Kickoff Announcement',
    content: `Dear Team,\n\nThis letter is to formally announce the kickoff of our new project, "Phoenix".\n\nThe initial planning meeting is scheduled for [Date] at 10:00 AM.\n\nBest regards,\n[Sender Name]`,
    lastModified: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'l2',
    title: 'Q3 Performance Review',
    content: `Hi [Recipient Name],\n\nThis is a follow-up to our discussion regarding your performance in the third quarter. We appreciate your hard work and dedication.\n\nWe will schedule a meeting next week to discuss goals for Q4.\n\nSincerely,\n[Sender Name]\n[Sender Title]`,
    lastModified: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 't1',
    name: 'Formal Resignation',
    content: `[Date]\n\n[Recipient Name]\n[Recipient Address]\n\nDear [Recipient Name],\n\nPlease accept this letter as formal notification that I am resigning from my position as [Sender Title] at [Company Name]. My last day of employment will be two weeks from today.\n\nThank you for the opportunity to have worked here. I wish you and [Company Name] all the very best for the future.\n\nSincerely,\n[Sender Name]`,
  },
  {
    id: 't2',
    name: 'Job Offer Letter',
    content: `[Date]\n\n[Recipient Name]\n[Recipient Address]\n\nDear [Recipient Name],\n\nOn behalf of [Company Name], I am pleased to offer you the position of [Job Title]. We were very impressed with your qualifications and experience.\n\nYour start date will be [Start Date]. Please find the detailed offer attached.\n\nWe look forward to you joining our team.\n\nBest regards,\n[Sender Name]\n[Sender Title]`,
  },
];
