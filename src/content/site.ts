export const companyLinks = {
  yandexGo: 'https://taxi.yandex.ru/',
  yango: 'https://yango.com/en_int/',
  artec3d: 'https://www.artec3d.com/',
  artecCloud: 'https://www.artec3d.com/3d-software/artec-cloud',
  yandexMarket: 'https://market.yandex.ru/',
} as const;

export const site = {
  name: 'Sasha Korotina',
  role: 'Lead Product Designer',
  title: 'Sasha Korotina — Lead Product Designer',
  domain: 'https://aammnts.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/sashakorotina/',
    pinterest: 'https://ru.pinterest.com/aammnts/',
    ...companyLinks,
  },
} as const;

export const landingHero = {
  title: 'My Way',
  url: 'https://www.youtube.com/watch?v=G_SixH-y8wI',
} as const;

export const landingExperience = [
  {
    id: 'yandex-go',
    company: { name: 'Yandex Go', url: companyLinks.yandexGo },
    title: 'Product Designer → Lead Product Designer at Yandex Go, July 2021 – Present',
    paragraphs: [
      [
        'Yandex Go is a super app operating in Russia under the Yandex Go brand and in 30+ countries worldwide under the ',
        { text: 'Yango', url: companyLinks.yango },
        ' brand. It brings together services for users, drivers, and businesses, spanning B2C, B2B, and partner ecosystems.',
      ],
    ],
    sections: [
      {
        title: 'Part 1. Finding My Space and Shaping Vision',
        paragraphs: [
          `When I joined the team, there were two versions of the product: one for the Russian market and one for international users. One of our goals was to completely rethink the international version and turn it into a simplified, coherent set of tools that would support user workflows and business growth.`,
          `The second goal was to move away from maintaining two separate products. We needed to unify them under a single codebase while making it possible to scale the tools from simpler versions for growing markets to more advanced ones for mature markets.`,
          `My role was to dive into the industry context, rethink the entire product and its architecture, identify the core of what mattered most, and design a clear structure of tools, from basic to advanced. I also worked closely with the development team to align on how we would review and rebuild everything step by step, making sure we used our resources effectively.`,
        ],
      },
      {
        title: 'Part 2. Scaling Influence and Leading a Team',
        paragraphs: [
          `As our initial redesigns proved successful and impactful, the team began to grow. I moved into a leadership role, building and managing a team of four designers while continuing to design for the product myself.`,
          `Through this phase, I expanded my influence from shaping features to shaping how we work, think, and build as a design team.`,
        ],
      },
      {
        title: 'Building a Sustainable Foundation: The Design System',
        paragraphs: [
          `Alongside this, I initiated and developed a foundational design library with a small engineering team. This system now powers multiple projects across different business units, an experience that taught me how to design sustainable solutions that outlive their creators.`,
        ],
      },
    ],
    detailsHref: '/details/',
  },
  {
    id: 'artec3d',
    company: { name: 'Artec3D', url: companyLinks.artec3d },
    title: 'Product Designer at Artec3D, October 2019 – July 2021',
    paragraphs: [
      [
        { text: 'Artec Cloud', url: companyLinks.artecCloud },
        ' – web services for creating and editing 3D images.',
      ],
      `My first experience working on a new product in the web space, specifically related to 3D technologies. I was drawn to the idea of making complex tools more accessible, intuitive, and collaborative.`,
      `I focused on designing interfaces that made workflows easy to understand for both beginners and experienced users. This role gave me hands-on experience in structuring large, complex processes in a way that felt natural and efficient.`,
      `It was also where I developed my first strong collaborations with developers, learning how to communicate design ideas effectively and ensure their feasibility in implementation.`,
    ],
  },
  {
    id: 'yandex-market',
    company: { name: 'Yandex Market', url: companyLinks.yandexMarket },
    title: 'Summer Internship at Yandex Market in 2019',
    paragraphs: [
      `My start in a large corporation, where I had the opportunity to work on a real product alongside experienced professionals. This internship gave me foundational knowledge of product design, the chance to go through the full design process, and an understanding of collaboration with stakeholders in a structured environment.`,
    ],
  },
] as const;

export const detailsIntro =
  'The main project I worked on at Yandex was Partner Services for Taxi Companies. Together with the team, we transformed the product from a collection of raw data into an active guide for fleet partners, rebuilding it around action rather than tables.' as const;

