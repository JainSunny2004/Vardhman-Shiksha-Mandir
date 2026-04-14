import PageSEO from "@/components/PageSEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useFaculty } from "@/hooks/useContentBlocks";
import { Skeleton } from "@/components/ui/skeleton";

const Faculty = () => {
  const facultyQuery = useFaculty();

  if (facultyQuery.isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <section className="section-padding"><Skeleton className="h-80 w-full" /></section>
        <Footer />
      </div>
    );
  }

  if (facultyQuery.error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <section className="section-padding"><div className="text-sm text-destructive">Failed to load faculty.</div></section>
        <Footer />
      </div>
    );
  }

  const faculty = facultyQuery.data ?? [];
  const groups = Object.entries(
    faculty.reduce<Record<string, typeof faculty>>((acc, member) => {
      const key = member.designation || "Faculty";
      if (!acc[key]) acc[key] = [];
      acc[key].push(member);
      return acc;
    }, {}),
  ).map(([designation, members]) => ({ designation, members }));

  return (
    <div className="min-h-screen">
      <PageSEO
        title="Our Faculty"
        description="Meet the dedicated teaching staff at Vardhman Shiksha Mandir — Principal, PGT, TGT, PRT, and support staff. 36 educators committed to nurturing every student."
        path="/faculty"
      />
      <Navbar />
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="relative container-narrow mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Our Faculty</h1>
          <p className="text-muted-foreground text-lg">Dedicated educators committed to nurturing every student</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow mx-auto space-y-16">
          {groups.map((group) => (
            <div key={group.designation}>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6 pb-3 border-b border-border">
                {group.designation}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {group.members.map((member) => (
                  <div key={member.id} className="bg-card border border-border rounded-xl p-5 text-center">
                    {member.photo_url ? (
                      <img src={member.photo_url} alt={member.name} className="w-14 h-14 rounded-full mx-auto mb-3 object-cover" loading="lazy" width={56} height={56} />
                    ) : (
                      <div className="w-14 h-14 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center">
                        <span className="text-xl font-heading font-bold text-muted-foreground">{member.name.charAt(0)}</span>
                      </div>
                    )}
                    <p className="font-medium text-card-foreground text-sm leading-snug">{member.name}</p>
                    {member.qualification && <p className="text-xs text-muted-foreground mt-1">{member.qualification}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Faculty;

