import PaperShell, { EditionFooter } from "@/components/PaperShell";
import Masthead from "@/components/Masthead";
import AdminForm from "@/components/AdminForm";

export const metadata = {
  title: "Editorial Desk — Follow Property",
};

export default function AdminPage() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextEdition = tomorrow.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <PaperShell footer={<EditionFooter nextEdition={nextEdition} />}>
      <Masthead />
      <hr className="rule my-4" />
      <AdminForm />
    </PaperShell>
  );
}
