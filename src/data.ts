// GLOBAL LOGO AND BRANDING
export interface SiteAssets {
  logoURL: string;
  faviconUrl?: string;
  hero_rnd: string;
  hero_robots: string;
  hero_solar: string;
  [key: string]: string | undefined;
}

export const SITE_ASSETS: SiteAssets = {
  logoURL: 'https://raw.githubusercontent.com/Ohans8248/wingstech/main/Images/LogoLight.png?w=90&h=90&fit=crop', // Add your logo image here
  faviconUrl: 'https://raw.githubusercontent.com/Ohans8248/wingstech/main/Images/Favicon.png?w=90&h=90&fit=crop',
  hero_rnd: 'https://raw.githubusercontent.com/Ohans8248/wingstech/main/Images/RnD_Image.png?auto=format&fit=crop&q=80', 
  hero_robots: 'https://raw.githubusercontent.com/Ohans8248/wingstech/main/Images/Robots.png?auto=format&fit=crop&q=80',
  hero_solar: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80'
};

export interface WebsiteContent {
  hero_1_title: string;
  hero_1_desc: string;
  hero_2_title: string;
  hero_2_desc: string;
  hero_3_title: string;
  hero_3_desc: string;
  action_card_1_title: string;
  action_card_1_desc: string;
  action_card_2_title: string;
  action_card_2_desc: string;
  action_card_3_title: string;
  action_card_3_desc: string;
  about_us_title: string;
  about_us_text: string;
  why_us_title: string;
  why_us_points: { title: string; desc: string }[];
  rnd_form_title?: string;
  products_title?: string;
}

export const SITE_TEXT: WebsiteContent = {
  hero_1_title: "R&D Solutions",
  hero_1_desc: "We can provide custom hi-tech solutions to any of your engineering problems!",
  hero_2_title: "Cutting-Edge Robots",
  hero_2_desc: "Need robots to learn or for industry? We have a rich collection of robots & tools!",
  hero_3_title: "Solar PV Installation",
  hero_3_desc: "Thinking of Solar Setup? We can Take Complete Responsibility of Setting Solar Setup!",
  action_card_1_title: "Get R&D Solutions",
  action_card_1_desc: "Let us handle any of your hi-tech problems. We love to solve!",
  action_card_2_title: "Make Home Smart",
  action_card_2_desc: "Let's talk about making your flat a smart & IOT automated residence!",
  action_card_3_title: "A2Z Solar Setup Support",
  action_card_3_desc: "Rooftop/Grounded, we can provide complete support.",
  about_us_title: "About WingsTech",
  about_us_text: "WingsTech is a BUETian-owned platform offering R&D support for industries, along with built-in-Bangladesh robots, solar power installation, and solar products.\n\nWe believe in strong industry collaboration and the development of Bangladesh’s R&D ecosystem.\n\nOur strength is our confidence, commitment, and excellence in solving real-world problems through practical, technology-driven solutions.",
  why_us_title: "Why Choose WingsTech?",
  why_us_points: [
    { title: "Custom Problem, Custom Solution", desc: "Even if you are alone in the world facing the problem, we want to here about it!" },
    { title: "Expert Engineers", desc: "Our team comprises experts with decades of combined experience in R&D." },
    { title: "Problem Solving Mindset", desc: "We are not afraid of problems, we solve it with confidence." },
    { title: "End-to-End Support", desc: "From day-0 to deployment & maintenance, we are with you." }
  ],
  rnd_form_title: "Tell us about your need",
  products_title: "Our Products"
};

export interface ProductVariant {
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'robots' | 'tools';
  images: string[];
  variants: ProductVariant[];
  description?: string;
  longDescription?: string;
}