export const detailsSections = [
  {
    id: 'about-the-project',
    title: 'About the Project',
    paragraphs: [
      `Instead of working only directly with drivers, Yandex built a three-sided model — focused on collaboration with fleet owners. This service was designed specifically for them — to help manage drivers, finances, and vehicles. In building it, it was important for us to keep the idea of working together, providing flexibility and guidance without taking over. We understood that each partner is an entrepreneur, with their own unique way of doing business.`,
      `When I joined product the taxi market in Russia was already mature. Large fleets dominated most of the business. Our product at that time often simply responded to the needs of major clients, creating custom sections and features for them.`,
      `We discovered that the product was 90% made of tables. Tables aren't bad in themselves — they represent deep information — but if you only have tables, you leave users alone with raw data. There was no guidance, no support — just facts to interpret on their own.`,
      `In Russia, we already knew that engagement with the service was very limited. Large fleet partners typically built API integrations and moved their operations to their own internal systems, while smaller partners exported data and managed everything in Excel. We had lost our users and could no longer support them in their daily operations.`,
      `For the international markets, we aimed to build something different from the start. We wanted to support users, help them structure their processes, offer direction while maintaining flexibility. This became our main challenge.`,
    ],
  },
  {
    id: 'rebuilding-the-product',
    title: 'Rebuilding the Product: From Data Dump to Actionable Insights',
    paragraphs: [
      `We began by questioning everything that had been built before. We matched the old solutions against what we learned from field research in Russia and Africa, and against what we envisioned for the future of the service.`,
      `The first thing we focused on was the Drivers Page — the partner's main asset. Originally, it was just an endless list of drivers: those currently working, those who had worked before, and those who hadn't yet started, all hidden behind countless filters. We made one simple but powerful change: we introduced a funnel. We showed that all drivers could be divided into three segments — new, active, and churn. This segmentation gave us a shared language with partners and made it clear that working with drivers in different segments requires different approaches.`,
      `Another fundamental shift was surfacing problems. Before, partners only reacted when drivers reached out to them. Now, they could immediately see how many drivers were blocked or facing issues. This made partners more proactive — they started calling drivers themselves and working through problems before they escalated. This change had a massive impact on SH, our key metric.`,
      `From this foundation, we kept building tools around attraction, problem detailing, and classification, but the core idea remained the same — make the invisible visible and turn data into action.`,
    ],
  },
  {
    id: 'introducing-dashboards',
    title: 'Speaking the Same Language: Introducing Dashboards',
    paragraphs: [
      `Dashboards allowed us to move away from overwhelming tables and start having real conversations with partners — about trends, dynamics, health, and risks. We could finally talk about the state of their business in a way that was tangible and meaningful, not buried in endless lists.`,
    ],
  },
  {
    id: 'park-owned-cars',
    title: 'Working with Park-Owned Cars: Strengthening the Ecosystem',
    paragraphs: [
      `The next direction we developed was working with partners who owned their vehicle fleets. These partners were often the most stable and contributed the most to SH. We built tools that helped them manage rentals, track expenses, and understand the overall economy of their park. For many partners, this was the first time they could see the financial picture of their operations clearly, all in one place.`,
    ],
  },
  {
    id: 'home-page',
    title: 'The Home Page: Building a Bigger Narrative',
    paragraphs: [
      `Finally, we created the Home Page — the main entry point into the service. Our goal was to move away from the language of raw data and start speaking about business health, opportunities, and risks in a unified way. The Home Page surfaced the most important aspects: financial analytics, key metrics around drivers and cars, and a unified view of issues and opportunities. It didn't just highlight problems — it suggested actions to take. It adapted based on the user's role and the type of park they managed. For the first time, we had a space that allowed us to talk to partners at a higher, strategic level, not just through isolated pieces of data. The Home Page continues to evolve today, but that first step changed the relationship between the product and its users fundamentally.`,
    ],
  },
  {
    id: 'in-short',
    title: 'In Short',
    paragraphs: [
      `We evolved from being a passive transmitter of information to becoming an active guide, helping partners see their challenges, understand their opportunities, and find their own way to grow. We didn't just show them data — we helped them build a business.`,
    ],
  },
] as const;
