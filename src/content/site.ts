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
    id: 'yandex-taxi',
    company: { name: 'Yandex Taxi', url: companyLinks.yandexGo },
    title: 'Product Designer → Lead Product Designer at Yandex Taxi, July 2021 – Present',
    paragraphs: [
      [
        'Yandex Taxi is a mobility ecosystem operating in Russia under the Yandex Go brand and internationally under ',
        { text: 'Yango', url: companyLinks.yango },
        ' in 30+ countries. It includes products for passengers, drivers, and taxi fleet owners. I work on the B2B platform for fleet owners, designing tools to manage drivers, vehicles, finances, and daily operations.',
      ],
    ],
    sections: [
      {
        title: 'Part 1. Finding My Space and Shaping Vision',
        paragraphs: [
          `When I joined the team, there were two versions of the partners' product: one for the Russian market and one for international users. One of our goals was to completely rethink the international version and turn it into a simplified, coherent set of tools that would support user workflows and business growth.`,
          `My role was to dive into the industry context, rethink the entire product and its architecture, identify the core of what mattered most, and design a clear structure of tools, from basic to advanced.`,
        ],
      },
      {
        title: 'Part 2. Scaling Influence and Leading a Team',
        paragraphs: [
          `As the product grew, the team grew with it. I moved into a leadership role, building and managing a team of four designers while continuing to design for the product myself.`,
          `Over time, my role expanded beyond product design. I became responsible not only for shaping the product, but also for shaping how our design team worked, made decisions, and collaborated across disciplines.`,
        ],
      },
      {
        title: 'Building a Sustainable Foundation: The Design System',
        paragraphs: [
          `Parallel to this, we developed a foundational design library with a small engineering team. This system now powers multiple projects across different business units — an experience that taught me how to design sustainable solutions that outlive their creators.`,
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
  'My work at Yandex Taxi focuses on Fleet, the B2B platform for taxi fleet owners. Together with the team, we transformed this product from a collection of raw data into an active guide for fleet owners, rebuilding it around action rather than tables.' as const;

export const detailsCalendars = [
  { after: 'intro', src: '/calendar-2022.svg', alt: '2022', reveal: 'load' },
  { after: 'rebuilding-the-product', src: '/calendar-2021.svg', alt: '2021', reveal: 'scroll' },
] as const;

export const detailsShowcases = [
  {
    after: 'about-the-project',
    initialOrder: [1, 2, 0],
    images: [
      { src: '/showcase/vehicles.png', alt: 'Vehicles dashboard' },
      { src: '/showcase/transaction-report.png', alt: 'Transaction report' },
      { src: '/showcase/vehicles-expenses.png', alt: 'Vehicles expenses' },
    ],
  },
] as const;

export const detailsSections = [
  {
    id: 'about-fleet',
    title: 'About Fleet',
    paragraphs: [
      `Yandex Taxi is built around three sides: passengers, drivers, and taxi fleet owners. Fleet is the B2B platform designed for taxi fleet owners to manage drivers, vehicles, finances, and daily operations.`,
      `One of our key principles was preserving the idea of partnership. Rather than taking control of a fleet owner's business, we wanted to provide visibility, guidance, and flexibility. We understood that each partner is an entrepreneur, with their own unique way of doing business.`,
    ],
  },
  {
    id: 'about-the-project',
    title: 'About the Project',
    paragraphs: [
      `When I joined the product, the taxi market in Russia was already mature. Large fleets dominated most of the business, and over the years our product had gradually evolved around their specific requests. Instead of a coherent system, it became a collection of custom sections and features.`,
      `As a result, almost 90% of the product consisted of tables. Tables aren't bad in themselves — they represent deep information. But when a product is built almost entirely around tables, users are left alone with raw data. There was no guidance, no support, just facts to interpret on their own.`,
      `In Russia, we already knew that engagement with the service was very limited. Large fleet partners typically built API integrations and moved their operations to their own internal systems, while smaller partners exported data and managed everything in Excel. We had lost our users and could no longer support them in their daily operations.`,
      `For the international markets, we aimed to build something different from the start. We wanted to support users, help them structure their processes, offer direction while maintaining flexibility. This became our main challenge.`,
    ],
  },
  {
    id: 'rebuilding-the-product',
    title: 'Rebuilding the Product: From Data Dump to Actionable Insights',
    paragraphs: [
      `We began by questioning everything that had been built before. We compared the old solutions with what we learned from field research in Russia and Africa, and with what we envisioned for the future of the service.`,
      `We started with the Drivers Page. Drivers are the most important asset for any taxi fleet owner. Every partner constantly needs to attract new drivers, support active ones, and bring back those who have stopped working. Yet the product treated every driver exactly the same. The page was simply an endless table with countless filters.`,
      `We made one simple but powerful change: we introduced a funnel. We showed that all drivers could be divided into three segments — new, active, and churn.`,
      `This segmentation gave us a shared language with fleet owners and made it clear that each group required different actions. For the first time, the product reflected how fleet owners actually managed their business.`,
      `Another fundamental shift was making problems visible. Before, partners usually reacted only when drivers reached out to them. We introduced clear indicators for drivers at risk of becoming blocked, as well as those who had already been blocked.`,
      `Instead of waiting for drivers to ask for help, partners became proactive. They started reaching out first, resolving issues before drivers stopped working, or helping blocked drivers return to work faster. This change had a direct impact on one of our key business metrics — supply hours.`,
      `From this foundation, we continued building tools around driver attraction, problem investigation, and classification, but the core idea remained the same — make the invisible visible and turn data into action.`,
    ],
  },
  {
    id: 'what-we-built-next',
    title: '',
    paragraphs: [
      `The same principles shaped everything we built afterwards. We introduced a layer of aggregated insights across drivers, vehicles, and finances. Instead of navigating endless tables, partners could understand the overall health of their business at a glance. Dashboards gave us a shared language for discussing key business indicators and made it easier to focus on what actually required attention.`,
      `We also introduced dedicated tools for partners who owned their own vehicle fleets, giving them visibility into rentals, expenses, and profitability.`,
      `Finally, we created the Home Page, bringing everything together into a single strategic view of the business. It highlighted opportunities, risks, and the next actions to take, allowing us to speak to partners about their business as a whole rather than through isolated pieces of data.`,
    ],
  },
  {
    id: 'the-next-challenge-adoption',
    title: 'The Next Challenge: Adoption',
    paragraphs: [
      `By this point, we had built a much stronger product. New workflows, dashboards, and tools were in place, and it felt like we had solved the main problems.`,
      `Reality turned out to be more complicated.`,
      `Many of these tools weren't adopted as actively as we had expected. This forced us to step back and rethink not only the product itself, but also how people learn, change their habits, and gradually build new ways of working.`,
      `One of the biggest lessons for me was realizing how diverse our partners really were. Some had been running fleets for years with established processes, while others were just starting their business. Designing for everyone with the same level of complexity simply didn't work.`,
      `Instead, we learned to introduce new functionality in its simplest form, giving partners time to adopt new behaviors before expanding into more advanced workflows. Complexity shouldn't be delivered all at once — it should grow together with the user's experience.`,
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
