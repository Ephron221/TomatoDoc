import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, 
  MessageSquare, 
  Users, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  Play,
  Star,
  Quote
} from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      name: "Jean Bosco Niyomugabo",
      location: "Musanze, Rwanda",
      text: "TomatoDoc saved my harvest this year. I detected Early Blight two weeks before it would have destroyed everything.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Marie Claire Uwimana",
      location: "Bugesera, Rwanda",
      text: "The Kinyarwanda support makes it so easy to use. I can finally get expert advice without needing a translator.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Emmanuel Twagirimana",
      location: "Kayonza, Rwanda",
      text: "As a commercial farmer, the subscription is worth every penny. The accuracy of the AI is truly impressive.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1592841608277-73d97f339669?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Tomato Farm" 
            className="w-full h-full object-cover brightness-[0.4]"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white py-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center space-x-2 bg-secondary/20 backdrop-blur-md border border-secondary/30 px-4 py-2 rounded-full mb-8">
              <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-secondary-light">Trusted by 500+ Farmers in Rwanda</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
              Protect Your <span className="text-secondary">Tomatoes</span> With Smart AI.
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-gray-300 leading-relaxed font-medium">
              Join the future of farming. Detect diseases instantly, chat with AI experts, and maximize your yield in Kinyarwanda & English.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/register" className="btn-primary text-lg px-10 py-5 group shadow-2xl shadow-red-500/20">
                {t('home.get_started')}
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/how-it-works" className="flex items-center justify-center space-x-3 text-white font-bold text-lg hover:text-secondary transition group">
                <div className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:border-secondary transition">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <span>{t('home.learn_more')}</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating cards decoration for desktop */}
        <div className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none">
           <motion.div 
             animate={{ y: [0, -20, 0] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-0 right-10 bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl w-64"
           >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-white">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <span className="text-white font-bold text-sm">98% Accuracy</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full w-full mb-2">
                <div className="h-full bg-secondary w-[98%] rounded-full"></div>
              </div>
           </motion.div>

           <motion.div 
             animate={{ y: [0, 20, 0] }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute bottom-10 left-0 bg-white p-6 rounded-3xl shadow-2xl w-72"
           >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                  <Globe className="w-6 h-6" />
                </div>
                <span className="text-gray-900 font-bold text-sm">Now in Kinyarwanda</span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">Ibisubizo byihuse mu rurimi rwawe rw'amavuko.</p>
           </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-black text-gray-900 mb-1">500+</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Farmers Active</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-secondary mb-1">12k+</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Plants Diagnosed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-gray-900 mb-1">98%</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-gray-900 mb-1">24/7</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">System Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">{t('home.features')}</h2>
            <div className="w-20 h-2 bg-secondary mx-auto rounded-full mb-8"></div>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
              Combining world-class computer vision with local agricultural expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div whileHover={{ y: -10 }} className="card p-10 group bg-white border-b-8 border-b-secondary">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-secondary mb-8 group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-xl shadow-red-100">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-gray-900">{t('home.ai_detection')}</h3>
              <p className="text-gray-500 leading-relaxed font-medium">{t('home.ai_detection_desc')}</p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="card p-10 group bg-white border-b-8 border-b-gray-900">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 mb-8 group-hover:bg-gray-900 group-hover:text-white transition-all duration-500 shadow-xl shadow-gray-200">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-gray-900">AI Expert Chat</h3>
              <p className="text-gray-500 leading-relaxed font-medium">Interactive chatbot that answers all your tomato farming questions in English or Kinyarwanda.</p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="card p-10 group bg-white border-b-8 border-b-green-500">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-8 group-hover:bg-green-600 group-hover:text-white transition-all duration-500 shadow-xl shadow-green-100">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-gray-900">{t('home.expert_connect')}</h3>
              <p className="text-gray-500 leading-relaxed font-medium">{t('home.expert_connect_desc')}</p>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-64 -mt-64 w-[500px] h-[500px] bg-red-50 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-64 -mb-64 w-[500px] h-[500px] bg-red-50 rounded-full opacity-50 blur-3xl"></div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Voice of Rwandan Farmers</h2>
              <p className="text-xl text-gray-500 font-medium">Real stories from farmers who have transformed their production with TomatoDoc.</p>
            </div>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-6 h-6 fill-secondary text-secondary" />)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-50 p-10 rounded-[40px] relative overflow-hidden group">
                <Quote className="absolute -top-4 -right-4 w-24 h-24 text-gray-200 group-hover:text-red-100 transition-colors" />
                <p className="text-lg text-gray-700 italic mb-8 relative z-10 font-medium">"{t.text}"</p>
                <div className="flex items-center">
                  <img src={t.image} alt={t.name} className="w-14 h-14 rounded-2xl object-cover mr-4 shadow-lg" />
                  <div>
                    <h4 className="font-black text-gray-900">{t.name}</h4>
                    <p className="text-xs font-bold text-secondary uppercase tracking-widest">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-[60px] p-10 md:p-20 text-center text-white relative overflow-hidden shadow-[0_40px_100px_-15px_rgba(0,0,0,0.3)]">
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Ready to Boost Your <span className="text-secondary">Harvest?</span></h2>
              <p className="text-xl md:text-2xl mb-12 text-gray-400 font-medium">Join 500+ Rwandan farmers today. Get 15 days of free AI-powered diagnosis.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/register" className="btn-primary text-xl px-12 py-5 w-full sm:w-auto shadow-2xl shadow-red-500/20">
                  Join TomatoDoc Now
                </Link>
                <Link to="/contact" className="text-white font-bold hover:text-secondary transition text-lg underline underline-offset-8 decoration-white/20 hover:decoration-secondary">
                  Talk to Sales
                </Link>
              </div>
            </div>
            
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#FF6347_1px,transparent_1px)] [background-size:40px_40px]"></div>
            </div>
            
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-secondary opacity-20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-secondary opacity-10 rounded-full blur-[120px]"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
