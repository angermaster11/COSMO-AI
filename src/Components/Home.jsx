import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e2a47] via-[#3b4c7a] to-[#5974a8] flex flex-col overflow-x-hidden">

      {/* Navbar */}
      <nav className="bg-transparent px-8 py-6 fixed w-full z-50 backdrop-blur-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <a href="/" className="text-3xl font-extrabold text-white uppercase tracking-widest hover:text-[#fdc800] transition-all">
            <span className="text-[#fdc800]">COSMO</span> University
          </a>
          <ul className="flex space-x-8 text-lg">
            <li><a href="#about" className="text-white hover:text-[#fdc800] transition-all hover:underline underline-offset-8">About</a></li>
            <li><a href="#programs" className="text-white hover:text-[#fdc800] transition-all hover:underline underline-offset-8">Programs</a></li>
            <li><a href="#admission" className="text-white hover:text-[#fdc800] transition-all hover:underline underline-offset-8">Admission</a></li>
            <li><button onClick={() => navigate("/login")} className="px-8 py-3 bg-gradient-to-r from-[#fdc800] to-[#f7a600] text-white font-semibold rounded-xl shadow-md hover:scale-105 transform transition-all duration-300 hover:shadow-lg">
              Login
            </button></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-1 items-center justify-center text-center bg-cover bg-center relative min-h-screen" style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?university,campus')" }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="text-white relative z-10 px-8 py-16 max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-wide mb-6 drop-shadow-xl animate-fade-in">
            Welcome to <span className="text-[#fdc800]">COSMO</span> University
          </h1>
          <p className="text-xl sm:text-3xl mb-10 text-white/90 leading-relaxed font-medium animate-fade-in delay-100">
            Empowering Minds Through Digital Excellence
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in delay-200">
            <button
              onClick={() => navigate("/login")}
              className="px-10 py-4 bg-gradient-to-r from-[#fdc800] to-[#f7a600] text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/programs")}
              className="px-10 py-4 border-2 border-white text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-white/10"
            >
              Explore Programs
            </button>
          </div>
        </div>
        <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
          <a href="#about" className="text-white text-4xl">↓</a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "95%", label: "Placement Rate" },
              { number: "50+", label: "Degree Programs" },
              { number: "120+", label: "Faculty Members" },
              { number: "10K+", label: "Alumni Network" }
            ].map((stat, index) => (
              <div key={index} className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <p className="text-4xl font-bold text-[#fdc800] mb-2">{stat.number}</p>
                <p className="text-white/90">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-[#1e2a47] text-white relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#fdc800]/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#5974a8]/10 rounded-full filter blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Institution Overview</h2>
            <div className="w-24 h-1 bg-[#fdc800] mx-auto mb-6"></div>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto">
              Established in 2018, COSMO University has rapidly emerged as a leader in technology-driven higher education in India. Recognized by UGC and NAAC with an 'A' grade, COSMO embodies a future-ready academic environment.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
                <img 
                  src="https://source.unsplash.com/800x600/?university,campus,modern" 
                  alt="COSMO University Campus" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            
            <div className="lg:w-1/2 space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 flex items-center">
                  <span className="w-4 h-4 bg-[#fdc800] mr-2"></span> Location
                </h3>
                <p className="text-lg">Neel Kamal Road, Digital Nagar, New Delhi - 110078, India</p>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold mb-4 flex items-center">
                  <span className="w-4 h-4 bg-[#fdc800] mr-2"></span> Campus Highlights
                </h3>
                <ul className="space-y-4 text-lg">
                  <li className="flex items-start">
                    <span className="text-[#fdc800] mr-2">✓</span>
                    <span>25-acre smart campus with IoT-enabled infrastructure</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#fdc800] mr-2">✓</span>
                    <span>Virtual Reality (VR) Labs across 10,000+ sq. ft.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#fdc800] mr-2">✓</span>
                    <span>500 GPU servers in High-Performance Computing center</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#fdc800] mr-2">✓</span>
                    <span>Cybersecurity Operations Center active 24/7</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#fdc800] mr-2">✓</span>
                    <span>Smart classrooms with AR-enabled learning tools</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-gradient-to-br from-[#1e2a47] via-[#3b4c7a] to-[#5974a8] text-white relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#fdc800]/10 rounded-full filter blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Academic Programs</h2>
            <div className="w-24 h-1 bg-[#fdc800] mx-auto mb-6"></div>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto">
              COSMO University offers a wide range of undergraduate and postgraduate programs across various fields of technology, management, and science.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Undergraduate Programs */}
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-[#fdc800]/30 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-[#fdc800] w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold mr-4">U</div>
                <h3 className="text-2xl font-semibold">Undergraduate Programs (4 Years)</h3>
              </div>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start">
                  <span className="text-[#fdc800] mr-2">•</span>
                  <span><strong>B.Tech:</strong> CSE, AI & ML, Mechanical, Civil, Electrical Engineering</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#fdc800] mr-2">•</span>
                  <span><strong>BCA:</strong> Cloud Tech, Cybersecurity, Full Stack Development</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#fdc800] mr-2">•</span>
                  <span><strong>B.Pharma:</strong> Pharmaceutical Chemistry, Clinical Research</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#fdc800] mr-2">•</span>
                  <span><strong>B.Sc in Biotechnology:</strong> Genetic Engineering, Medical Biotechnology</span>
                </li>
              </ul>
              <div className="mt-8">
                <img 
                  src="https://source.unsplash.com/600x400/?students,university" 
                  alt="Undergraduate students" 
                  className="rounded-lg w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Postgraduate Programs */}
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-[#fdc800]/30 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-[#fdc800] w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold mr-4">P</div>
                <h3 className="text-2xl font-semibold">Postgraduate Programs (2 Years)</h3>
              </div>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start">
                  <span className="text-[#fdc800] mr-2">•</span>
                  <span><strong>M.Tech:</strong> Robotics, Quantum Computing, IoT, Cyber-Physical Systems</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#fdc800] mr-2">•</span>
                  <span><strong>MBA:</strong> Digital Marketing, Financial Technology, Healthcare Management</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#fdc800] mr-2">•</span>
                  <span><strong>MCA:</strong> AI Engineering, Blockchain Technology, Cloud Architecture</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#fdc800] mr-2">•</span>
                  <span><strong>M.Sc:</strong> Data Science, Artificial Intelligence, Bioinformatics</span>
                </li>
              </ul>
              <div className="mt-8">
                <img 
                  src="https://source.unsplash.com/600x400/?graduate,students" 
                  alt="Postgraduate students" 
                  className="rounded-lg w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#1e2a47] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">What Our Students Say</h2>
            <div className="w-24 h-1 bg-[#fdc800] mx-auto mb-6"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "COSMO's cutting-edge facilities and industry-aligned curriculum gave me the perfect launchpad for my career in AI.",
                author: "Priya Sharma",
                role: "B.Tech AI & ML, 2022",
                image: "https://source.unsplash.com/200x200/?portrait,indian,woman"
              },
              {
                quote: "The faculty's expertise and the hands-on learning approach helped me secure my dream job at a Fortune 500 company.",
                author: "Rahul Verma",
                role: "MBA FinTech, 2021",
                image: "https://source.unsplash.com/200x200/?portrait,indian,man"
              },
              {
                quote: "The research opportunities and global collaborations at COSMO are unparalleled in India's education landscape.",
                author: "Ananya Patel",
                role: "Ph.D Biotechnology, 2023",
                image: "https://source.unsplash.com/200x200/?portrait,indian,student"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-[#fdc800]/50 transition-all duration-300">
                <div className="text-[#fdc800] text-2xl mb-4">"</div>
                <p className="text-lg italic mb-6">{testimonial.quote}</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author} 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-white/70 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admission Section */}
      <section id="admission" className="py-20 bg-gradient-to-br from-[#1e2a47] via-[#3b4c7a] to-[#5974a8] text-white relative overflow-hidden">
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#fdc800]/10 rounded-full filter blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Admission Process</h2>
            <div className="w-24 h-1 bg-[#fdc800] mx-auto mb-6"></div>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto">
              Learn about the steps to apply to COSMO University, along with eligibility criteria and important dates.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-lg">
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-semibold mb-4 text-[#fdc800]">Eligibility Criteria</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#fdc800] mr-2">•</span>
                    <span><strong>Undergraduate (UG):</strong> 10+2 with 60% marks, Valid CUET/COSMOS-JEE score</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#fdc800] mr-2">•</span>
                    <span><strong>Postgraduate (PG):</strong> Bachelor's degree with 55% marks, Valid GATE/CAT/COSMOS-PGET score</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-semibold mb-4 text-[#fdc800]">Important Dates</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#fdc800] mr-2">•</span>
                    <span><strong>Applications Open:</strong> January 15</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#fdc800] mr-2">•</span>
                    <span><strong>Entrance Exam:</strong> April 30</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#fdc800] mr-2">•</span>
                    <span><strong>Admission Deadline:</strong> June 30</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-semibold mb-4 text-[#fdc800]">Application Steps</h3>
                <ol className="space-y-3 list-decimal list-inside">
                  <li>Apply online at: www.cosmosuniversity.edu.in</li>
                  <li>Appear for entrance examination</li>
                  <li>Personal interview (PG courses)</li>
                  <li>Document verification & Fee payment</li>
                </ol>
              </div>
            </div>

            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
              <h3 className="text-2xl font-semibold mb-6 text-center">Ready to Apply?</h3>
              <div className="space-y-4">
                <button
                  onClick={() => navigate("/apply")}
                  className="w-full px-8 py-4 bg-gradient-to-r from-[#fdc800] to-[#f7a600] text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02]"
                >
                  Start Application
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="w-full px-8 py-4 border-2 border-white text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/10"
                >
                  Contact Admissions
                </button>
              </div>
              <div className="mt-8">
                <img 
                  src="https://source.unsplash.com/600x400/?admission,university" 
                  alt="Admission process" 
                  className="rounded-lg w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-[#1e2a47] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Campus Life</h2>
            <div className="w-24 h-1 bg-[#fdc800] mx-auto mb-6"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "https://source.unsplash.com/600x400/?university,library",
              "https://source.unsplash.com/600x400/?students,lab",
              "https://source.unsplash.com/600x400/?university,sports",
              "https://source.unsplash.com/600x400/?college,event",
              "https://source.unsplash.com/600x400/?university,cafeteria",
              "https://source.unsplash.com/600x400/?graduation,ceremony",
              "https://source.unsplash.com/600x400/?university,dormitory",
              "https://source.unsplash.com/600x400/?students,study"
            ].map((image, index) => (
              <div 
                key={index} 
                className="relative group overflow-hidden rounded-lg aspect-square"
              >
                <img 
                  src={image} 
                  alt="Campus life" 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#1e2a47] via-[#3b4c7a] to-[#5974a8] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://source.unsplash.com/1600x900/?university,night')] bg-cover bg-center opacity-20"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6">Ready to Begin Your Journey at COSMO?</h2>
          <p className="text-xl mb-10">Join India's leading technology university and shape your future.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/apply")}
              className="px-12 py-5 bg-gradient-to-r from-[#fdc800] to-[#f7a600] text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl text-lg"
            >
              Apply Now
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="px-12 py-5 border-2 border-white text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-white/10 text-lg"
            >
              Schedule Campus Tour
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e2a47] text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-extrabold mb-6 uppercase tracking-widest">
                <span className="text-[#fdc800]">COSMO</span> University
              </h3>
              <p className="mb-4">Neel Kamal Road, Digital Nagar</p>
              <p>New Delhi - 110078, India</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="hover:text-[#fdc800] transition-all">About</a></li>
                <li><a href="#programs" className="hover:text-[#fdc800] transition-all">Programs</a></li>
                <li><a href="#admission" className="hover:text-[#fdc800] transition-all">Admission</a></li>
                <li><a href="#contact" className="hover:text-[#fdc800] transition-all">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#library" className="hover:text-[#fdc800] transition-all">Library</a></li>
                <li><a href="#research" className="hover:text-[#fdc800] transition-all">Research</a></li>
                <li><a href="#careers" className="hover:text-[#fdc800] transition-all">Careers</a></li>
                <li><a href="#alumni" className="hover:text-[#fdc800] transition-all">Alumni</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4 mb-4">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <a 
                    key={social} 
                    href={`#${social}`} 
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#fdc800] transition-all"
                  >
                    <span className="sr-only">{social}</span>
                  </a>
                ))}
              </div>
              <p>Email: info@cosmosuniversity.edu.in</p>
              <p>Phone: +91 11 2345 6789</p>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p>&copy; 2025 COSMO University. All rights reserved.</p>
            <div className="flex justify-center space-x-6 mt-4">
              <a href="#privacy" className="hover:text-[#fdc800] transition-all">Privacy Policy</a>
              <a href="#terms" className="hover:text-[#fdc800] transition-all">Terms of Service</a>
              <a href="#sitemap" className="hover:text-[#fdc800] transition-all">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;