export const PRODUCT_DATA: Product[] = [
  // Robots
  { 
    id: 'r1', 
    name: 'SO101 Robot Arm', 
    category: 'robots', 
    variants: [{ name: 'Unassembled Leader+Follower+Cam', price: 44950 }, { name: 'Assembled Ready Robot', price: 53950 }], 
    images: ['https://raw.githubusercontent.com/Ohans8248/wingstech/main/Images/SO101.png?auto=format&fit=crop&q=80'],
    description: `Experience the next level of innovation with the SO101 Robot Arm. Designed specifically for the robots industry, this product combines cutting-edge engineering with user-friendly operation.

Backed by WingsTech's comprehensive R&D and support, you can rely on this robust solution to meet your most demanding requirements. Whether you're upgrading your current systems or exploring new possibilities, this product offers unparalleled value and performance.`
  },
  { 
    id: 'r2', 
    name: 'LeKiwi Mobile Robot', 
    category: 'robots', 
    variants: [{ name: 'Robot with Cam, w/o RPi, w/o Arms', price: 29950 }, { name: 'Robot with one SO101 Arm & Cam, w/o RPi', price: 56950 },{ name: 'LekiWi Robot with SO101 Leader & Follower&Cam, w/o RPi', price: 79950 },{ name: 'LekiWi, SO101 Leader & Follower, Cam, RPi 5 4GB', price: 105000 }], 
    images: ['https://raw.githubusercontent.com/Ohans8248/wingstech/main/Images/LeKiwi.png?auto=format&fit=crop&q=80'],
    description: `Experience the next level of innovation with the LeKiwi Mobile Robot. Designed specifically for the robots industry, this product combines cutting-edge engineering with user-friendly operation.

Backed by WingsTech's comprehensive R&D and support, you can rely on this robust solution to meet your most demanding requirements. Whether you're upgrading your current systems or exploring new possibilities, this product offers unparalleled value and performance.`
  },
  { 
    id: 'r3', name: 'Twin Koch V1.1 Robot Arm with Cam', category: 'robots', variants: [{ name: 'Standard', price: 125000 }], images: ['https://raw.githubusercontent.com/Ohans8248/wingstech/main/Images/Koch.png?auto=format&fit=crop&q=80'],
    description: `Experience the next level of innovation with the Twin Koch V1.1 Robot Arm with Cam. Designed specifically for the robots industry, this product combines cutting-edge engineering with user-friendly operation.

Backed by WingsTech's comprehensive R&D and support, you can rely on this robust solution to meet your most demanding requirements. Whether you're upgrading your current systems or exploring new possibilities, this product offers unparalleled value and performance.`
  },
  { 
    id: 'r4', name: 'Ardupilot Based Drone', category: 'robots', variants: [{ name: 'Standard', price: 99500 }], images: ['https://raw.githubusercontent.com/Ohans8248/wingstech/main/Images/ArduDrone.png?auto=format&fit=crop&q=80'],
    description: `Experience the next level of innovation with the Ardupilot Based Drone. Designed specifically for the robots industry, this product combines cutting-edge engineering with user-friendly operation.

Backed by WingsTech's comprehensive R&D and support, you can rely on this robust solution to meet your most demanding requirements. Whether you're upgrading your current systems or exploring new possibilities, this product offers unparalleled value and performance.`
  },
  { id: 'r5', name: 'Pupper Quadraped Dog Robot', category: 'robots', variants: [{ name: 'Standard', price: 150000 }], images: ['https://raw.githubusercontent.com/Ohans8248/wingstech/main/Images/Pupper.png?auto=format&fit=crop&q=80'],
    description: `Experience the next level of innovation with the Stanford Pupper Quadraped Dog Robot. Designed specifically for the robots industry, this product combines cutting-edge engineering with user-friendly operation.

Backed by WingsTech's comprehensive R&D and support, you can rely on this robust solution to meet your most demanding requirements. Whether you're upgrading your current systems or exploring new possibilities, this product offers unparalleled value and performance.`
  },
  { 
    id: 'r6', 
    name: 'Kilobot Swarm Robots', 
    category: 'robots', 
    variants: [{ name: '10 Kilobot Swarm Robots', price: 34900 }, { name: '20 Kilobot Swarm Robots', price: 59950 }], 
    images: ['https://raw.githubusercontent.com/Ohans8248/wingstech/main/Images/Kilobot.png?auto=format&fit=crop&q=80'],
    description: `Experience the next level of innovation with the Kilobot Swarm Robots. Designed specifically for the robots industry, this product combines cutting-edge engineering with user-friendly operation.

Backed by WingsTech's comprehensive R&D and support, you can rely on this robust solution to meet your most demanding requirements. Whether you're upgrading your current systems or exploring new possibilities, this product offers unparalleled value and performance.`
  },
  { id: 'r7', name: 'ArduPilot Boat', category: 'robots', variants: [{ name: 'Standard', price: 93500 }], images: ['https://raw.githubusercontent.com/Ohans8248/wingstech/main/Images/ArduBoat.png?auto=format&fit=crop&q=80'],
    description: `Experience the next level of innovation with the ArduPilot Boat. Designed specifically for the robots industry, this product combines cutting-edge engineering with user-friendly operation.

Backed by WingsTech's comprehensive R&D and support, you can rely on this robust solution to meet your most demanding requirements. Whether you're upgrading your current systems or exploring new possibilities, this product offers unparalleled value and performance.`
  },
  { 
    id: 'r8', 
    name: 'Mona Swarm Robots', 
    category: 'robots', 
    variants: [{ name: '10 Mona Swarm Robots', price: 99500 }, { name: '20 Mona Swarm Robots', price: 180000 }], 
    images: ['https://raw.githubusercontent.com/Ohans8248/wingstech/main/Images/Mona.png?auto=format&fit=crop&q=80'],
    description: `Experience the next level of innovation with the Mona Swarm Robots. Designed specifically for the robots industry, this product combines cutting-edge engineering with user-friendly operation.

Backed by WingsTech's comprehensive R&D and support, you can rely on this robust solution to meet your most demanding requirements. Whether you're upgrading your current systems or exploring new possibilities, this product offers unparalleled value and performance.`
  },
  { id: 'r9', name: 'OpenROV Inspired AUV', category: 'robots', variants: [{ name: 'Standard', price: 93500 }], images: ['https://raw.githubusercontent.com/Ohans8248/wingstech/main/Images/AUV.png?auto=format&fit=crop&q=80'],
    description: `Experience the next level of innovation with the OpenROV Inspired AUV. Designed specifically for the robots industry, this product combines cutting-edge engineering with user-friendly operation.

Backed by WingsTech's comprehensive R&D and support, you can rely on this robust solution to meet your most demanding requirements. Whether you're upgrading your current systems or exploring new possibilities, this product offers unparalleled value and performance.`
  },

  // Tools & Solutions

];

