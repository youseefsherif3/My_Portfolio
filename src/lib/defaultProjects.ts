export interface DefaultProject {
  title: string;
  description: string;
  tags: string[];
  image: string;
  imageAlt: string;
  github: string;
  live: string;
  featured?: boolean;
  highlight?: string;
  order?: number;
}

export const defaultProjects: DefaultProject[] = [
  {
    title: 'Saraha App Backend API',
    description:
      'A secure and scalable RESTful API for a Saraha-style anonymous messaging platform. Includes JWT authentication, email verification, role-based authorization, message privacy controls, and clean modular architecture.',
    tags: ['Node.js', 'Express', 'MongoDB', 'Google Auth'],
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb',
    imageAlt: 'Dark server terminal screen showing Node.js API code with green syntax highlighting',
    github: 'https://github.com/youseefsherif3/Saraha-App',
    live: '#',
    featured: true,
    highlight: '10K+ req/min',
    order: 1,
  },
  {
    title: 'Social Media App API',
    description:
      'A scalable social media application backend built with TypeScript and OOP principles. Delivers clean architecture, modular services, and production-focused APIs for users, posts, interactions, and secure authentication.',
    tags: ['TypeScript', 'Node.js', 'MongoDB', 'Zod'],
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7',
    imageAlt:
      'Dark abstract social network visualization with glowing connection nodes on black background',
    github: 'https://github.com/youseefsherif3/Social-Media-App',
    live: '#',
    highlight: 'In Development',
    order: 2,
  },
  {
    title: 'Birthday Project',
    description:
      'A celebratory interactive web experience designed to deliver a joyful birthday flow with polished visuals, smooth interactions, and responsive behavior across devices.',
    tags: ['JavaScript', 'HTML5', 'CSS3'],
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d',
    imageAlt: 'Colorful birthday celebration with confetti and balloons on a festive background',
    github: '#',
    live: 'https://youseefsherif3.github.io/Birthday_Project/',
    highlight: 'Live Demo',
    order: 3,
  },
  {
    title: 'Figma UI/UX Graduation Project',
    description:
      'A complete UI/UX design project crafted in Figma, from user flow mapping to high-fidelity screens. Focuses on clean visual hierarchy, consistent components, and accessible interactions.',
    tags: ['Figma', 'UI/UX', 'Design System'],
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5',
    imageAlt: 'Clean UI design mockup on a laptop screen showing a modern app interface in Figma',
    github: '#',
    live: 'https://www.figma.com/design/E2ODQZ8venRSnWNlvyUjYI/Final-Graduation-Project?node-id=0-1&t=Fi8stbAHbZcUAZ2R-1',
    highlight: 'Prototype Ready',
    order: 4,
  },
];
