import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";

export default function CVChoice() {
  const navigate = useNavigate();

  const templates = [
    { id: 1, name: "Professional" },
    { id: 2, name: "Modern" },
    { id: 3, name: "Creative" },
  ];

  return (
    <div className="min-h-screen bg-darkBlue text-white">
      <Header />

      <main className="mx-auto max-w-6xl px-8 py-16">
        <h1 className="text-4xl font-bold">
          Choose Your CV Template
        </h1>

        <p className="mt-3 text-gray-400">
          Select a template to start building your CV.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id}>
              <div className="h-72 rounded-xl bg-white/10"></div>

              <h2 className="mt-4 text-xl font-bold">
                {template.name}
              </h2>

              <Button
                className="mt-4 w-full"
                onClick={() => navigate("/cv-maker")}
              >
                Use Template
              </Button>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}