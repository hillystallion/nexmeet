import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 7; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

const BADGE_TYPES = [
  { type: "first_checkin", name: "First Steps" },
  { type: "streak_3", name: "On a Roll" },
  { type: "streak_7", name: "Week Warrior" },
  { type: "events_10", name: "Regular" },
  { type: "events_25", name: "Dedicated" },
  { type: "events_50", name: "Veteran" },
  { type: "early_bird", name: "Early Bird" },
  { type: "night_owl", name: "Night Owl" },
  { type: "social_butterfly", name: "Social Butterfly" },
  { type: "feedback_star", name: "Feedback Star" },
];

async function main() {
  console.log("🌱 Seeding NexMeet database...");

  await prisma.badge.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  await prisma.host.deleteMany();

  const hostPassword = await bcrypt.hash("password123", 12);

  const host = await prisma.host.create({
    data: {
      name: "Professor Timothy Wong",
      email: "host@example.com",
      password: hostPassword,
      organization: "NexMeet Events Inc.",
    },
  });

  const host2 = await prisma.host.create({
    data: {
      name: "Dr. Sarah Chen",
      email: "sarah@example.com",
      password: hostPassword,
      organization: "Tech Academy",
    },
  });

  const host3 = await prisma.host.create({
    data: {
      name: "Mark Rivera",
      email: "mark@example.com",
      password: hostPassword,
      organization: "Innovation Labs",
    },
  });

  console.log("✅ Created 3 organizers");

  const userPassword = await bcrypt.hash("password123", 12);
  const userNames = [
    "Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Prince",
    "Edward Norton", "Fiona Apple", "George Lucas", "Hannah Montana",
    "Ivan Drago", "Julia Roberts", "Kevin Hart", "Laura Palmer",
    "Michael Scott", "Nancy Drew", "Oscar Wilde", "Patricia Arquette",
    "Quinn Hughes", "Rachel Green", "Steve Rogers", "Tina Turner",
    "Uma Thurman", "Victor Hugo", "Wendy Darling", "Xavier Charles",
    "Yara Shahidi", "Zoe Saldana", "Liam Parker", "Emma Watson",
    "Noah Davis", "Olivia Rodrigo",
  ];

  const bios = [
    "Software engineer passionate about tech events",
    "Product manager who loves networking",
    "UX designer always learning",
    "Data scientist exploring new frontiers",
    "Full-stack developer & conference enthusiast",
    "Cybersecurity analyst staying sharp",
    "DevOps engineer automating everything",
    "Student eager to learn and grow",
    "Startup founder building the future",
    "AI researcher pushing boundaries",
  ];

  const users = [];
  const usedCodes = new Set<string>();
  for (let i = 0; i < userNames.length; i++) {
    const name = userNames[i];
    let code = generateCode();
    while (usedCodes.has(code)) code = generateCode();
    usedCodes.add(code);

    const email = name.toLowerCase().replace(/\s/g, ".") + "@example.com";
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: userPassword,
        code,
        bio: bios[i % bios.length],
        points: Math.floor(Math.random() * 500) + 50,
        level: Math.floor(Math.random() * 5) + 1,
        streak: Math.floor(Math.random() * 15),
      },
    });
    users.push(user);
  }
  console.log(`✅ Created ${users.length} attendees`);

  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - now.getDay() + 1);

  const eventTemplates = [
    { title: "Weekly Team Standup", type: "Meeting", location: "Room 101", day: 0, startH: 9, endH: 10, capacity: 30, featured: false },
    { title: "Tech Interview - Frontend", type: "Interview", location: "Room 203", day: 0, startH: 11, endH: 12, capacity: 5, featured: false },
    { title: "React & Next.js Workshop", type: "Workshop", location: "Lab A", day: 0, startH: 14, endH: 16, capacity: 40, featured: true },
    { title: "Security Awareness Training", type: "Training", location: "Auditorium", day: 1, startH: 9, endH: 11, capacity: 100, featured: false },
    { title: "Product Review Meeting", type: "Meeting", location: "Room 101", day: 1, startH: 13, endH: 14, capacity: 20, featured: false },
    { title: "Cloud Architecture Seminar", type: "Seminar", location: "Lecture Hall B", day: 1, startH: 15, endH: 17, capacity: 80, featured: true },
    { title: "Sprint Planning", type: "Meeting", location: "Room 101", day: 2, startH: 9, endH: 10, capacity: 15, featured: false },
    { title: "UX Design Masterclass", type: "Workshop", location: "Lab B", day: 2, startH: 11, endH: 13, capacity: 35, featured: true },
    { title: "Tech Interview - Backend", type: "Interview", location: "Room 203", day: 2, startH: 14, endH: 15, capacity: 5, featured: false },
    { title: "AI & Data Science Conference", type: "Conference", location: "Main Hall", day: 3, startH: 9, endH: 17, capacity: 200, featured: true },
    { title: "Leadership & Management Training", type: "Training", location: "Room 305", day: 3, startH: 10, endH: 12, capacity: 50, featured: false },
    { title: "API Design Best Practices", type: "Workshop", location: "Lab A", day: 4, startH: 9, endH: 12, capacity: 30, featured: false },
    { title: "Sprint Retrospective", type: "Meeting", location: "Room 101", day: 4, startH: 14, endH: 15, capacity: 15, featured: false },
    { title: "Cybersecurity Deep Dive", type: "Seminar", location: "Auditorium", day: 4, startH: 15, endH: 17, capacity: 100, featured: true },
    { title: "DevOps & CI/CD Workshop", type: "Training", location: "Lab C", day: 5, startH: 9, endH: 12, capacity: 40, featured: false },
    // Previous week
    { title: "Agile Methodology Training", type: "Training", location: "Room 101", day: -7, startH: 9, endH: 11, capacity: 50, featured: false },
    { title: "AI/ML Summit 2026", type: "Conference", location: "Main Hall", day: -6, startH: 9, endH: 17, capacity: 200, featured: true },
    { title: "Database Optimization Workshop", type: "Workshop", location: "Lab A", day: -5, startH: 14, endH: 16, capacity: 30, featured: false },
    { title: "Team Building & Strategy", type: "Meeting", location: "Room 101", day: -4, startH: 10, endH: 11, capacity: 20, featured: false },
    { title: "Blockchain & Web3 Lecture", type: "Seminar", location: "Lecture Hall B", day: -3, startH: 13, endH: 15, capacity: 80, featured: true },
    // Next week
    { title: "Kubernetes Masterclass", type: "Workshop", location: "Lab A", day: 7, startH: 9, endH: 12, capacity: 35, featured: true },
    { title: "Q2 Planning Session", type: "Meeting", location: "Room 101", day: 8, startH: 10, endH: 12, capacity: 20, featured: false },
    { title: "Rust Programming Intro", type: "Training", location: "Lab B", day: 9, startH: 14, endH: 17, capacity: 25, featured: false },
    { title: "Tech Hiring Panel", type: "Interview", location: "Room 203", day: 10, startH: 9, endH: 12, capacity: 10, featured: false },
    { title: "Innovation Hackathon", type: "Conference", location: "Main Hall", day: 11, startH: 9, endH: 18, capacity: 150, featured: true },
  ];

  const hosts = [host, host2, host3];
  const events = [];
  for (let i = 0; i < eventTemplates.length; i++) {
    const t = eventTemplates[i];
    const start = new Date(monday);
    start.setDate(monday.getDate() + t.day);
    start.setHours(t.startH, 0, 0, 0);

    const end = new Date(monday);
    end.setDate(monday.getDate() + t.day);
    end.setHours(t.endH, 0, 0, 0);

    const event = await prisma.event.create({
      data: {
        title: t.title,
        type: t.type,
        location: t.location,
        description: `Join us for ${t.title.toLowerCase()} — an exciting ${t.type.toLowerCase()} event designed to inspire and educate.`,
        startTime: start,
        endTime: end,
        hostId: hosts[i % 3].id,
        capacity: t.capacity,
        featured: t.featured,
      },
    });
    events.push(event);
  }
  console.log(`✅ Created ${events.length} events`);

  // Create attendance + ratings for past events
  let attendanceCount = 0;
  let ratingCount = 0;
  const pastEvents = events.filter((e) => new Date(e.endTime) < now);

  for (const event of pastEvents) {
    const numAttendees = 5 + Math.floor(Math.random() * 15);
    const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
    const attendees = shuffledUsers.slice(0, Math.min(numAttendees, event.capacity || 999));

    for (const user of attendees) {
      const pointsEarned = event.featured ? 20 : 10;
      await prisma.attendance.create({
        data: {
          userId: user.id,
          eventId: event.id,
          checkedIn: new Date(
            new Date(event.startTime).getTime() + Math.floor(Math.random() * 30) * 60000
          ),
          points: pointsEarned,
        },
      });
      attendanceCount++;

      // ~60% leave a rating
      if (Math.random() < 0.6) {
        const comments = [
          "Great session, learned a lot!",
          "Very informative and well organized.",
          "Could use more hands-on examples.",
          "Excellent speaker, would attend again!",
          "Good content but a bit fast-paced.",
          "Loved the interactive Q&A section.",
          "Perfect for beginners and intermediates.",
          "One of the best events this quarter!",
          null,
          null,
        ];
        await prisma.rating.create({
          data: {
            userId: user.id,
            eventId: event.id,
            score: Math.floor(Math.random() * 3) + 3, // 3-5 stars
            comment: comments[Math.floor(Math.random() * comments.length)],
          },
        });
        ratingCount++;
      }
    }
  }
  console.log(`✅ Created ${attendanceCount} attendance records`);
  console.log(`✅ Created ${ratingCount} ratings`);

  // Award badges to top users
  const topUsers = users.slice(0, 15);
  let badgeCount = 0;
  for (const user of topUsers) {
    const numBadges = 1 + Math.floor(Math.random() * 4);
    const shuffledBadges = [...BADGE_TYPES].sort(() => Math.random() - 0.5);
    for (let i = 0; i < numBadges; i++) {
      await prisma.badge.create({
        data: {
          userId: user.id,
          type: shuffledBadges[i].type,
          name: shuffledBadges[i].name,
        },
      });
      badgeCount++;
    }
  }
  console.log(`✅ Awarded ${badgeCount} badges`);

  // Recalculate points for users based on attendance
  for (const user of users) {
    const totalPoints = await prisma.attendance.aggregate({
      where: { userId: user.id },
      _sum: { points: true },
    });
    const pts = totalPoints._sum.points || 0;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        points: pts,
        level: Math.floor(pts / 100) + 1,
      },
    });
  }
  console.log("✅ Updated user points and levels");

  console.log("\n🎉 NexMeet seeding complete!");
  console.log("\n📋 Login Credentials:");
  console.log("  Organizer: host@example.com / password123");
  console.log("  Attendee:  alice.johnson@example.com / password123");
  console.log("  (All accounts share password: password123)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
