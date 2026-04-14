/**
 * scripts/seed.ts
 * Run: npx tsx scripts/seed.ts
 * Requires SUPABASE_SERVICE_ROLE_KEY + VITE_SUPABASE_URL in .env.local
 *
 * Idempotent — skips rows that already exist (unique constraints / name match).
 */

import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// ─── load .env.local ───────────────────────────────────────────────────────
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// ─── helpers ───────────────────────────────────────────────────────────────
async function upsertBlock(
  page: string,
  section: string,
  field_key: string,
  value: string,
  content_type = "text"
) {
  const { error } = await supabase.from("content_blocks").upsert(
    { page, section, field_key, value, content_type },
    { onConflict: "page,section,field_key" }
  );
  if (error) console.error(`  ✗ content_blocks [${page}/${section}/${field_key}]:`, error.message);
}

async function insertIfAbsent(
  table: string,
  matchCol: string,
  matchVal: string,
  row: Record<string, unknown>
) {
  const { data } = await supabase.from(table).select("id").eq(matchCol, matchVal).maybeSingle();
  if (data) {
    console.log(`  ↩ skip ${table} — "${matchVal}" already exists`);
    return null;
  }
  const { data: inserted, error } = await supabase.from(table).insert(row).select("id").single();
  if (error) {
    console.error(`  ✗ ${table} "${matchVal}":`, error.message);
    return null;
  }
  return inserted.id as string;
}

