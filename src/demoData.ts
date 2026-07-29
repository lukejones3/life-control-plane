export const demoData = {
  person: { name: "Demo User", initials: "DU", city: "Northstar City" },
  alerts: [
    { tone: "rose", title: "Vehicle registration", detail: "Due in 12 days", action: "Review" },
    { tone: "amber", title: "Interview preparation", detail: "Tomorrow · 10:30 AM", action: "Open" },
    { tone: "blue", title: "Trip check-in", detail: "Opens Friday morning", action: "View" },
  ],
  pulse: [
    { label: "Cash runway", value: "5.8 mo", note: "Across connected demo accounts", tone: "mint" },
    { label: "Applications", value: "18", note: "7 active · 3 interviews", tone: "blue" },
    { label: "Open obligations", value: "6", note: "2 due this week", tone: "amber" },
    { label: "Build streak", value: "9 days", note: "14 commits this week", tone: "violet" },
  ],
  applications: [
    { company: "Northwind Labs", role: "Data Platform Engineer", status: "interview", location: "Remote", pay: "$118k–$146k" },
    { company: "Cedar Systems", role: "Analytics Engineer", status: "applied", location: "Hybrid", pay: "$105k–$132k" },
    { company: "Orbit Works", role: "Applied AI Engineer", status: "ready", location: "Remote", pay: "$120k–$160k" },
    { company: "Morrow Data", role: "Data Engineer II", status: "rejected", location: "Remote", pay: "$110k–$138k" },
  ],
  accounts: [
    { institution: "Demo Credit Union", name: "Checking", amount: "$8,420", meta: "$8,130 available" },
    { institution: "Demo Brokerage", name: "Investments", amount: "$14,760", meta: "+4.8% this year" },
    { institution: "Demo Card", name: "Rewards •• 1042", amount: "$684", meta: "$45 due Aug 4" },
  ],
  bills: [
    { name: "Rent", amount: "$1,850", due: "Aug 1", paid: false },
    { name: "Auto insurance", amount: "$126", due: "Aug 6", paid: true },
    { name: "Internet", amount: "$65", due: "Aug 9", paid: false },
  ],
  people: [
    { name: "Maya Chen", relation: "Sister", context: "New apartment · birthday in 18 days", last: "Yesterday", color: "#fb7185" },
    { name: "Noah Reed", relation: "Close friend", context: "Planning the autumn trip", last: "2 days ago", color: "#60a5fa" },
    { name: "Sam Rivera", relation: "Friend", context: "New role starts next week", last: "Friday", color: "#a78bfa" },
  ],
  projects: [
    { name: "Atlas", stage: "Production", commits: 7, next: "Finish event reconciliation", color: "#75e6b6" },
    { name: "Relay", stage: "Private beta", commits: 4, next: "Add policy audit history", color: "#74b9ff" },
    { name: "Life Control Plane", stage: "Prototype", commits: 3, next: "Connect calendar events", color: "#c4a7ff" },
  ],
  songs: [
    { artist: "Demo Artist", title: "Signal Fire", plays: 42 },
    { artist: "Another Band", title: "Afterimage", plays: 31 },
    { artist: "Night Transit", title: "Open Circuit", plays: 24 },
  ],
};
