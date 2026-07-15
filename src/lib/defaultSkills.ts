export interface DefaultSkill {
  name: string;
  level: number;
  category: string;
  icon: string;
  order?: number;
}

export const defaultSkills: DefaultSkill[] = [
  {
    name: 'Node.js',
    level: 90,
    category: 'Backend Development',
    icon: 'ServerStackIcon',
    order: 1,
  },
  {
    name: 'Express.js',
    level: 90,
    category: 'Backend Development',
    icon: 'ServerStackIcon',
    order: 2,
  },
  { name: 'NestJS', level: 80, category: 'Backend Development', icon: 'ServerStackIcon', order: 3 },
  {
    name: 'Socket.io',
    level: 78,
    category: 'Backend Development',
    icon: 'ServerStackIcon',
    order: 4,
  },
  {
    name: 'RESTful APIs',
    level: 92,
    category: 'APIs & Architecture',
    icon: 'CubeTransparentIcon',
    order: 1,
  },
  {
    name: 'GraphQL',
    level: 70,
    category: 'APIs & Architecture',
    icon: 'CubeTransparentIcon',
    order: 2,
  },
  {
    name: 'Mongoose',
    level: 78,
    category: 'APIs & Architecture',
    icon: 'CubeTransparentIcon',
    order: 3,
  },
  {
    name: 'Sequelize',
    level: 76,
    category: 'APIs & Architecture',
    icon: 'CubeTransparentIcon',
    order: 4,
  },
  {
    name: 'JWT & OAuth2',
    level: 88,
    category: 'APIs & Architecture',
    icon: 'CubeTransparentIcon',
    order: 5,
  },
  { name: 'MongoDB', level: 88, category: 'Databases', icon: 'CircleStackIcon', order: 1 },
  { name: 'MySQL', level: 82, category: 'Databases', icon: 'CircleStackIcon', order: 2 },
  { name: 'PostgreSQL', level: 78, category: 'Databases', icon: 'CircleStackIcon', order: 3 },
  { name: 'Redis', level: 70, category: 'Databases', icon: 'CircleStackIcon', order: 4 },
  { name: 'JavaScript', level: 90, category: 'Languages', icon: 'CpuChipIcon', order: 1 },
  { name: 'TypeScript', level: 85, category: 'Languages', icon: 'CpuChipIcon', order: 2 },
  { name: 'Python', level: 72, category: 'Languages', icon: 'CpuChipIcon', order: 3 },
  { name: 'C++', level: 68, category: 'Languages', icon: 'CpuChipIcon', order: 4 },
  {
    name: 'React.js',
    level: 78,
    category: 'Frontend Development',
    icon: 'ComputerDesktopIcon',
    order: 1,
  },
  {
    name: 'HTML5 & CSS3',
    level: 85,
    category: 'Frontend Development',
    icon: 'ComputerDesktopIcon',
    order: 2,
  },
  {
    name: 'Tailwind CSS',
    level: 82,
    category: 'Frontend Development',
    icon: 'ComputerDesktopIcon',
    order: 3,
  },
  {
    name: 'Bootstrap',
    level: 80,
    category: 'Frontend Development',
    icon: 'ComputerDesktopIcon',
    order: 4,
  },
  {
    name: 'Responsive Design',
    level: 82,
    category: 'Frontend Development',
    icon: 'ComputerDesktopIcon',
    order: 5,
  },
  { name: 'Figma', level: 80, category: 'UI/UX Design', icon: 'PaintBrushIcon', order: 1 },
  { name: 'User Research', level: 72, category: 'UI/UX Design', icon: 'PaintBrushIcon', order: 2 },
  { name: 'Prototyping', level: 78, category: 'UI/UX Design', icon: 'PaintBrushIcon', order: 3 },
  { name: 'Wireframing', level: 80, category: 'UI/UX Design', icon: 'PaintBrushIcon', order: 4 },
  { name: 'Design Systems', level: 75, category: 'UI/UX Design', icon: 'PaintBrushIcon', order: 5 },
];
