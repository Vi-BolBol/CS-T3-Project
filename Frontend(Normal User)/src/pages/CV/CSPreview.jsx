import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Button from "../../components/common/Button";

export default function CVPreview() {
  const cvData =
    JSON.parse(localStorage.getItem("cvData")) || {};

  return (
    <div className="min-h-screen bg-darkBlue text-white">
      <Header />

      <main className="mx-auto max-w-4xl px-8 py-16">

        <div className="rounded-2xl bg-white p-10 text-black">

          <h1 className="text-4xl font-bold">
            {cvData.fullName}
          </h1>

          <p className="mt-2">{cvData.position}</p>

          <div className="mt-6">
            <h2 className="font-bold text-green-600">
              Contact
            </h2>

            <p>{cvData.email}</p>
            <p>{cvData.phone}</p>
          </div>

          <div className="mt-6">
            <h2 className="font-bold text-green-600">
              Education
            </h2>

            <p>{cvData.education}</p>
          </div>

          <div className="mt-6">
            <h2 className="font-bold text-green-600">
              Skills
            </h2>

            <p>{cvData.skills}</p>
          </div>

        </div>

        <Button className="mt-6">
          Download PDF
        </Button>

      </main>

      <Footer />
    </div>
  );
}