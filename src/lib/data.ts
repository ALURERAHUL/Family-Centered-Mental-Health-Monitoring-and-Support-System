export type FamilyMember = {
  id: string;
  name: string;
  avatar: string;
  relationship: string;
};

export type Mood = 'happy' | 'calm' | 'meh' | 'sad' | 'anxious' | 'angry' | 'stressed';

export type MoodEntry = {
  id: string;
  memberId: string;
  mood: Mood;
  notes?: string;
  date: string; // YYYY-MM-DD
};

export type CalendarEvent = {
  id: string;
  memberIds: string[]; // can be for multiple members
  title: string;
  date: string; // YYYY-MM-DD
  allDay: boolean;
};

export type ForumPost = {
  id: string;
  memberId: string;
  content: string;
  timestamp: string; // ISO 8601
};

export const familyMembers: FamilyMember[] = [
  { id: '1', name: 'You', avatar: 'https://placehold.co/40x40.png', relationship: 'You' },
  { id: '2', name: 'Alex', avatar: 'https://placehold.co/40x40.png', relationship: 'Spouse' },
  { id: '3', name: 'Mia', avatar: 'https://placehold.co/40x40.png', relationship: 'Daughter' },
  { id: '4', name: 'Leo', avatar: 'https://placehold.co/40x40.png', relationship: 'Son' },
];

export const moodEntries: MoodEntry[] = [
  { id: 'm1', memberId: '1', mood: 'calm', notes: 'Feeling pretty good today.', date: '2024-07-20' },
  { id: 'm2', memberId: '2', mood: 'happy', notes: 'Great day at work!', date: '2024-07-20' },
  { id: 'm3', memberId: '3', mood: 'sad', notes: 'Struggled with homework.', date: '2024-07-20' },
  { id: 'm4', memberId: '1', mood: 'anxious', notes: 'Worried about the upcoming presentation.', date: '2024-07-21' },
  { id: 'm5', memberId: '4', mood: 'happy', notes: 'Scored a goal in soccer practice!', date: '2024-07-21' },
  { id: 'm6', memberId: '3', mood: 'anxious', notes: 'Big test tomorrow.', date: '2024-07-22' },
  { id: 'm7', memberId: '2', mood: 'stressed', notes: 'Tight deadline at work.', date: '2024-07-22' },
];

export const calendarEvents: CalendarEvent[] = [
    { id: 'e1', memberIds: ['3'], title: "Mia's School Play", date: '2024-07-25', allDay: false },
    { id: 'e2', memberIds: ['4'], title: "Leo's Soccer Game", date: '2024-07-27', allDay: false },
    { id: 'e3', memberIds: ['1', '2'], title: 'Date Night', date: '2024-07-27', allDay: false },
    { id: 'e4', memberIds: ['1', '2', '3', '4'], title: 'Family Picnic', date: '2024-07-28', allDay: true },
    { id: 'e5', memberIds: ['1'], title: "Work Presentation", date: '2024-07-22', allDay: false },
    { id: 'e6', memberIds: ['2'], title: "Project Deadline", date: '2024-07-22', allDay: false },
    { id: 'e7', memberIds: ['3'], title: "Math Test", date: '2024-07-23', allDay: false },
];

export const forumPosts: ForumPost[] = [
  { id: 'p1', memberId: '2', content: 'Who\'s excited for the picnic this weekend?', timestamp: '2024-07-22T10:00:00Z' },
  { id: 'p2', memberId: '3', content: 'Me! I hope we can play frisbee.', timestamp: '2024-07-22T10:05:00Z' },
  { id: 'p3', memberId: '1', content: 'Let\'s not forget to pack sunscreen. Good luck on your test tomorrow, Mia!', timestamp: '2024-07-22T11:30:00Z' },
  { id: 'p4', memberId: '3', content: 'Thanks! A bit nervous but I studied hard.', timestamp: '2024-07-22T12:00:00Z' },
];
