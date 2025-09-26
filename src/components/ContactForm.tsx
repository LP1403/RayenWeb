import React, { useState } from 'react';
import { Mail, MessageCircle, Send, Check, MapPin, Clock } from 'lucide-react';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular envío del formulario
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sm font-light tracking-[0.2em] text-gray-500 mb-4 block">CONTACTO</span>
          <h2 className="text-4xl md:text-5xl font-light text-black mb-6">
            Hablemos
          </h2>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
            Estamos aquí para ayudarte con cualquier consulta sobre nuestros productos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-gray-50 p-12">
            <div className="flex items-center space-x-3 mb-8">
              <Mail className="h-6 w-6 text-black" />
              <h3 className="text-xl font-light text-black tracking-wide">ESCRIBINOS</h3>
            </div>

            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-black mb-6">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-light text-black mb-3">Mensaje enviado</h4>
                <p className="text-gray-600 font-light">Te responderemos a la brevedad</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label htmlFor="name" className="block text-xs font-light tracking-wide text-gray-600 mb-3 uppercase">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-0 py-4 border-0 border-b border-gray-300 bg-transparent focus:ring-0 focus:border-black transition-colors font-light"
                    placeholder=""
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-light tracking-wide text-gray-600 mb-3 uppercase">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-0 py-4 border-0 border-b border-gray-300 bg-transparent focus:ring-0 focus:border-black transition-colors font-light"
                    placeholder=""
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-light tracking-wide text-gray-600 mb-3 uppercase">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-0 py-4 border-0 border-b border-gray-300 bg-transparent focus:ring-0 focus:border-black transition-colors resize-none font-light"
                    placeholder=""
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-4 px-6 font-light text-sm tracking-wide hover:bg-gray-800 transition-colors flex items-center justify-center space-x-3"
                >
                  <Send className="h-5 w-5" />
                  <span>ENVIAR</span>
                </button>
              </form>
            )}
          </div>

          {/* WhatsApp Contact */}
          <div className="space-y-8">
            <div className="border border-gray-200 p-12">
              <div className="flex items-center space-x-3 mb-8">
                <MessageCircle className="h-6 w-6 text-black" />
                <h3 className="text-xl font-light text-black tracking-wide">WHATSAPP</h3>
              </div>

              <p className="text-gray-600 mb-8 font-light leading-relaxed">
                Para consultas rápidas y atención personalizada, escribinos por WhatsApp.
              </p>

              <a
                href="https://wa.me/5491123910260?text=Hola! Me interesa conocer más sobre sus productos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 bg-black text-white px-8 py-4 font-light text-sm tracking-wide hover:bg-gray-800 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>CHATEAR AHORA</span>
              </a>
            </div>

            <div className="space-y-8">
              <div className="border border-gray-200 p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="h-5 w-5 text-black" />
                  <h4 className="text-sm font-light tracking-wide text-black uppercase">Horarios</h4>
                </div>
                <div className="space-y-2 text-gray-600 font-light text-sm">
                  <p>Lunes a Viernes: 9:00 - 18:00</p>
                  <p>Sábados: 10:00 - 14:00</p>
                  <p>Domingos: Cerrado</p>
                </div>
              </div>

              <div className="border border-gray-200 p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <MapPin className="h-5 w-5 text-black" />
                  <h4 className="text-sm font-light tracking-wide text-black uppercase">Ubicación</h4>
                </div>
                <div className="text-gray-600 font-light text-sm">
                  <p>Buenos Aires, Argentina</p>
                  <p>Envíos a todo el país</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;