async function uploadFile(
  bucket: string,
  storagePath: string,
  localPath: string,
  mimeType: string
): Promise<string | null> {
  // Check if already uploaded
  const { data: existing } = await supabase.storage.from(bucket).list(path.dirname(storagePath), {
    search: path.basename(storagePath),
  });
  if (existing && existing.length > 0) {
    console.log(`  ↩ skip upload — ${bucket}/${storagePath} already exists`);
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(storagePath);
    return urlData.publicUrl;
  }

  const fileBuffer = fs.readFileSync(localPath);
  const { error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, fileBuffer, { contentType: mimeType, upsert: false });
  if (error && !error.message.includes("already exists")) {
    console.error(`  ✗ upload ${bucket}/${storagePath}:`, error.message);
    return null;
  }
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  return urlData.publicUrl;
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getMime(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  if ([".jpg", ".jpeg"].includes(ext)) return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".pdf") return "application/pdf";
  return "application/octet-stream";
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. CONTENT BLOCKS
// ═══════════════════════════════════════════════════════════════════════════
async function seedContentBlocks() {
  console.log("\n📄 Seeding content_blocks…");

  // ── HOME ──────────────────────────────────────────────────────────────
  await upsertBlock("home", "hero", "heading", "Vardhman Shiksha Mandir");
  await upsertBlock(
    "home",
    "hero",
    "subheading",
    "Nurturing minds, building character, and shaping the leaders of tomorrow in the heart of Daryaganj, Delhi."
  );
  await upsertBlock("home", "hero", "cta_label", "Admissions Open 2026-27");
  await upsertBlock("home", "hero", "session_year", "2026-27");
  await upsertBlock("home", "hero", "active", "true", "boolean");

  await upsertBlock("home", "announcement_banner", "active", "true", "boolean");

  await upsertBlock("home", "about_preview", "heading", "A Legacy of Excellence in Education");
  await upsertBlock(
    "home",
    "about_preview",
    "body",
    "Vardhman Shiksha Mandir, located in the historic Daryaganj area of Delhi, has been a beacon of quality education since 1976. Our institution blends traditional Indian values with modern pedagogical approaches to create well-rounded individuals."
  );
  await upsertBlock("home", "about_preview", "years_badge", "Since 1976");
  await upsertBlock("home", "about_preview", "button_label", "Read Our Story");

  await upsertBlock(
    "home",
    "highlights",
    "cards",
    JSON.stringify([
      {
        title: "Academics",
        description:
          "Comprehensive CBSE curriculum from Nursery to Class XII with a focus on holistic development.",
        link: "/academics",
      },
      {
        title: "Facilities",
        description:
          "Well-equipped labs, library, sports ground, and smart classrooms for immersive learning.",
        link: "/facilities",
      },
      {
        title: "Student Life",
        description:
          "A vibrant community with clubs, cultural events, sports, and leadership opportunities.",
        link: "/student-life",
      },
    ]),
    "json"
  );

  await upsertBlock("home", "events_preview", "section_heading", "Upcoming Events");
  await upsertBlock("home", "events_preview", "show_count", "3", "number");

  await upsertBlock("home", "gallery_preview", "section_heading", "Photo Gallery");
  await upsertBlock("home", "gallery_preview", "show_count", "8", "number");

  await upsertBlock("home", "admissions_cta", "heading", "Begin Your Child's Journey");
  await upsertBlock(
    "home",
    "admissions_cta",
    "subheading",
    "Admissions are now open for the academic session 2026-27"
  );
  await upsertBlock("home", "admissions_cta", "button_label", "Apply Now");
  await upsertBlock("home", "admissions_cta", "session_year", "2026-27");

  // ── ABOUT ─────────────────────────────────────────────────────────────
  await upsertBlock(
    "about",
    "school_overview",
    "body",
    "VardhmanShikshaMandir Senior Secondary School, located in Daryaganj, New Delhi, was established in 1976. Co-educational, CBSE affiliated (Affiliation No. 2730128, School No. 85012), managed by the Jain Society for the Protection of Orphans in India. Recognized by Directorate of Education, Delhi (School ID: 2127129). Offers classes from Nursery to Class 12 on a 5059 sq. meter urban campus.",
    "richtext"
  );

  await upsertBlock(
    "about",
    "vision",
    "body",
    "To be a centre of educational excellence that nurtures globally competent, socially responsible, and ethically grounded individuals ready to face the challenges of a rapidly changing world.",
    "richtext"
  );

  await upsertBlock(
    "about",
    "mission",
    "points",
    JSON.stringify([
      {
        title: "Holistic Growth",
        description: "Nurture the intellect, values, creativity, and leadership potential of every child.",
      },
      {
        title: "Academic Excellence",
        description:
          "Deliver strong academic outcomes through modern pedagogy and experienced faculty.",
      },
      {
        title: "Character Building",
        description: "Instil discipline, respect, and ethical values that endure for a lifetime.",
      },
      {
        title: "Inclusive Education",
        description: "Provide equal opportunity and support to every learner regardless of background.",
      },
    ]),
    "json"
  );

  await upsertBlock("about", "manager_message", "name", "Charu Jain");
  await upsertBlock("about", "manager_message", "title", "School Manager");
  await upsertBlock(
    "about",
    "manager_message",
    "message",
    "It is with great pride and humility that I welcome you to Vardhman Shiksha Mandir. Since our founding in 1976, we have been committed to providing quality education rooted in strong values. Our school is not merely an institution of learning — it is a second home where every child is encouraged to discover their potential. We remain dedicated to nurturing responsible citizens who contribute meaningfully to society.",
    "richtext"
  );

  await upsertBlock("about", "principal_message", "name", "Seema Kandwal");
  await upsertBlock("about", "principal_message", "title", "Principal");
  await upsertBlock("about", "principal_message", "qualification", "MA, B.Ed");
  await upsertBlock(
    "about",
    "principal_message",
    "message",
    "Education is the most powerful tool with which we can change the world. At Vardhman Shiksha Mandir, we strive every day to kindle the spark of curiosity in our students and guide them toward academic excellence and moral strength. Our dedicated faculty, supportive administration, and engaged community of parents make this journey possible. I invite you to be part of our growing family.",
    "richtext"
  );
  await upsertBlock(
    "about",
    "principal_message",
    "quote",
    "Education transforms lives and communities."
  );

  // ── ACADEMICS ─────────────────────────────────────────────────────────
  await upsertBlock(
    "academics",
    "overview",
    "body",
    "Vardhman Shiksha Mandir follows the Central Board of Secondary Education (CBSE) curriculum and provides a structured, progressive academic programme from Nursery through Class XII. Our pedagogy emphasises conceptual understanding, critical thinking, and practical application alongside academic rigour.",
    "richtext"
  );
  await upsertBlock(
    "academics",
    "class_levels",
    "primary_body",
    "Classes Nursery–V: Foundation stage focusing on language, numeracy, environmental awareness, and creative expression through play-based and activity-driven learning.",
    "richtext"
  );
  await upsertBlock(
    "academics",
    "class_levels",
    "secondary_body",
    "Classes VI–X: Comprehensive CBSE curriculum covering English, Hindi, Mathematics, Science, Social Science, and optional third language (Sanskrit/Computer Science).",
    "richtext"
  );
  await upsertBlock(
    "academics",
    "class_levels",
    "senior_body",
    "Classes XI–XII: Three streams offered — Science (PCB/PCM + Computer Science), Commerce (Economics, Business Studies, Accountancy, Marketing, Entrepreneurship), and Humanities (Political Science, Physical Education). Subject to seat availability at Class XI.",
    "richtext"
  );

  // ── ADMISSIONS ────────────────────────────────────────────────────────
  await upsertBlock(
    "admissions",
    "intro",
    "body",
    "Vardhman Shiksha Mandir welcomes applications for all classes from Nursery to Class XII for the academic session 2026-27. Admissions are conducted in accordance with CBSE and Directorate of Education, Delhi guidelines.",
    "richtext"
  );

  await upsertBlock(
    "admissions",
    "steps",
    "items",
    JSON.stringify([
      { step_number: 1, title: "Collect Registration Form", description: "Obtain the form from the school office (Mon–Sat, 8 AM–3 PM) or download from this website. Registration fee: ₹25." },
      { step_number: 2, title: "Submit Documents", description: "Submit the completed form along with all required documents at the school office." },
      { step_number: 3, title: "Interaction / Entrance", description: "Attend the scheduled interaction session for the student and parent. Class XI admissions based on Class X marks." },
      { step_number: 4, title: "Fee Payment", description: "Pay admission fee (₹200) and caution deposit (₹500) on receiving the admission confirmation letter." },
      { step_number: 5, title: "Confirmation", description: "Collect the school almanac, fee booklet, and uniform details on the first day of attendance." },
    ]),
    "json"
  );

  await upsertBlock(
    "admissions",
    "documents",
    "items",
    JSON.stringify([
      { title: "Birth Certificate", note: "Original + photocopy" },
      { title: "Transfer Certificate (TC)", note: "From previous school; mandatory for Class II onwards" },
      { title: "Recent Passport-sized Photographs", note: "4 copies of student; 2 copies each of parents" },
      { title: "Aadhar Card", note: "Student's Aadhar card photocopy" },
      { title: "Address Proof", note: "Any government-issued document" },
      { title: "Previous Class Report Card", note: "Last two years; Class II onwards" },
      { title: "Parent / Guardian ID Proof", note: "PAN card / Voter ID / Aadhar" },
    ]),
    "json"
  );

  await upsertBlock(
    "admissions",
    "fee_structure",
    "registration_fee",
    "25"
  );
  await upsertBlock("admissions", "fee_structure", "admission_fee", "200");
  await upsertBlock("admissions", "fee_structure", "caution_fee", "500");
  await upsertBlock("admissions", "fee_structure", "tuition_fee", "5110");
  await upsertBlock("admissions", "fee_structure", "annual_charges_general", "10900");
  await upsertBlock("admissions", "fee_structure", "annual_charges_science", "12400");

  await upsertBlock(
    "admissions",
    "cbse_notes",
    "body",
    "For Class X & XII: admission as per CBSE rules only. Class XI: admission subject to seat availability in Science (PCB/PCM), Commerce, and Humanities streams. Promotion to the next class is subject to satisfactory academic performance.",
    "richtext"
  );

  // ── FACILITIES ────────────────────────────────────────────────────────
  await upsertBlock("facilities", "intro", "heading", "Our Facilities");
  await upsertBlock(
    "facilities",
    "intro",
    "subheading",
    "A well-equipped campus spanning 5059 sq. meters in the heart of Daryaganj, New Delhi"
  );
  await upsertBlock(
    "facilities",
    "facilities_grid",
    "items",
    JSON.stringify([
      { name: "Science Laboratories", description: "Fully equipped Physics, Chemistry, and Biology labs for practical learning." },
      { name: "Computer Lab", description: "Modern computer lab with internet connectivity and latest software." },
      { name: "Library", description: "A well-stocked library with reference books, periodicals, and digital resources." },
      { name: "Sports Ground", description: "Spacious ground for outdoor sports, PT, and inter-school competitions." },
      { name: "Smart Classrooms", description: "Interactive boards and audio-visual aids for engaging lessons." },
      { name: "Special Education Room", description: "Dedicated space and specialist support for differently-abled learners." },
    ]),
    "json"
  );
  await upsertBlock(
    "facilities",
    "campus_details",
    "campus_size",
    "5059 sq. meters"
  );
  await upsertBlock(
    "facilities",
    "campus_details",
    "campus_description",
    "Our urban campus in Daryaganj, New Delhi provides a safe and stimulating environment. The building is structurally certified and complies with all fire safety, health, and building norms as mandated by the Directorate of Education, Delhi.",
    "richtext"
  );

  // ── STUDENT LIFE ──────────────────────────────────────────────────────
  await upsertBlock("student-life", "intro", "heading", "Student Life");
  await upsertBlock(
    "student-life",
    "intro",
    "subheading",
    "A vibrant community of learning, growth, and creativity"
  );
  await upsertBlock(
    "student-life",
    "activities",
    "items",
    JSON.stringify([
      { name: "Debate & Public Speaking" },
      { name: "Creative Writing" },
      { name: "Art & Craft" },
      { name: "Music & Dance" },
      { name: "Yoga & Physical Education" },
      { name: "Science Projects" },
      { name: "Photography" },
      { name: "Environmental Club" },
    ]),
    "json"
  );
  await upsertBlock(
    "student-life",
    "clubs",
    "cards",
    JSON.stringify([
      { name: "Science Club", description: "Exploring science through experiments and projects." },
      { name: "Literary Club", description: "Fostering a love for reading, writing, and poetry." },
      { name: "Eco Club", description: "Promoting environmental awareness and sustainability." },
      { name: "Sports Club", description: "Encouraging fitness and competitive sportsmanship." },
      { name: "Cultural Club", description: "Celebrating Indian culture through music, dance, and drama." },
    ]),
    "json"
  );

  // ── CONTACT ───────────────────────────────────────────────────────────
  await upsertBlock("contact", "info", "address", "Daryaganj, New Delhi - 110002, India");
  await upsertBlock("contact", "info", "phone", "01123277448");
  await upsertBlock("contact", "info", "email", "vardhmanschool@yahoo.co.in");
  await upsertBlock("contact", "info", "office_hours", "Mon – Sat: 8:00 AM – 3:00 PM");
  await upsertBlock("contact", "info", "map_embed_url", "");
  await upsertBlock(
    "contact",
    "form_settings",
    "success_message",
    "Thank you! Your message has been sent. We'll get back to you soon."
  );
  await upsertBlock("contact", "form_settings", "form_heading", "Get in Touch");

  console.log("  ✅ content_blocks done");
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. LEADERSHIP
// ═══════════════════════════════════════════════════════════════════════════
async function seedLeadership() {
  console.log("\n👥 Seeding leadership…");

  const rows = [
    {
      role: "School Manager",
      name: "Charu Jain",
      qualification: "",
      bio: "It is with great pride and humility that I welcome you to Vardhman Shiksha Mandir. Since our founding in 1976, we have been committed to providing quality education rooted in strong values. Our school is not merely an institution of learning — it is a second home where every child is encouraged to discover their potential.",
      photo_url: "",
      sort_order: 1,
    },
    {
      role: "Principal",
      name: "Seema Kandwal",
      qualification: "MA, B.Ed",
      bio: "Education is the most powerful tool with which we can change the world. At Vardhman Shiksha Mandir, we strive every day to kindle the spark of curiosity in our students and guide them toward academic excellence and moral strength.",
      photo_url: "",
      sort_order: 2,
    },
    {
      role: "Head Mistress",
      name: "Archana Razdan",
      qualification: "MA, B.Ed",
      bio: "Ensuring a disciplined, inclusive, and supportive environment where every student thrives academically and personally.",
      photo_url: "",
      sort_order: 3,
    },
  ];

  for (const row of rows) {
    const id = await insertIfAbsent("leadership", "name", row.name, row);
    if (id) console.log(`  ✔ leadership: ${row.name}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. FACULTY
// ═══════════════════════════════════════════════════════════════════════════
async function seedFaculty() {
  console.log("\n🧑‍🏫 Seeding faculty…");

  const faculty: Array<{
    name: string;
    designation: string;
    qualification: string;
    department: string;
    sort_order: number;
  }> = [
    // Principal
    { name: "Seema Kandwal", designation: "Principal", qualification: "MA, B.Ed", department: "Administration", sort_order: 1 },

    // PGT
    { name: "Indu Khanna", designation: "PGT", qualification: "", department: "Senior Secondary", sort_order: 10 },
    { name: "Shalini Jain", designation: "PGT", qualification: "", department: "Senior Secondary", sort_order: 11 },
    { name: "Mrigakshi Mahajan", designation: "PGT", qualification: "M.Com, B.Ed, NIIT", department: "Commerce", sort_order: 12 },
    { name: "Jyoti Taneja", designation: "PGT", qualification: "", department: "Senior Secondary", sort_order: 13 },
    { name: "Kirti", designation: "PGT", qualification: "", department: "Senior Secondary", sort_order: 14 },
    { name: "Pranjal", designation: "PGT", qualification: "", department: "Senior Secondary", sort_order: 15 },
    { name: "Bindu Thakran", designation: "PGT", qualification: "M.PED", department: "Physical Education", sort_order: 16 },
    { name: "Rekha", designation: "PGT", qualification: "MSc, B.Ed", department: "Science", sort_order: 17 },
    { name: "Pratibha Sharma", designation: "PGT", qualification: "MSc, B.Ed", department: "Science", sort_order: 18 },
    { name: "Kaushal Kumar Jha", designation: "PGT", qualification: "MSc", department: "Science", sort_order: 19 },

    // TGT
    { name: "Nitika Saxena", designation: "TGT", qualification: "", department: "Secondary", sort_order: 20 },
    { name: "Shanu", designation: "TGT", qualification: "", department: "Secondary", sort_order: 21 },
    { name: "Renu Jain", designation: "TGT", qualification: "", department: "Secondary", sort_order: 22 },
    { name: "Kanika Mehra", designation: "TGT", qualification: "", department: "Secondary", sort_order: 23 },
    { name: "Shubha Jain", designation: "TGT", qualification: "MFA", department: "Fine Arts", sort_order: 24 },
    { name: "Sindhu Jain", designation: "TGT", qualification: "", department: "Secondary", sort_order: 25 },
    { name: "Anita Jain", designation: "TGT", qualification: "", department: "Secondary", sort_order: 26 },
    { name: "Shaifali Mahajan", designation: "TGT", qualification: "", department: "Secondary", sort_order: 27 },
    { name: "Shweta", designation: "TGT", qualification: "", department: "Secondary", sort_order: 28 },
    { name: "Shikha Gupta", designation: "TGT", qualification: "", department: "Secondary", sort_order: 29 },
    { name: "Renu Yadav", designation: "TGT", qualification: "", department: "Secondary", sort_order: 30 },

    // PRT
    { name: "Shalu Jain", designation: "PRT", qualification: "", department: "Primary", sort_order: 40 },
    { name: "Himanshi Sharma", designation: "PRT", qualification: "", department: "Primary", sort_order: 41 },
    { name: "Pooja Jha", designation: "PRT", qualification: "", department: "Primary", sort_order: 42 },
    { name: "Richa Goel", designation: "PRT", qualification: "", department: "Primary", sort_order: 43 },
    { name: "Sunita Verma", designation: "PRT", qualification: "", department: "Primary", sort_order: 44 },
    { name: "Tripti Rustagi", designation: "PRT", qualification: "", department: "Primary", sort_order: 45 },

    // Special / Support
    { name: "Rashmi Jamwal", designation: "Special Educator", qualification: "", department: "Special Education", sort_order: 50 },
    { name: "Sonakshi", designation: "Computer Teacher", qualification: "BCA", department: "Computer Science", sort_order: 51 },
    { name: "Tarun", designation: "Games Teacher", qualification: "BA", department: "Sports", sort_order: 52 },
    { name: "Himani Verma", designation: "Librarian", qualification: "B.LIB", department: "Library", sort_order: 53 },
    { name: "Harish", designation: "Dance Teacher", qualification: "", department: "Arts", sort_order: 54 },
    { name: "Jagriti", designation: "Lab Assistant", qualification: "", department: "Science", sort_order: 55 },
    { name: "Archana Razdan", designation: "Head Mistress", qualification: "MA, B.Ed", department: "Administration", sort_order: 2 },
  ];

  for (const f of faculty) {
    const id = await insertIfAbsent("faculty", "name", f.name, { ...f, photo_url: "", active: true });
    if (id) console.log(`  ✔ faculty: ${f.name} (${f.designation})`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. MANDATORY DOCUMENTS
// ═══════════════════════════════════════════════════════════════════════════
async function seedMandatoryDocuments() {
  console.log("\n📋 Seeding mandatory_documents…");

  const docs = [
    { title: "School Affiliation Letter", sort_order: 1 },
    { title: "Annual Calendar 2026-27", sort_order: 2 },
    { title: "Building Structural Stability Certificate", sort_order: 3 },
    { title: "Fee Structure 2026-27", sort_order: 4 },
    { title: "Fire Safety Certificate", sort_order: 5 },
    { title: "Health Certificate", sort_order: 6 },
    { title: "SMC List (School Management Committee)", sort_order: 7 },
    { title: "List of Teaching Staff", sort_order: 8 },
    { title: "True Copy of Society Registration Certificate", sort_order: 9 },
  ];

  for (const doc of docs) {
    const id = await insertIfAbsent("mandatory_documents", "title", doc.title, {
      ...doc,
      file_url: null,
    });
    if (id) console.log(`  ✔ mandatory_document: ${doc.title}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. UPLOAD IMAGES FROM tmp/drive-assets/
// ═══════════════════════════════════════════════════════════════════════════

const DRIVE_ASSETS = path.resolve(process.cwd(), "tmp", "drive-assets");

async function uploadGallery() {
  console.log("\n🖼  Uploading gallery images…");
  const dir = path.join(DRIVE_ASSETS, "gallery");
  if (!fs.existsSync(dir)) { console.log("  ⚠ gallery dir not found, skipping"); return; }

  const files = fs.readdirSync(dir).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const storagePath = `gallery/${slugify(path.parse(file).name)}-${i + 1}${path.extname(file).toLowerCase()}`;
    const localPath = path.join(dir, file);
    const publicUrl = await uploadFile("gallery", storagePath, localPath, getMime(file));
    if (!publicUrl) continue;

    // Check if this src_url already in gallery_images
    const { data: existing } = await supabase
      .from("gallery_images")
      .select("id")
      .eq("src_url", publicUrl)
      .maybeSingle();
    if (existing) { console.log(`  ↩ skip gallery_images record for ${file}`); continue; }

    const { error } = await supabase.from("gallery_images").insert({
      src_url: publicUrl,
      alt_text: `School gallery photo ${i + 1}`,
      category: "general",
      sort_order: i + 1,
    });
    if (error) console.error(`  ✗ gallery_images insert:`, error.message);
    else console.log(`  ✔ gallery: ${file}`);
  }
}

async function uploadEvents() {
  console.log("\n📅 Uploading event images…");
  const dir = path.join(DRIVE_ASSETS, "events");
  if (!fs.existsSync(dir)) { console.log("  ⚠ events dir not found, skipping"); return; }

  const files = fs.readdirSync(dir).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
  // Group event images into batches of ~5 = one "event"
  const BATCH = 5;
  const batches = Math.ceil(files.length / BATCH);

  for (let b = 0; b < batches; b++) {
    const batchFiles = files.slice(b * BATCH, (b + 1) * BATCH);
    // Use first image as event image
    const firstFile = batchFiles[0];
    const storagePath = `events/event-${b + 1}${path.extname(firstFile).toLowerCase()}`;
    const localPath = path.join(dir, firstFile);
    const publicUrl = await uploadFile("gallery", storagePath, localPath, getMime(firstFile));
    if (!publicUrl) continue;

    // Check if event already exists
    const { data: existing } = await supabase
      .from("events")
      .select("id")
      .eq("image_url", publicUrl)
      .maybeSingle();
    if (existing) { console.log(`  ↩ skip event ${b + 1}`); continue; }

    const { error } = await supabase.from("events").insert({
      title: `School Event ${b + 1}`,
      description: "School activity and cultural programme.",
      event_date: "2026-04-09",
      image_url: publicUrl,
      active: true,
      sort_order: b + 1,
    });
    if (error) console.error(`  ✗ events insert:`, error.message);
    else console.log(`  ✔ event ${b + 1}: ${firstFile}`);
  }
}

async function uploadHero() {
  console.log("\n🏫 Uploading hero images…");
  const dir = path.join(DRIVE_ASSETS, "hero");
  if (!fs.existsSync(dir)) { console.log("  ⚠ hero dir not found, skipping"); return; }

  const files = fs.readdirSync(dir).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
  if (files.length === 0) { console.log("  ⚠ no hero images found"); return; }

  // Upload primary hero image and set in content_blocks
  const primaryFile = files[0];
  const storagePath = `hero/hero-main${path.extname(primaryFile).toLowerCase()}`;
  const localPath = path.join(dir, primaryFile);
  const publicUrl = await uploadFile("hero-images", storagePath, localPath, getMime(primaryFile));
  if (publicUrl) {
    await upsertBlock("home", "hero", "hero_image_url", publicUrl, "image");
    console.log(`  ✔ hero image set: ${primaryFile}`);
  }

  // Upload remaining as gallery
  for (let i = 1; i < files.length; i++) {
    const file = files[i];
    const sp = `hero/hero-${i + 1}${path.extname(file).toLowerCase()}`;
    await uploadFile("hero-images", sp, path.join(dir, file), getMime(file));
    console.log(`  ✔ hero extra: ${file}`);
  }
}

async function uploadFacultyPhotos() {
  console.log("\n👤 Uploading faculty photos…");
  const dir = path.join(DRIVE_ASSETS, "faculty-photos");
  if (!fs.existsSync(dir)) { console.log("  ⚠ faculty-photos dir not found, skipping"); return; }

  const files = fs.readdirSync(dir).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
  for (const file of files) {
    const nameWithoutExt = path.parse(file).name;
    const storagePath = `faculty/${slugify(nameWithoutExt)}${path.extname(file).toLowerCase()}`;
    const localPath = path.join(dir, file);
    const publicUrl = await uploadFile("faculty-photos", storagePath, localPath, getMime(file));
    if (!publicUrl) continue;

    // Try to match to a faculty member by filename
    const { data: faculty } = await supabase
      .from("faculty")
      .select("id, name")
      .ilike("name", `%${nameWithoutExt.replace(/-/g, " ")}%`)
      .maybeSingle();
    if (faculty) {
      await supabase.from("faculty").update({ photo_url: publicUrl }).eq("id", faculty.id);
      console.log(`  ✔ faculty photo matched: ${faculty.name} ← ${file}`);
    } else {
      console.log(`  ⚠ faculty photo uploaded but no match found for: ${file}`);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════
async function main() {
  console.log("🌱 Starting seed script…");
  console.log(`   Supabase: ${SUPABASE_URL}`);

  await seedContentBlocks();
  await seedLeadership();
  await seedFaculty();
  await seedMandatoryDocuments();

  // Image uploads
  await uploadHero();
  await uploadGallery();
  await uploadEvents();
  await uploadFacultyPhotos();

  console.log("\n✅ Seed complete!\n");
}

main().catch(err => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
