export interface DefaultCertification {
  title: string;
  issuer: string;
  year: string;
  description: string;
  imageUrl: string;
  order?: number;
}

export const defaultCertifications: DefaultCertification[] = [
  {
    title: 'Front-End Development',
    issuer: 'Route Academy',
    year: '2025',
    description:
      'Comprehensive front-end training focused on React framework fundamentals, reusable components, state management, and building responsive user interfaces.',
    imageUrl: '',
    order: 1,
  },
  {
    title: 'UI/UX Design Essentials',
    issuer: 'Mahara Tech',
    year: '2026',
    description:
      'Hands-on design certification covering user research, wireframing, prototyping, and interface design best practices using Figma.',
    imageUrl: '',
    order: 2,
  },
];