export const CURRENCY = '৳';

export const PAGE_HEADLINES = {
  home: "WingsTech",
  services: "Select Service Domains",
  products: "Our Products",
  solar: "Tools & Solutions",
  contact: "Contact Us",
  inquiryForm: "Tell us about your need"
};

export const SERVICE_DOMAINS = [
  { id: 'robotics', label: 'Robotics', icon: 'fa-robot' },
  { id: 'ai', label: 'AI', icon: 'fa-brain' },
  { id: 'automation', label: 'Automation', icon: 'fa-gears' },
  { id: 'agriculture', label: 'Agriculture/Agro', icon: 'fa-seedling' },
  { id: 'healthcare', label: 'Healthcare', icon: 'fa-heart-pulse' },
  { id: 'surveillance', label: 'Surveillance', icon: 'fa-video' },
  { id: 'rnd', label: 'R&D', icon: 'fa-flask' },
  { id: 'others', label: 'Others', icon: 'fa-plus' }
];

export interface ContactInfo {
  phone: string;
  whatsappNumber: string;
  email: string;
  officeAddress: string;
  defaultMessage: string;
  socialLinks: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    [key: string]: string | undefined;
  };
}

export const CONTACT_INFO: ContactInfo = {
  phone: '+880 1972785642',
  whatsappNumber: '+8801972785642',
  email: 'wingstech.xyz@gmail.com',
  officeAddress: 'Agargaon, Dhaka',
  defaultMessage: 'Hello WingsTech, I have an inquiry.',
  socialLinks: {
    facebook: 'https://facebook.com/',
    linkedin: 'https://linkedin.com/',
    twitter: 'https://twitter.com/'
  }
};
