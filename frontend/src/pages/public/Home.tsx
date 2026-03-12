import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  MessageSquare, 
  ArrowRight, 
  Play,
  TrendingUp,
  Zap,
  Phone,
  Smartphone,
  Sparkles,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const { t } = useTranslation();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex flex-col">
      {/* Modern Hero Section with Vibrant Background */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#fafafa]">
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-3 bg-white border border-gray-100 px-4 py-2 rounded-2xl shadow-sm mb-8"
              >
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" />
                     </div>
                   ))}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t('home.trusted_by')}</span>
              </motion.div>
              
              <h1 className="text-6xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tight text-gray-900">
                {t('home.hero_title_1')} <br />
                <span className="text-secondary italic">{t('home.hero_title_2')}</span> <br />
                {t('home.hero_title_3')}
              </h1>
              
              <p className="text-xl md:text-2xl mb-12 text-gray-500 leading-relaxed font-medium max-w-xl">
                {t('home.hero_subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 items-center">
                <Link to="/register" className="w-full sm:w-auto bg-secondary text-white font-black uppercase tracking-[0.15em] text-xs px-12 py-6 rounded-[2rem] hover:bg-red-600 transition-all shadow-2xl shadow-red-200 flex items-center justify-center group">
                  {t('home.get_started')}
                  <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/how-it-works" className="w-full sm:w-auto flex items-center justify-center space-x-4 px-8 py-6 rounded-[2rem] border border-gray-100 bg-white hover:bg-gray-50 transition-colors shadow-sm group">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <Play className="w-3 h-3 fill-current" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-gray-900">{t('home.how_it_works_btn')}</span>
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative"
            >
               <div className="relative z-10 bg-white p-4 rounded-[3rem] shadow-2xl shadow-gray-200 border border-gray-100">
                  <img 
                    src="https://images.unsplash.com/photo-1591857177580-dc82b9ac4e17?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Tomato Disease Detection" 
                    className="rounded-[2.5rem] w-full aspect-[4/5] object-cover"
                  />
                  
                  {/* Floating AI Analysis Card */}
                  <motion.div 
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -right-8 top-1/4 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/50 w-64 hidden sm:block"
                  >
                     <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-secondary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-100">
                           <Zap className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase text-gray-400">{t('home.ai_diagnosis')}</p>
                           <p className="text-sm font-black text-gray-900">{t('home.late_blight')}</p>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold">
                           <span>{t('home.confidence')}</span>
                           <span className="text-secondary">98.4%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-secondary w-[98.4%]"></div>
                        </div>
                     </div>
                  </motion.div>

                  {/* Floating Rwandan Support Card */}
                  <motion.div 
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -left-8 bottom-1/4 bg-gray-900 p-6 rounded-3xl shadow-2xl w-64 hidden sm:block"
                  >
                     <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center text-white">
                           <Globe className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{t('home.local_support')}</p>
                           <p className="text-sm font-black text-white">{t('home.kinyarwanda_support')}</p>
                        </div>
                     </div>
                  </motion.div>
               </div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-gray-100 rounded-full -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern Features Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
            <div className="max-w-2xl">
               <span className="text-secondary font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">{t('home.platform_excellence')}</span>
               <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-none">{t('home.future_title')}</h2>
            </div>
            <p className="text-xl text-gray-500 max-w-sm font-medium leading-relaxed">
              {t('home.future_desc')}
            </p>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={item} className="bg-gray-50 p-12 rounded-[3.5rem] hover:bg-red-50 transition-colors group">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-secondary mb-10 shadow-xl shadow-red-100 group-hover:scale-110 transition-transform">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-gray-900">{t('home.instant_scans')}</h3>
              <p className="text-gray-500 leading-relaxed font-medium">{t('home.instant_scans_desc')}</p>
            </motion.div>

            <motion.div variants={item} className="bg-gray-50 p-12 rounded-[3.5rem] hover:bg-gray-900 transition-colors group">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-gray-900 mb-10 shadow-xl shadow-gray-200 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-gray-900 group-hover:text-white">{t('home.ai_chat')}</h3>
              <p className="text-gray-500 leading-relaxed font-medium group-hover:text-gray-400">{t('home.ai_chat_desc')}</p>
            </motion.div>

            <motion.div variants={item} className="bg-gray-50 p-12 rounded-[3.5rem] hover:bg-green-50 transition-colors group">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-green-600 mb-10 shadow-xl shadow-green-100 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-gray-900">{t('home.yield_opt')}</h3>
              <p className="text-gray-500 leading-relaxed font-medium">{t('home.yield_opt_desc')}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Yield Comparison */}
      <section className="py-32 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-[4rem] p-8 md:p-20 shadow-2xl shadow-gray-200 border border-gray-100 overflow-hidden relative">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  <div className="relative z-10">
                     <span className="text-green-500 font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">{t('home.proven_results')}</span>
                     <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] mb-10">
                        {t('home.maximize_potential')}
                     </h2>
                     <div className="space-y-8">
                        <div className="flex items-start space-x-6">
                           <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shrink-0">
                              <TrendingUp className="w-6 h-6" />
                           </div>
                           <div>
                              <h4 className="text-lg font-black text-gray-900 mb-1">{t('home.yield_increase')}</h4>
                              <p className="text-sm text-gray-500 font-medium">{t('home.yield_increase_desc')}</p>
                           </div>
                        </div>
                        <div className="flex items-start space-x-6">
                           <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-secondary shrink-0">
                              <ShieldCheck className="w-6 h-6" />
                           </div>
                           <div>
                              <h4 className="text-lg font-black text-gray-900 mb-1">{t('home.zero_waste')}</h4>
                              <p className="text-sm text-gray-500 font-medium">{t('home.zero_waste_desc')}</p>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  <div className="relative">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4 pt-12">
                           <div className="bg-gray-50 rounded-[2.5rem] p-6 text-center border border-gray-100">
                              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('home.traditional')}</p>
                              <div className="h-40 w-full bg-gray-200 rounded-2xl mb-4" />
                              <p className="text-2xl font-black text-gray-400">60%</p>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <div className="bg-secondary rounded-[2.5rem] p-6 text-center text-white shadow-2xl shadow-red-200">
                              <p className="text-xs font-black opacity-60 uppercase tracking-widest mb-2">{t('home.with_tomatodoc')}</p>
                              <div className="h-64 w-full bg-white/20 rounded-2xl mb-4" />
                              <p className="text-3xl font-black italic">100%</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Call to Action */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-secondary via-red-600 to-orange-500 rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-[0_40px_100px_-15px_rgba(255,99,71,0.3)]"
          >
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none">{t('home.ready_boost')}</h2>
              <p className="text-xl md:text-2xl mb-16 text-red-50 font-medium leading-relaxed max-w-2xl mx-auto">
                {t('home.join_desc')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/register" className="w-full sm:w-auto bg-white text-secondary font-black uppercase tracking-[0.2em] text-xs px-12 py-7 rounded-[2.5rem] hover:bg-gray-100 transition-all shadow-2xl shadow-red-900/20">
                  {t('home.join_now')}
                </Link>
                <Link to="/contact" className="w-full sm:w-auto flex items-center justify-center space-x-4 px-10 py-7 rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all group">
                   <Phone className="w-4 h-4" />
                   <span className="text-xs font-black uppercase tracking-widest">{t('home.talk_sales')}</span>
                </Link>
              </div>
            </div>
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white opacity-20 rounded-full blur-[120px]" />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
