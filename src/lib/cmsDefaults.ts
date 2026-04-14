import academics from "@/assets/academics.jpg";
import facilities from "@/assets/facilities.jpg";
import studentLife from "@/assets/student-life.jpg";
import heroImg from "@/assets/hero-school.jpg";
import aboutImg from "@/assets/about-school.jpg";

export const homeDefaults = {
  hero: {
    heading: "Vardhman Shiksha Mandir",
    subheading:
      "Nurturing minds, building character, and shaping the leaders of tomorrow in the heart of Daryaganj, Delhi.",
    hero_image_url: heroImg,
    cta_label: "Admissions Open",
    session_year: "2026-27",
    active: true,
  },
  announcement_banner: {
    active: true,
  },
  about_preview: {
    heading: "A Legacy of Excellence in Education",
    body:
      "Vardhman Shiksha Mandir, located in the historic Daryaganj area of Delhi, has been a beacon of quality education. Our institution blends traditional Indian values with modern pedagogical approaches to create well-rounded individuals.",
    years_badge: "Since 1976",
    button_label: "Read Our Story",
    image_url: aboutImg,
  },
  highlights: {
    cards: [
      {
        title: "Academics",
        description:
          "Comprehensive CBSE curriculum from Nursery to Class XII with a focus on holistic development.",
        image_url: academics,
        link: "/academics",
      },
      {
        title: "Facilities",
        description:
          "State-of-the-art labs, library, sports complex, and smart classrooms for immersive learning.",
        image_url: facilities,
        link: "/facilities",
      },
      {
        title: "Student Life",
        description:
          "A vibrant community with clubs, cultural events, sports, and leadership opportunities.",
        image_url: studentLife,
        link: "/student-life",
      },
    ],
  },
  events_preview: {
    section_heading: "Upcoming Events",
    show_count: 3,
  },
  gallery_preview: {
    section_heading: "Photo Gallery",
    show_count: 8,
  },
  admissions_cta: {
    heading: "Begin Your Child's Journey",
    subheading: "Admissions are now open for the academic session",
    button_label: "Apply Now",
    session_year: "2026-27",
  },
};

export const aboutDefaults = {
  school_overview: {
    body:
      "VardhmanShikshaMandir Senior Secondary School, located in Daryaganj, New Delhi, was established in 1976.",
  },
  vision: {
    body:
      "To be a centre of educational excellence that nurtures globally competent, socially responsible, and ethically grounded individuals.",
  },
  mission: {
    points: [
      { title: "Holistic Growth", description: "Nurture intellect, values, and leadership." },
      { title: "Academic Excellence", description: "Deliver strong outcomes with modern pedagogy." },
    ],
  },
  manager_message: {
    name: "Charu Jain",
    title: "School Manager",
    message:
      "Under the able guidance of our School Manager, Vardhman Shiksha Mandir continues to grow as a centre of academic excellence.",
    photo_url: "",
  },
  principal_message: {
    name: "Seema Kandwal",
    title: "Principal",
    message:
      "With a vision rooted in compassion and rigour, our Principal leads the school with a commitment to nurturing every child's potential.",
    photo_url: "",
    quote: "Education transforms lives and communities.",
  },
  leadership_cards: {
    cards: [
      {
        role: "School Manager",
        name: "Charu Jain",
        qualification: "",
        bio: "Guiding the school towards academic excellence and value-based education.",
        photo_url: "",
      },
      {
        role: "Principal",
        name: "Seema Kandwal",
        qualification: "MA, B.Ed",
        bio: "Leading with compassion, discipline, and educational rigour.",
        photo_url: "",
      },
      {
        role: "Head Mistress",
        name: "Archana Razdan",
        qualification: "MA, B.Ed",
        bio: "Ensuring a disciplined, inclusive, and supportive environment.",
        photo_url: "",
      },
    ],
  },
};

export const studentLifeDefaults = {
  intro: {
    heading: "Student Life",
    subheading: "A vibrant community of learning, growth, and creativity",
  },
  activities: {
    items: [
      { name: "Debate & Public Speaking" },
      { name: "Creative Writing" },
      { name: "Art & Craft" },
      { name: "Music & Dance" },
      { name: "Robotics" },
      { name: "Coding Club" },
      { name: "Photography" },
      { name: "Environmental Club" },
    ],
  },
  clubs: {
    cards: [
      { name: "Science Club", description: "Exploring science through experiments and projects." },
      { name: "Literary Club", description: "Fostering a love for reading, writing, and poetry." },
      { name: "Eco Club", description: "Promoting environmental awareness and sustainability." },
      { name: "Sports Club", description: "Encouraging fitness and competitive sportsmanship." },
    ],
  },
};

export const contactDefaults = {
  info: {
    address: "Daryaganj, New Delhi - 110002, India",
    phone: "01123277448",
    email: "vardhmanschool@yahoo.co.in",
    office_hours: "Mon - Sat: 8:00 AM - 3:00 PM",
    map_embed_url: "",
  },
  form_settings: {
    success_message: "Thank you! Your message has been sent. We'll get back to you soon.",
    form_heading: "Get in Touch",
  },
};
