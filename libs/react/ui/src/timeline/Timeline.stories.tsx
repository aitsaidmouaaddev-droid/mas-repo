import type { Meta, StoryObj } from '@storybook/react';
import Timeline from './Timeline';

const meta: Meta<typeof Timeline> = {
  title: 'UI/Timeline',
  component: Timeline,
};

export default meta;
type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  args: {
    items: [
      { title: 'Senior Developer', subtitle: '2021 - Present' },
      { title: 'Junior Developer', subtitle: '2019 - 2021' },
    ],
  },
};

export const WithDescription: Story = {
  args: {
    items: [
      {
        title: 'Lead Engineer',
        subtitle: '2022 - Present',
        location: 'TechCorp, Berlin',
        description: 'Leading a cross-functional team building a SaaS platform.',
        bullets: ['Architected microservices backend', 'Reduced deploy time by 60%'],
      },
      {
        title: 'Software Engineer',
        subtitle: '2020 - 2022',
        location: 'StartupX, Paris',
        description: 'Full-stack development on the core product.',
        bullets: ['Implemented real-time notifications', 'Built CI/CD pipeline'],
      },
    ],
  },
};

export const WithSubItems: Story = {
  args: {
    items: [
      {
        title: 'IT Consultant',
        subtitle: '2019 - Present',
        location: 'ConsultingFirm, Lyon',
        subItems: [
          {
            title: 'Mission: Banking App',
            subtitle: '2022 - Present',
            description: 'Developed a mobile banking application for retail customers.',
            bullets: ['React Native frontend', 'Integrated biometric authentication'],
          },
          {
            title: 'Mission: E-commerce Platform',
            subtitle: '2021 - 2022',
            description: 'Built a headless commerce solution.',
            bullets: ['Next.js storefront', 'Stripe payment integration'],
          },
          {
            title: 'Mission: Internal Tools',
            subtitle: '2019 - 2021',
            description: 'Created internal dashboards and automation tools.',
            bullets: ['Angular admin panel', 'Python ETL scripts'],
          },
        ],
      },
    ],
  },
};

export const EducationExample: Story = {
  args: {
    items: [
      {
        title: 'M.Sc. Computer Science',
        subtitle: '2017 - 2019',
        location: 'University of Lyon',
        description: 'Specialization in distributed systems and machine learning.',
        bullets: ['Thesis on federated learning', "Dean's list 2018-2019"],
      },
      {
        title: 'B.Sc. Mathematics',
        subtitle: '2014 - 2017',
        location: 'University of Paris',
        bullets: ['Minor in computer science', 'Graduated with honors'],
      },
    ],
  },
};

export const ExperienceExample: Story = {
  args: {
    items: [
      {
        title: 'Staff Engineer',
        subtitle: 'Jan 2023 - Present',
        location: 'MegaCorp, Remote',
        description: 'Technical leadership across three product teams.',
        bullets: [
          'Defined architecture standards adopted company-wide',
          'Mentored 8 engineers across two time zones',
          'Reduced infrastructure costs by 35%',
        ],
      },
      {
        title: 'Senior Software Engineer',
        subtitle: 'Mar 2020 - Dec 2022',
        location: 'ScaleUp Inc., Berlin',
        description: 'Core platform team building shared services.',
        bullets: [
          'Designed event-driven architecture handling 10k events/sec',
          'Led migration from monolith to microservices',
        ],
      },
      {
        title: 'Software Engineer',
        subtitle: 'Sep 2018 - Feb 2020',
        location: 'Agency, Paris',
        bullets: ['Delivered 12 client projects on time', 'Built reusable component library'],
      },
    ],
  },
};
