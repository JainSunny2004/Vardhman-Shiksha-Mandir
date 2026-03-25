import event1 from "@/assets/event1.jpg";
import event2 from "@/assets/event2.jpg";
import event3 from "@/assets/event3.jpg";
import gallery1 from "@/assets/gallery1.jpg";
import gallery2 from "@/assets/gallery2.jpg";
import gallery3 from "@/assets/gallery3.jpg";
import gallery4 from "@/assets/gallery4.jpg";
import academics from "@/assets/academics.jpg";
import facilities from "@/assets/facilities.jpg";
import studentLife from "@/assets/student-life.jpg";
import aboutSchool from "@/assets/about-school.jpg";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  active: boolean;
}

export const defaultEvents: Event[] = [
  {
    id: "1",
    title: "Annual Day Celebration",
    description: "A grand celebration of talent, culture, and academic excellence featuring performances by students across all grades.",
    date: "2026-03-15",
    image: event1,
  },
  {
    id: "2",
    title: "Inter-School Sports Meet",
    description: "Students compete in athletics, cricket, and basketball against top schools in Delhi.",
    date: "2026-04-10",
    image: event2,
  },
  {
    id: "3",
    title: "Science Exhibition",
    description: "Innovative projects and experiments showcased by our young scientists and innovators.",
    date: "2026-05-05",
    image: event3,
  },
];

export const defaultGallery: GalleryImage[] = [
  { id: "1", src: gallery1, alt: "School Building", category: "Campus" },
  { id: "2", src: gallery2, alt: "Computer Lab", category: "Facilities" },
  { id: "3", src: gallery3, alt: "Classroom", category: "Academics" },
  { id: "4", src: gallery4, alt: "Morning Assembly", category: "Student Life" },
  { id: "5", src: academics, alt: "Science Lab", category: "Academics" },
  { id: "6", src: facilities, alt: "Sports Ground", category: "Facilities" },
  { id: "7", src: studentLife, alt: "Cultural Program", category: "Student Life" },
  { id: "8", src: aboutSchool, alt: "Library", category: "Facilities" },
];

export const defaultAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Admissions Open 2026-27",
    content: "Applications are now being accepted for the academic session 2026-27. Apply before June 30.",
    date: "2026-03-01",
    active: true,
  },
  {
    id: "2",
    title: "Summer Camp Registration",
    content: "Register your child for our exciting summer camp program featuring sports, arts, and science activities.",
    date: "2026-04-15",
    active: true,
  },
];

export const highlights = [
  {
    title: "Academics",
    description: "Comprehensive CBSE curriculum from Nursery to Class XII with a focus on holistic development.",
    image: academics,
    link: "/academics",
  },
  {
    title: "Facilities",
    description: "State-of-the-art labs, library, sports complex, and smart classrooms for immersive learning.",
    image: facilities,
    link: "/facilities",
  },
  {
    title: "Student Life",
    description: "A vibrant community with clubs, cultural events, sports, and leadership opportunities.",
    image: studentLife,
    link: "/student-life",
  },
];
