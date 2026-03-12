import React from 'react';
import { useTranslation } from 'react-i18next';
import { GraduationCap, Target, Users, Award } from 'lucide-react';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">About TomatoDoc</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We are dedicated to transforming tomato farming in Rwanda through innovative AI solutions.
            Our mission is to help farmers detect diseases early, reduce crop loss, and improve their livelihoods.
          </p>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <Target className="w-8 h-8 text-secondary mr-3" />
                The Problem
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                In Rwanda, tomato diseases like Late Blight and Bacterial Spot cause up to 60-80% crop loss for smallholder farmers. 
                Many farmers lack access to agricultural experts or timely diagnosis tools, leading to improper use of pesticides and financial ruin.
              </p>
              <div className="bg-red-50 p-6 rounded-2xl border-l-4 border-secondary">
                <p className="italic text-gray-700 font-medium">
                  "TomatoDoc was born from the need to put expert knowledge directly into the hands of Rwandan farmers."
                </p>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1589923188900-85dae523342b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Agricultural Problem" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Academic Background */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Academic Roots</h2>
            <p className="text-gray-500">Developed with excellence at the University of Rwanda.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-4">University of Rwanda</h3>
              <p className="text-gray-500">This project is a capstone initiative by final year students at the University of Rwanda, College of Science and Technology.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-secondary bg-opacity-10 text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-4">Our Team</h3>
              <p className="text-gray-500">A dedicated group of junior developers and data scientists passionate about AgTech and AI.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-4">Supervision</h3>
              <p className="text-gray-500">Guided by experienced faculty members specializing in Machine Learning and Software Engineering.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
