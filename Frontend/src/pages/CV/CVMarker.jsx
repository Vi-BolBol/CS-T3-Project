import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useState } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";

export default function CVMaker() {
  const navigate = useNavigate();

  const [cvData, setCvData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    education: "",
    skills: "",
  });

  const handleChange = (e) => {
    setCvData({
      ...cvData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePreview = () => {
    localStorage.setItem("cvData", JSON.stringify(cvData));
    navigate("/cv-preview");
  };

  return (
    <div className="min-h-screen bg-darkBlue text-white">
      <Header />

      <main className="mx-auto max-w-4xl px-8 py-16">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">

          <h1 className="text-4xl font-bold">
            Build Your CV
          </h1>

          <div className="mt-8 grid gap-4">

            <Input
              name="fullName"
              placeholder="Full Name"
              onChange={handleChange}
            />

            <Input
              name="email"
              placeholder="Email"
              onChange={handleChange}
            />

            <Input
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
            />

            <Input
              name="position"
              placeholder="Desired Position"
              onChange={handleChange}
            />

            <Input
              name="education"
              placeholder="Education"
              onChange={handleChange}
            />

            <Input
              name="skills"
              placeholder="Skills"
              onChange={handleChange}
            />

            <Button
              className="mt-4"
              onClick={handlePreview}
            >
              Preview CV
            </Button>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}