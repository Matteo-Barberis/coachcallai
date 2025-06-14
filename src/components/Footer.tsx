
import React from 'react';
import { PhoneCall, MessageCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-16">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Coach Call AI</span>
            </div>
            <p className="text-gray-600 mb-6">
              Your AI accountability partner that keeps you on track through WhatsApp messages and phone calls.
            </p>
            <div className="flex space-x-4">
              <a href="https://discord.gg/7g52pYK2yg" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-brand-primary hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="22" height="22" fill="currentColor" strokeWidth="2.5">
                  <path d="M 30.980469 7 A 1.0001 1.0001 0 0 0 30.089844 7.5859375 C 30.089844 7.5859375 29.75543 8.3287993 29.546875 9.3964844 C 27.583844 9.08239 25.937423 9 25 9 C 24.062577 9 22.416156 9.08239 20.453125 9.3964844 C 20.24457 8.3287993 19.910156 7.5859375 19.910156 7.5859375 A 1.0001 1.0001 0 0 0 18.943359 7.0019531 A 1.0001 1.0001 0 0 0 18.919922 7.0039062 C 18.919922 7.0039062 12.553656 7.42053 8.3808594 10.714844 A 1.0001 1.0001 0 0 0 8.3125 10.773438 C 7.6051397 11.441499 7.0599467 12.483658 6.390625 13.972656 C 5.7213033 15.461655 5.0156888 17.355449 4.3671875 19.498047 C 3.0701848 23.783242 2 29.054167 2 34 A 1.0001 1.0001 0 0 0 2.1347656 34.5 C 3.6151076 37.06213 6.2964412 38.611763 8.8007812 39.582031 C 11.305121 40.552299 13.620576 40.938706 14.748047 40.998047 A 1.0001 1.0001 0 0 0 15.613281 40.583984 L 18.025391 37.222656 C 19.998188 37.682914 22.316458 38 25 38 C 27.683542 38 30.001812 37.682914 31.974609 37.222656 L 34.386719 40.583984 A 1.0001 1.0001 0 0 0 35.251953 40.998047 C 36.379424 40.938707 38.694879 40.552299 41.199219 39.582031 C 43.703559 38.611763 46.384892 37.06213 47.865234 34.5 A 1.0001 1.0001 0 0 0 48 34 C 48 29.054167 46.929815 23.783242 45.632812 19.498047 C 44.984311 17.355449 44.278697 15.461655 43.609375 13.972656 C 42.940053 12.483658 42.39486 11.4415 41.6875 10.773438 A 1.0001 1.0001 0 0 0 41.619141 10.714844 C 37.446345 7.4205261 31.080078 7.0039062 31.080078 7.0039062 A 1.0001 1.0001 0 0 0 30.980469 7 z M 18.263672 9.1445312 C 18.338023 9.3538231 18.416696 9.5349501 18.482422 9.7851562 C 16.221549 10.302605 13.725951 11.138257 11.384766 12.542969 A 1.0001 1.0001 0 1 0 12.414062 14.257812 C 17.145045 11.419224 23.026984 11 25 11 C 26.973016 11 32.854955 11.419224 37.585938 14.257812 A 1.0001 1.0001 0 1 0 38.615234 12.542969 C 36.274049 11.138257 33.778451 10.302605 31.517578 9.7851562 C 31.583304 9.5349501 31.661977 9.3538231 31.736328 9.1445312 C 32.883827 9.2845319 37.303989 9.8986933 40.330078 12.255859 C 40.530966 12.454191 41.167937 13.419879 41.785156 14.792969 C 42.409585 16.182095 43.092251 18.008223 43.71875 20.078125 C 44.94318 24.123544 45.923302 29.105367 45.96875 33.673828 C 44.812422 35.508607 42.668548 36.867546 40.476562 37.716797 C 38.412289 38.516568 36.571749 38.793003 35.630859 38.884766 L 34.033203 36.658203 C 34.86819 36.390791 35.623526 36.10522 36.287109 35.816406 C 38.812028 34.717478 40.158203 33.552734 40.158203 33.552734 A 1.0001 1.0001 0 1 0 38.841797 32.046875 C 38.841797 32.046875 37.788363 32.98135 35.488281 33.982422 C 34.575634 34.379637 33.469164 34.775673 32.181641 35.113281 A 1.0001 1.0001 0 0 0 32.138672 35.125 C 30.189141 35.632527 27.818222 36 25 36 C 22.20293 36 19.847555 35.638295 17.90625 35.136719 A 1.0001 1.0001 0 0 0 17.849609 35.121094 C 17.836929 35.117786 17.823191 35.114648 17.810547 35.111328 A 1.0001 1.0001 0 0 0 17.800781 35.109375 C 16.520565 34.772709 15.420357 34.377891 14.511719 33.982422 C 12.211637 32.98135 11.158203 32.046875 11.158203 32.046875 A 1.0001 1.0001 0 0 0 10.521484 31.791016 A 1.0001 1.0001 0 0 0 9.8417969 33.552734 C 9.8417969 33.552734 11.187972 34.717478 13.712891 35.816406 C 14.376474 36.10522 15.13181 36.390791 15.966797 36.658203 L 14.369141 38.884766 C 13.428251 38.793006 11.587711 38.516568 9.5234375 37.716797 C 7.3314524 36.867546 5.1875783 35.508607 4.03125 33.673828 C 4.076698 29.105367 5.0568205 24.123544 6.28125 20.078125 C 6.9077487 18.008223 7.5904155 16.182095 8.2148438 14.792969 C 8.8320633 13.419879 9.4690336 12.454191 9.6699219 12.255859 C 12.696011 9.8986933 17.116173 9.2845319 18.263672 9.1445312 z M 18.5 21 C 17.047619 21 15.834562 21.674201 15.085938 22.636719 C 14.337312 23.599237 14 24.805556 14 26 C 14 27.194444 14.337313 28.400763 15.085938 29.363281 C 15.834561 30.325799 17.047619 31 18.5 31 C 19.952381 31 21.165439 30.325799 21.914062 29.363281 C 22.662687 28.400763 23 27.194444 23 26 C 23 24.805556 22.662688 23.599237 21.914062 22.636719 C 21.165439 21.674201 19.952381 21 18.5 21 z M 31.5 21 C 28.968421 21 27 23.315152 27 26 C 27 28.684848 28.968421 31 31.5 31 C 34.031579 31 36 28.684848 36 26 C 36 23.315152 34.031579 21 31.5 21 z M 18.5 23 C 19.380952 23 19.917896 23.325799 20.335938 23.863281 C 20.753979 24.400763 21 25.194444 21 26 C 21 26.805556 20.753979 27.599237 20.335938 28.136719 C 19.917896 28.674201 19.380952 29 18.5 29 C 17.619048 29 17.082104 28.674201 16.664062 28.136719 C 16.246021 27.599237 16 26.805556 16 26 C 16 25.194444 16.246021 24.400763 16.664062 23.863281 C 17.082104 23.325799 17.619048 23 18.5 23 z M 31.5 23 C 32.768421 23 34 24.284848 34 26 C 34 27.715152 32.768421 29 31.5 29 C 30.231579 29 29 27.715152 29 26 C 29 24.284848 30.231579 23 31.5 23 z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-6">Features</h3>
            <ul className="space-y-4">
              <li><a href="#features" className="text-gray-600 hover:text-brand-primary">WhatsApp Integration</a></li>
              <li><a href="#features" className="text-gray-600 hover:text-brand-primary">Phone Calls</a></li>
              <li><a href="#features" className="text-gray-600 hover:text-brand-primary">Progress Tracking</a></li>
              <li><a href="#features" className="text-gray-600 hover:text-brand-primary">Goal Setting</a></li>
              <li><a href="#features" className="text-gray-600 hover:text-brand-primary">AI Technology</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-6">Resources</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-600 hover:text-brand-primary">Blog</a></li>
              <li><Link to="/support" className="text-gray-600 hover:text-brand-primary">Support</Link></li>
              <li><a href="#faq" className="text-gray-600 hover:text-brand-primary">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-6">Company</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-600 hover:text-brand-primary">About Us</a></li>
              <li><Link to="/privacy-policy" className="text-gray-600 hover:text-brand-primary">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-600 hover:text-brand-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Coach Call AI. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="text-gray-500 text-sm hover:text-brand-primary">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-gray-500 text-sm hover:text-brand-primary">Terms of Service</Link>
            <a href="#" className="text-gray-500 text-sm hover:text-brand-primary">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
